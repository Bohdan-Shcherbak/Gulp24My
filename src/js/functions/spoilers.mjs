import { _slideToggle, dataMediaQueries,_slideUp, _slideDown } from "js/modules.mjs";

/*<!-- Контейнер для групи спойлерів -->
<div data-spollers data-one-spoller data-spollers-speed="300" class="spollers-block">
    Спойлер №1
    <div class="spollers-block__item">
        <!-- Кнопка, на яку клікають -->
        <button type="button" data-spoller class="spollers-block__title">Заголовок спойлера 1</button>
        <!-- Контент, який ховається/показується (обов'язково одразу після кнопки) -->
        <div class="spollers-block__body">
        Контент першого спойлера. Тут може бути будь-який HTML-текст, картинки тощо.
        </div>
    </div>
    <!-- Спойлер №2 (Відкритий за замовчуванням) -->
    <div class="spollers-block__item">
        <button type="button" data-spoller class="spollers-block__title _spoller-active">Заголовок спойлера 2 (Активний)</button>
        <div class="spollers-block__body">
        Контент другого спойлера, який буде видно відразу при завантаженні сторінки.
        </div>
    </div>
</div>*/

// data-spollers="768,max

// data-one-spoller -На головний батьківський контейнер.Режим акордеона. Якщо атрибут є, 
// то при відкритті одного спойлера — інший автоматично закривається. Якщо атрибута немає — 
// можна відкрити всі одночасно.

// data-spollers-speed="300" - На головний батьківський контейнер.Швидкість анімації у 
// мілісекундах. Якщо не вказати, за замовчуванням буде 500 (0.5 секунди).

// data-spoller - На елемент-кнопку (заголовок). -Маркер кнопки. Робить елемент клікабельним
//  для відкриття контенту. Краще використовувати тег <button>

// _spoller-active - активний - На елемент-кнопку (клас, не атрибут)

// data-spoller-close - На елемент-кнопку (заголовок).- Закриття поза спойлером. Якщо додати
// цей атрибут, то при кліку в будь-яке порожнє місце сайту (повз спойлер) — цей спойлер 
// автоматично закриється.

export function spollers() {
	const spollersArray = document.querySelectorAll('[data-spollers]');
	if (spollersArray.length > 0) {
		// Отримання звичайних слойлерів
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		});
		// Ініціалізація звичайних слойлерів
		if (spollersRegular.length) {
			initSpollers(spollersRegular);
		}
		// Отримання слойлерів з медіа-запитами
		let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				// Подія
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
		// Ініціалізація
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_spoller-init');
					initSpollerBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove('_spoller-init');
					initSpollerBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			});
		}
		// Робота з контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
			if (spollerTitles.length) {
				spollerTitles = Array.from(spollerTitles).filter(item => item.closest('[data-spollers]') === spollersBlock);
				spollerTitles.forEach(spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex');
						if (!spollerTitle.classList.contains('_spoller-active')) {
							spollerTitle.nextElementSibling.hidden = true;
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1');
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest('[data-spoller]')) {
				const spollerTitle = el.closest('[data-spoller]');
				const spollersBlock = spollerTitle.closest('[data-spollers]');
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
				const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
				if (!spollersBlock.querySelectorAll('._slide').length) {
					if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
						hideSpollersBody(spollersBlock);
					}
					spollerTitle.classList.toggle('_spoller-active');
					_slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
				}
				e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');
			const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
			if (spollerActiveTitle && !spollersBlock.querySelectorAll('._slide').length) {
				spollerActiveTitle.classList.remove('_spoller-active');
				_slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
			}
		}
		// Закриття при кліку поза спойлером
		const spollersClose = document.querySelectorAll('[data-spoller-close]');
		if (spollersClose.length) {
			document.addEventListener("click", function (e) {
				const el = e.target;
				if (!el.closest('[data-spollers]')) {
					spollersClose.forEach(spollerClose => {
						const spollersBlock = spollerClose.closest('[data-spollers]');
						if (spollersBlock.classList.contains('_spoller-init')) {
							const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
							spollerClose.classList.remove('_spoller-active');
							_slideUp(spollerClose.nextElementSibling, spollerSpeed);
						}
					});
				}
			});
		}
	}
}