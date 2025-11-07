// // Обёртка, чтобы не конфликтовать с остальными скриптами
// document.addEventListener('DOMContentLoaded', () => {
//     // НЕОБЫЧНЫЕ ИМЕНА ПЕРЕМЕННЫХ, как просил
//     const quokkaTrigger = document.querySelector('.special__way');        // кнопка, по которой открывается меню
//     const zazuPanel = document.querySelector('.variants');               // сам выпадающий блок
//     const orcaList = document.querySelectorAll('.variants__list .variants__link'); // все ссылки-варианты
//     const tickNode = (() => {
//         // Найдём существующую иконку галочки (если есть) и сохраним её узел.
//         const maybe = document.querySelector('.variants__list img');
//         return maybe ? maybe.cloneNode(true) : null; // клонируем, чтобы использовать при перемещении
//     })();

//     // карточки товаров (все списки .special__list на странице)
//     const auroraProductLists = Array.from(document.querySelectorAll('.special__list'));

//     // если чего-то из нужных элементов нет — выходим
//     if (!quokkaTrigger || !zazuPanel || orcaList.length === 0 || auroraProductLists.length === 0) {
//         // ничего не ломаем — просто завершаем работу
//         // (консольный лог для дебага)
//         // console.warn('Dropdown init skipped: required DOM nodes missing.');
//         return;
//     }

//     // -- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ --

//     // Преобразует текст цены "59 990Р" -> 59990 (number). Надёжный запасной парсер.
//     const parsePrice = (priceText) => {
//         if (!priceText) return 0;
//         const digits = priceText.replace(/[^\d]/g, '');
//         return digits ? parseInt(digits, 10) : 0;
//     };

//     // Получить метрики карточки: price, date, rating, popularity
//     const getCardMeta = (cardEl) => {
//         // ищем data-* сначала
//         const priceAttr = cardEl.dataset.price;
//         const ratingAttr = cardEl.dataset.rating;
//         const dateAttr = cardEl.dataset.date; // ожидаем ISO yyyy-mm-dd или timestamp
//         const popAttr = cardEl.dataset.popularity;

//         // fallback: парсим цену из .price внутри карточки
//         const priceNode = cardEl.querySelector('.price');
//         const priceFromDom = priceNode ? parsePrice(priceNode.textContent) : 0;

//         return {
//             price: priceAttr ? Number(priceAttr) : priceFromDom,
//             rating: ratingAttr ? Number(ratingAttr) : (cardEl.dataset.rating ? Number(cardEl.dataset.rating) : 0),
//             date: dateAttr ? new Date(dateAttr) : (cardEl.dataset.date ? new Date(cardEl.dataset.date) : new Date(0)),
//             popularity: popAttr ? Number(popAttr) : (cardEl.dataset.popularity ? Number(cardEl.dataset.popularity) : 0)
//         };
//     };

//     // Сортировка карточек согласно выбранному критерию
//     const sortCards = (listEl, criterion) => {
//         // Получаем массив карточек (li)
//         const cards = Array.from(listEl.querySelectorAll('.special__item-list'));
//         // Если карточек нет, ничего не делаем
//         if (!cards.length) return;

//         cards.sort((a, b) => {
//             const ma = getCardMeta(a);
//             const mb = getCardMeta(b);

//             switch (criterion) {
//                 case 'Сначала дешёвые':
//                     return ma.price - mb.price;           // по возрастанию цены
//                 case 'Сначала дорогие':
//                     return mb.price - ma.price;           // по убыванию цены
//                 case 'Новинки':
//                     return mb.date - ma.date;             // по дате: новые сверху
//                 case 'Высокий рейтинг':
//                     return mb.rating - ma.rating;         // по рейтингу (убывание)
//                 case 'Сначала популярные':
//                 default:
//                     return mb.popularity - ma.popularity; // по популярности (если нет — оставим порядок)
//             }
//         });

//         // Удаляем текущие карточки и вставляем отсортированные
//         // (мы клонируем узлы, чтобы не потерять слушатели, если они где-то есть)
//         const frag = document.createDocumentFragment();
//         cards.forEach(c => frag.appendChild(c));

//         // Очистим список и вставим отсортированное
//         listEl.innerHTML = '';
//         listEl.appendChild(frag);
//     };

//     // Применить сортировку ко всем спискам (если у тебя несколько списков, их все поменяем одинаково)
//     const applySortingToAll = (criterion) => {
//         auroraProductLists.forEach(listEl => {
//             sortCards(listEl, criterion);
//         });
//     };

//     // Перенести/показать галочку в выбранный пункт
//     const moveTickTo = (linkEl) => {
//         // Сначала убираем все существующие иконки внутри .variants__list
//         const existingImgs = document.querySelectorAll('.variants__list img');
//         existingImgs.forEach(img => img.remove());

