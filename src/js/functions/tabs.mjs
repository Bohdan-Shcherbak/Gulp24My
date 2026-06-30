import { getHash, setHash, dataMediaQueries, _slideUp, _slideDown } from "js/modules.mjs";

// data-tabs ="767.98,max" - Обов'язковий атрибут. Вмикає роботу табів. 
// Якщо вказати медіа-запит, таби перетворяться на мобільних на спойлери.
// data-tabs-animate - Порожньо або Число (напр., 300)-Вмикає плавне JS-розгортання контенту.
// Якщо порожньо — анімація триває 500 мс. Якщо вказати число — це час у мілісекундах
// data-tabs-hash - Без значення - Вмикає стеження за адресним рядком. При кліку на таб в 
// URL додається унікальний хеш (наприклад, #tab-0-1).

/* Головний контейнер з усіма налаштуваннями
<div data-tabs="767.98,max" data-tabs-animate="300" data-tabs-hash class="tabs">
    
    <!-- Панель навігації (заголовки) -->
    <nav data-tabs-titles class="tabs__navigation">
        <!-- Перший таб активний за замовчуванням завдяки класу _tab-active -->
        <button type="button" class="tabs__title _tab-active">Опис товару</button>
        <button type="button" class="tabs__title">Характеристики</button>
        <button type="button" class="tabs__title">Відгуки (12)</button>
    </nav>
    
    <!-- Тіло табів (контент) -->
    <div data-tabs-body class="tabs__content">
        <div class="tabs__body">
            <h3>Опис товару</h3>
            <p>Тут знаходиться детальний опис вашого продукту...</p>
        </div>
        <div class="tabs__body">
            <h3>Технічні характеристики</h3>
            <p>Вага: 1.2 кг, Матеріал: Алюміній, Колір: Чорний.</p>
        </div>
        <div class="tabs__body">
            <h3>Відгуки покупців</h3>
            <p>Чудовий товар, швидко доставили! Рекомендую.</p>
        </div>
    </div>

</div>*/

