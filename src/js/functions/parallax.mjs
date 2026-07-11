import { flsModules } from '../modules.mjs';

class Parallax {
	constructor(elements) {
		this.elements = [];
		if (elements && elements.length) {
			this.elements = Array.from(elements).map((el) => (
				new Parallax.Each(el, this.options)
			));
		}
	}
	destroyEvents() {
		this.elements.forEach(el => {
			el.destroyEvents();
		});
	}
	setEvents() {
		this.elements.forEach(el => {
			el.setEvents();
		});
	}
}

Parallax.Each = class {
	constructor(parent) {
		this.parent = parent;
		this.elements = this.parent.querySelectorAll('[data-prlx]');
		this.animation = this.animationFrame.bind(this);
		this.offset = 0;
		this.value = 0;
		this.smooth = parent.dataset.prlxSmooth ? Number(parent.dataset.prlxSmooth) : 15;
		this.isActive = false; // Додаємо прапорець контролю
		this.setEvents();
	}
	setEvents() {
		if (!this.isActive) {
			this.isActive = true;
			this.animationID = window.requestAnimationFrame(this.animation);
		}
	}
	destroyEvents() {
		this.isActive = false; // Вимикаємо прапорець
		window.cancelAnimationFrame(this.animationID);
		
		// Скидаємо стилі трансформації, щоб елементи не зависали зсунутими
		this.elements.forEach(el => {
			el.style.transform = '';
		});
	}
	animationFrame() {
		// Якщо анімацію вимкнули ззовні — зупиняємо виконання і НЕ плануємо наступний кадр
		if (!this.isActive) return;

		const topToWindow = this.parent.getBoundingClientRect().top;
		const heightParent = this.parent.offsetHeight;
		const heightWindow = window.innerHeight;
		const positionParent = {
			top: topToWindow - heightWindow,
			bottom: topToWindow + heightParent,
		}
		const centerPoint = this.parent.dataset.prlxCenter ?
			this.parent.dataset.prlxCenter : 'center';

		if (positionParent.top < 30 && positionParent.bottom > -30) {
		// Елемент у початковому положенні (0,0), коли батько знаходиться по відношенню до екрану: 
			switch (centerPoint) {
				// верхній точці (початок батька стикається верхнього краю екрану)
				case 'top':
					this.offset = -1 * topToWindow;
					break;
				// центрі екрана (середина батька у середині екрана)
				case 'center':
					this.offset = (heightWindow / 2) - (topToWindow + (heightParent / 2));
					break;
				// Початок: нижня частина екрана = верхня частина батька
				case 'bottom':
					this.offset = heightWindow - (topToWindow + heightParent);
					break;
			}
		}

		this.value += (this.offset - this.value) / this.smooth;
		
		this.elements.forEach(el => {
			const parameters = {
				axis: el.dataset.axis ? el.dataset.axis : 'v',
				direction: el.dataset.direction ? el.dataset.direction + '1' : '-1',
				coefficient: el.dataset.coefficient ? Number(el.dataset.coefficient) : 5,
				additionalProperties: el.dataset.properties ? el.dataset.properties : '',
			}
			this.parameters(el, parameters);
		});

		// Плануємо наступний кадр ТІЛЬКИ якщо анімація все ще активна
		if (this.isActive) {
			this.animationID = window.requestAnimationFrame(this.animation);
		}
	}
	parameters(el, parameters) {
		if (parameters.axis == 'v') {
			el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`
		} else if (parameters.axis == 'h') {
			el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`
		}
	}
}

const parallaxParents = document.querySelectorAll('[data-prlx-parent]');

function screnCheck() {
	// 1. Спочатку ЗАВЖДИ вбиваємо старий паралакс, якщо він існував
	if (flsModules.parallax) {
		flsModules.parallax.destroyEvents();
		flsModules.parallax = null;
	}

	if (parallaxParents.length) {
		// Залишаємо в масиві тільки ті секції, де паралакс ДОЗВОЛЕНИЙ на поточному екрані
		const activeParents = Array.from(parallaxParents).filter(parent => {
		// Якщо атрибута немає, значить паралакс працює завжди і на всіх екранах
			if (!parent.dataset.prlxMedia) return true;

			// Розбиваємо рядок "768,min" на масив: breakpoint = "768", type = "min"
			const [breakpoint, type] = parent.dataset.prlxMedia.split(',');
			// Автоматично збираємо стандартний медіа-запит, наприклад: "(min-width: 768px)" або "(max-width: 768px)"
			const mediaQueryString = `(${type.trim()}-width: ${breakpoint.trim()}px)`;
			// Перевіряємо, чи збігається поточний екран з умовою. 
			// Якщо збігається (true) — паралакс запуститься. Якщо ні (false) — секція ігнорується.
			return window.matchMedia(mediaQueryString).matches;
		});

		// 2. Вмикаємо новий паралакс лише для дозволених екранів
		if (activeParents.length) {
			flsModules.parallax = new Parallax(activeParents);
		}
	}
}

// Запуск при першому завантаженні
screnCheck();

// Відстеження зміни орієнтації та розміру екрану з оптимізацією (debounce-подібний таймаут)
let resizeTimeout;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		screnCheck();
	}, 150); // Невеликий таймаут, щоб не перевантажувати процесор при розтягуванні екрану вручну
});