//         if (!tickNode) {
//             // если у нас не было оригинальной иконки, сделаем простую метку (span)
//             const fallback = document.createElement('span');
//             fallback.className = 'variants__check-fallback';
//             fallback.textContent = '✔';
//             linkEl.appendChild(fallback);
//         } else {
//             // перемещаем клонированную галочку (новый клон, чтобы можно было переиспользовать)
//             const newTick = tickNode.cloneNode(true);
//             // пригодится сделать маленький класс для стилизации
//             newTick.classList.add('variants__tick');
//             linkEl.appendChild(newTick);
//         }
//     };

//     // Закрыть панель
//     const closePanel = () => {
//         zazuPanel.classList.remove('variants--open');
//         quokkaTrigger.classList.remove('special__way--open'); // визуальный тот же класс у тебя в разметке
//     };

//     // Открыть панель
//     const openPanel = () => {
//         zazuPanel.classList.add('variants--open');
//         quokkaTrigger.classList.add('special__way--open');
//     };

//     // Переключатель (toggle)
//     quokkaTrigger.addEventListener('click', (e) => {
//         e.preventDefault();
//         if (zazuPanel.classList.contains('variants--open')) {
//             closePanel();
//         } else {
//             openPanel();
//         }
//     });

//     // Навешиваем обработчики на каждый вариант
//     orcaList.forEach(link => {
//         link.addEventListener('click', (e) => {
//             e.preventDefault();
//             const value = link.textContent.trim(); // текст варианта, например "Сначала популярные"

//             // 1) Переместить галочку (визуал)
//             moveTickTo(link);

//             // 2) Обновить текст на триггере
//             const triggerText = quokkaTrigger.querySelector('.way-text');
//             if (triggerText) triggerText.textContent = value;

//             // 3) Закрыть панель
//             closePanel();

//             // 4) Применить сортировку карточек
//             applySortingToAll(value);
//         });
//     });

//     // Закрывать панель при клике вне её
//     document.addEventListener('click', (e) => {
//         if (!zazuPanel.contains(e.target) && !quokkaTrigger.contains(e.target)) {
//             closePanel();
//         }
//     });

//     // Инициализация: установим галочку на первом видимом варианте (если нет)
//     (function initTick() {
//         const firstLink = document.querySelector('.variants__list .variants__link');
//         if (firstLink) {
//             moveTickTo(firstLink);
//             // а также поставим текст на триггер
//             const t = quokkaTrigger.querySelector('.way-text');
//             if (t) t.textContent = firstLink.textContent.trim();
//         }
//     })();

// });