// Модуль роботи з табами =======================================================================================================================================================================================================================
export function tabs() {    
    const tabs = document.querySelectorAll('[data-tabs]');
    let tabsActiveHash = [];

    if (tabs.length > 0) {
        const hash = getHash();
        // перевірка що існує потрібний хеш і що цей хеш саме потрібний
        if (hash && hash.startsWith('tab-')) {
            tabsActiveHash = hash.replace('tab-', '').split('-');
        }
        // додавання класу, атрибуту зі значенням індексу і клік для виклику функції
        tabs.forEach((tabsBlock, index) => {
            tabsBlock.classList.add('_tab-init');
            tabsBlock.setAttribute('data-tabs-index', index);
            tabsBlock.addEventListener("click", setTabsAction);
            initTabs(tabsBlock);
        });

        // Отримання слойлерів з медіа-запитами
        let mdQueriesArray = dataMediaQueries(tabs, "tabs");
        if (mdQueriesArray && mdQueriesArray.length) {
            mdQueriesArray.forEach(mdQueriesItem => {
                // Перевіряє зміни і заускає фкнкцію щоб праильно стояли стилі
                mdQueriesItem.matchMedia.addEventListener("change", function () {
                    setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                });
                // при завантаженні перевіряє розширення
                setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            });
        }
    }
    // Встановлення позицій заголовків. 
    // змінює DOM-структуру: на десктопі заголовки лежать вгорі разом,
    //  а на мобільці — кожен заголовок стає над своїм текстом.
    function setTitlePosition(tabsMediaArray, matchMedia) {
        tabsMediaArray.forEach(tabsMediaItem => {
            // чистий HTML-вузол табів
            tabsMediaItem = tabsMediaItem.item;
            // знаходить головні таби керування
            let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
            let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
            let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
            let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
            tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
            tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
            tabsContentItems.forEach((tabsContentItem, index) => {
                // зараз мобілка, якщо так, то переносить кнопку
                if (matchMedia.matches) {
                    tabsContent.append(tabsTitleItems[index]);
                    tabsContent.append(tabsContentItem);
                    // стилі для акордиону мобільного
                    tabsMediaItem.classList.add('_tab-spoller');
                } else {
                    tabsTitles.append(tabsTitleItems[index]);
                    tabsMediaItem.classList.remove('_tab-spoller');
                }
            });
        });
    }
    // Робота з контентом. Первинне налаштування вмісту (Контент та Хеші
    function initTabs(tabsBlock) {
        // Знаходить усі прямі дочірні елементи (кнопки) всередині навігації 
        // та всі прямі дочірні елементи (тексти) всередині тіла табів.
        let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
        let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
        //  Бере індекс поточного блоку та перевіряє, чи збігається він із першим числом
        //  з URL-хешу (чи хоче користувач відкрити конкретний таб у цьому блоці через посилання).
        const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
        const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
        // Якщо був індекс в посиланні, то шукає активний таб і вимикає його
        if (tabsActiveHashBlock) {
            const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
            tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
        }
        // чи є всередині табів контент
        if (tabsContent.length) {
            tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
            tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
            tabsContent.forEach((tabsContentItem, index) => {
                //  Перебирає контентні блоки та динамічно розставляє технічні атрибути data-tabs-title на кнопки
                //  та data-tabs-item на тексти (це позбавляє розробника від необхідності писати їх вручну 
                // в HTML).
                tabsTitles[index].setAttribute('data-tabs-title', '');
                tabsContentItem.setAttribute('data-tabs-item', '');
                // накидує активний клас правильному блоку, якщо був юрл
                if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
                    tabsTitles[index].classList.add('_tab-active');
                }
                tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
            });
        }
    }
    // Вона викликається щоразу, коли користувач клікає на будь-яку вкладку.
    // Вона ховає старий контент і показує новий.
    function setTabsStatus(tabsBlock) {
        let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
        let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
        const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
        // якщо є значення, то підставляє його, якщо ні то 500
        function isTabsAnamate(tabsBlock) {
            if (tabsBlock.hasAttribute('data-tabs-animate')) {
                return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
            }
        }
        const tabsBlockAnimate = isTabsAnamate(tabsBlock);
        if (tabsContent.length > 0) {
            const isHash = tabsBlock.hasAttribute('data-tabs-hash');
            tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
            tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
            tabsContent.forEach((tabsContentItem, index) => {
                // Пробігається по всіх блоках контенту, щоб оновити їхній стан.
                if (tabsTitles[index].classList.contains('_tab-active')) {
                    // якщо на цьому елементі актикно
                    if (tabsBlockAnimate) {
                        // якщо увімкнена анімація, то робить через функцію, якщо ні то прибирає хіден
                        _slideDown(tabsContentItem, tabsBlockAnimate);
                    } else {
                        tabsContentItem.hidden = false;
                    }
                    // Якщо увімкнено роботу з хешем (і це таби не всередині спливаючого вікна .popup), 
                    // викликає функцію setHash, яка змінює рядок браузера (наприклад, на #tab-0-1).
                    if (isHash && !tabsContentItem.closest('.popup')) {
                        setHash(`tab-${tabsBlockIndex}-${index}`);
                    }
                } else {
                    // якщо заголовок втратив активність і його треба сховати
                    if (tabsBlockAnimate) {
                        _slideUp(tabsContentItem, tabsBlockAnimate);
                    } else {
                        tabsContentItem.hidden = true;
                    }
                }
            });
        }
    }
    // Обробник події кліку
    function setTabsAction(e) {
        const el = e.target;
        if (el.closest('[data-tabs-title]')) {
            // знаходимо конкретно блок де стався клік
            const tabTitle = el.closest('[data-tabs-title]');
            const tabsBlock = tabTitle.closest('[data-tabs]');
            // Користувач клікнув по табу, який зараз неактивний
            if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
            //    Шукає старий активний заголовок у цьому блоці, фільтрує його від вкладених елементів і забирає у нього клас _tab-active.
                let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
                tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock) : null;
                tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null;
                // додає новому актив і запускає зміну контента
                tabTitle.classList.add('_tab-active');
                setTabsStatus(tabsBlock);
            }
            // Стандартна поведінка браузера при кліку на таке посилання — додати до адреси сайту
            //  знак # і миттєво підкинути (скролити) сторінку в самий верх.
            e.preventDefault();
        }
    }
}