// special-controls.js — рабочая версия на основе твоего кода
document.addEventListener('DOMContentLoaded', () => {

    /* ========== УТИЛИТЫ ========== */

    // Читаем число из строки вида "59 990 ₽" или "59990" — возвращаем Number
    const parsePrice = (text = '') => {
        if (typeof text !== 'string') text = String(text);
        const digits = text.replace(/\s/g, '').replace(/[^\d]/g, '');
        return digits ? Number(digits) : 0;
    };

    // Безопасный getText
    const getText = el => (el && el.textContent) ? el.textContent.trim() : '';

    /* ========== SHOW MORE (категории) ========== */
    (function initShowMore() {
        const categoriesList = document.querySelector('.special__categories');
        const btnMore = document.querySelector('.special__more');

        if (!categoriesList || !btnMore) return;

        btnMore.addEventListener('click', (ev) => {
            ev.preventDefault();
            const openClass = 'special__all';
            categoriesList.classList.toggle(openClass);
            btnMore.textContent = categoriesList.classList.contains(openClass) ? 'Скрыть' : 'Показать ещё';
        });
    })();

    /* ========== DROPDOWN сортировки (список вариантов) ========== */
    (function initDropdown() {
        const searchWrapper = document.querySelector('.search'); // контейнер который открывается/закрывается
        const wayTrigger = document.querySelector('.special__way'); // триггер
        const variantsPanel = document.querySelector('.variants'); // панель вариантов
        const wayText = document.querySelector('.way-text'); // где показываем выбранный текст

        // Если нет триггера/панели — ничего не делаем
        if (!wayTrigger || !variantsPanel) return;

        // toggle открытия панели
        wayTrigger.addEventListener('click', (ev) => {
            ev.preventDefault();
            if (searchWrapper) searchWrapper.classList.toggle('search__all');
            variantsPanel.classList.toggle('variants--open');
            wayTrigger.classList.toggle('special__way--open');
        });

        // Закрыть при клике вне панели
        document.addEventListener('click', (ev) => {
            if (!variantsPanel.contains(ev.target) && !wayTrigger.contains(ev.target)) {
                variantsPanel.classList.remove('variants--open');
                wayTrigger.classList.remove('special__way--open');
                if (searchWrapper) searchWrapper.classList.remove('search__all');
            }
        });
    })();

    /* ========== СОРТИРОВКА карточек ========== */
    (function initSorting() {
        const container = document.querySelector('.special__list');
        if (!container) return;

        // собираем карточки с метаданными
        const collectNodes = () => {
            const nodes = Array.from(container.querySelectorAll('.special__item-list'));
            return nodes.map((node, idx) => {
                const priceEl = node.querySelector('.price');
                const price = priceEl ? parsePrice(getText(priceEl)) : (node.dataset.price ? Number(node.dataset.price) : 0);
                const rating = node.dataset.rating ? Number(node.dataset.rating) : (node.dataset.rate ? Number(node.dataset.rate) : 0);
                const date = node.dataset.date ? new Date(node.dataset.date) : (node.dataset.timestamp ? new Date(Number(node.dataset.timestamp)) : null);
                const popularity = node.dataset.popularity ? Number(node.dataset.popularity) : (nodes.length - idx);
                return { node, price, rating, date, popularity, initialIndex: idx };
            });
        };

        // сортируем по ключу
        const sortNodes = (items, key) => {
            const arr = [...items];
            switch (key) {
                case 'price_asc':
                    arr.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    arr.sort((a, b) => b.price - a.price);
                    break;
                case 'rating_desc':
                    arr.sort((a, b) => b.rating - a.rating);
                    break;
                case 'novinki':
                    arr.sort((a, b) => {
                        if (a.date && b.date) return b.date - a.date;
                        return a.initialIndex - b.initialIndex;
                    });
                    break;
                case 'pop':
                default:
                    arr.sort((a, b) => b.popularity - a.popularity);
                    break;
            }
            return arr;
        };

        // переставляем DOM узлы в новом порядке
        const applyOrder = (sortedItems) => {
            const frag = document.createDocumentFragment();
            sortedItems.forEach(item => frag.appendChild(item.node));
            container.innerHTML = '';
            container.appendChild(frag);

            // Если используется Swiper — обновляем его (попытки нескольких вариантов)
            try {
                if (window.swiper && typeof window.swiper.update === 'function') window.swiper.update();
                document.querySelectorAll('.swiper').forEach(s => { if (s.swiper && typeof s.swiper.update === 'function') s.swiper.update(); });
            } catch (err) {
                // silent
            }
        };

        // Популярные варианты сортировки — делегирование: ловим клик по .variants__link
        document.addEventListener('click', (ev) => {
            const variant = ev.target.closest('.variants__link, .variants__item, [data-sort]');
            if (!variant) return;

            // предотвратить переход для ссылок
            if (variant.tagName.toLowerCase() === 'a') ev.preventDefault();

            // определяем ключ сортировки: data-sort если есть, иначе по тексту
            const sortKey = variant.dataset.sort || guessKeyFromText(getText(variant));

            // закрываем панель сортировки (если есть)
            const panel = document.querySelector('.variants');
            const searchWrap = document.querySelector('.search');
            const wayTrigger = document.querySelector('.special__way');
            if (panel) panel.classList.remove('variants--open');
            if (searchWrap) searchWrap.classList.remove('search__all');
            if (wayTrigger) wayTrigger.classList.remove('special__way--open');

            // Обновляем текст триггера
            const wayText = document.querySelector('.way-text');
            if (wayText) wayText.textContent = getText(variant);

            // Active state
            document.querySelectorAll('.variants__link, .variants__item').forEach(el => el.classList.remove('active'));
            variant.classList.add('active');

            // Сортируем и применяем
            const items = collectNodes();
            const sorted = sortNodes(items, sortKey);
            applyOrder(sorted);
        });

        function guessKeyFromText(text) {
            const t = (text || '').toLowerCase();
            if (t.includes('деш')) return 'price_asc';
            if (t.includes('дорог')) return 'price_desc';
            if (t.includes('новин')) return 'novinki';
            if (t.includes('рейтинг')) return 'rating_desc';
            return 'pop';
        }
    })();

    /* ========== СЧЁТЧИК (плюс/минус) — делегирование на контейнер карточек ========== */
    (function initCounter() {
        const listContainer = document.querySelector('.special__list');
        if (!listContainer) return;

        listContainer.addEventListener('click', (ev) => {
            // плюс
            const plus = ev.target.closest('.img-plus');
            if (plus) {
                ev.preventDefault();
                const qtyWrap = plus.closest('.special__quantity');
                if (!qtyWrap) return;
                const counter = qtyWrap.querySelector('.more-more');
                if (!counter) return;
                const current = parseInt(counter.textContent.replace(/\D/g, '')) || 0;
                counter.textContent = current + 1;

                // активируем минус если есть
                const minusBtn = qtyWrap.querySelector('.img-minus');
                if (minusBtn) minusBtn.classList.add('enabled');
                return;
            }

            // минус
            const minus = ev.target.closest('.img-minus');
            if (minus) {
                ev.preventDefault();
                const qtyWrap = minus.closest('.special__quantity');
                if (!qtyWrap) return;
                const counter = qtyWrap.querySelector('.more-more');
                if (!counter) return;
                let current = parseInt(counter.textContent.replace(/\D/g, '')) || 0;
                if (current > 1) {
                    current = current - 1;
                    counter.textContent = current;
                } else {
                    // можно оставить 0 или 1 в зависимости от UX — у тебя было >1
                    counter.textContent = 1;
                    minus.classList.remove('enabled');
                }
                return;
            }

        });
    })();

    /* ========== готово ========== */
    // console.log('special-controls: initialized');

}); // DOMContentLoaded end