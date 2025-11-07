document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.header__icon');
    let cartTotalCount = 0;

    // создаем бейдж рядом с иконкой корзины
    function ensureBadge() {
        if (!cartIcon) return null;
        let badge = cartIcon.querySelector('.cart-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            cartIcon.appendChild(badge);
        }
        return badge;
    }

    function updateBadge() {
        const badge = ensureBadge();
        if (!badge) return;
        if (cartTotalCount > 0) {
            badge.textContent = `Добавлено (${cartTotalCount})`;
            badge.classList.add('visible');
        } else {
            badge.textContent = '';
            badge.classList.remove('visible');
        }
    }

    // делегирование кликов по карточкам
    document.body.addEventListener('click', (e) => {
        const plus = e.target.closest('.img-plus');
        const minus = e.target.closest('.img-minus');
        const basket = e.target.closest('.special__basket');

        // если клик вне нужных элементов — выходим
        if (!plus && !minus && !basket) return;

        const card = e.target.closest('.special__item-list');
        if (!card) return;

        const counter = card.querySelector('.more-more');
        let count = parseInt(counter?.textContent.trim(), 10) || 0;

        // +++
        if (plus) {
            e.preventDefault();
            count++;
            counter.textContent = count;

            const minusBtn = card.querySelector('.img-minus');
            if (minusBtn) minusBtn.classList.add('enabled');
            return;
        }

        // ---
        if (minus) {
            e.preventDefault();
            if (count > 0) count--;
            counter.textContent = count;

            const minusBtn = card.querySelector('.img-minus');
            if (minusBtn && count <= 0) minusBtn.classList.remove('enabled');
            return;
        }

        // 🛒 Добавить в корзину
        if (basket) {
            e.preventDefault();
            if (count <= 0) count = 1; // если 0 — добавляем 1
            cartTotalCount += count;
            updateBadge();

            const text = basket.querySelector('.basket-text');
            if (text) {
                text.textContent = 'Добавлено';
                basket.classList.add('added');
            }
        }
    });
});

// ---------- элементы управления ----------
const list = document.querySelector('.special__categories');
const btn = document.querySelector('.special__more');

// Show more (твоя логика)
if (btn && list) {
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        list.classList.toggle('special__all');
        btn.textContent = list.classList.contains('special__all') ? 'Скрыть' : 'Показать ещё';
    });
}


















    const lisd = document.querySelector('.special__categories');
    const btd = document.querySelector('.special__more');

    // Show more (твоя логика)
    if (btd && lisd) {
        btd.addEventListener('click', (event) => {
            event.preventDefault();
            lisd.classList.toggle('special__all');
            btd.textContent = lisd.classList.contains('special__all') ? 'Скрыть' : 'Показать ещё';
        });
    }

    // Dropdown (варианты сортировки)
    const search = document.querySelector('.search');
    const way = document.querySelector('.special__way');
    const variants = document.querySelector('.variants');
    const wayText = document.querySelector('.way-text');

    if (way && search && variants) {
        way.addEventListener('click', (e) => {
            e.preventDefault();
            search.classList.toggle('search__all');
        });
    }

//     // ---------- сортировка карточек ----------
//     const container = document.querySelector('.special__list');
//     const variantLinks = document.querySelectorAll('.variants__link');

//     if (!container) return;

//     function parsePrice(text) {
//         if (!text) return 0;
//         const digits = text.replace(/\s/g, '').replace(/[^\d]/g, '');
//         return digits ? Number(digits) : 0;
//     }

//     function collectNodes() {
//         const nodes = Array.from(container.querySelectorAll('.special__item-list'));
//         return nodes.map((node, index) => {
//             const priceEl = node.querySelector('.price');
//             const price = priceEl ? parsePrice(priceEl.textContent) : (node.dataset.price ? Number(node.dataset.price) : 0);
//             const rating = node.dataset.rating ? Number(node.dataset.rating) : 0;
//             const date = node.dataset.date ? new Date(node.dataset.date) : null;
//             const popularity = node.dataset.popularity ? Number(node.dataset.popularity) : (nodes.length - index);

//             return { node, price, rating, date, popularity, initialIndex: index };
//         });
//     }

//     function sortNodes(items, key) {
//         const copy = [...items];
//         switch (key) {
//             case 'price_asc':
//                 copy.sort((a, b) => a.price - b.price);
//                 break;
//             case 'price_desc':
//                 copy.sort((a, b) => b.price - a.price);
//                 break;
//             case 'rating_desc':
//                 copy.sort((a, b) => b.rating - a.rating);
//                 break;
//             case 'novinki':
//                 copy.sort((a, b) => {
//                     if (a.date && b.date) return b.date - a.date;
//                     return a.initialIndex - b.initialIndex;
//                 });
//                 break;
//             case 'pop':
//             default:
//                 copy.sort((a, b) => b.popularity - a.popularity);
//                 break;
//         }
//         return copy;
//     }

//     function applyOrder(sortedItems) {
//         // ОЧИЩАЕМ КОНТЕЙНЕР перед добавлением отсортированных элементов
//         container.innerHTML = '';
//         sortedItems.forEach(item => {
//             container.appendChild(item.node);
//         });
//     }

//     // Обработчик выбора варианта сортировки
//     document.addEventListener('click', function (e) {
//         const target = e.target.closest('.variants__link');
//         if (!target) return;

//         e.preventDefault();

//         const sortKey = target.dataset.sort || guessKeyFromText(target.textContent);

//         if (search) search.classList.remove('search__all');

//         if (wayText) wayText.textContent = target.textContent.trim();

//         document.querySelectorAll('.variants__link').forEach(link => link.classList.remove('active'));
//         target.classList.add('active');

//         const items = collectNodes();
//         const sorted = sortNodes(items, sortKey);
//         applyOrder(sorted);
//     });

//     function guessKeyFromText(text) {
//         const t = text.toLowerCase();
//         if (t.includes('деш')) return 'price_asc';
//         if (t.includes('дорог')) return 'price_desc';
//         if (t.includes('новин')) return 'novinki';
//         if (t.includes('рейтинг')) return 'rating_desc';
//         return 'pop';
//     }

// })();

// // ОТДЕЛЬНАЯ ФУНКЦИЯ для счетчика (была ошибка - лишние скобки в конце)
// (function () {
//     const list = document.querySelector('.special__list');

//     // ПРОВЕРКА на существование элемента
//     if (!list) return;

//     list.addEventListener('click', (event) => {
//         event.preventDefault();

//         // ИСПРАВЛЕННЫЕ СЕЛЕКТОРЫ - ищем по родительским элементам
//         if (event.target.closest('.img-plus')) {
//             const counter = event.target.closest('.special__quantity').querySelector('.more-more');
//             let value = parseInt(counter.textContent);
//             counter.textContent = value + 1;
//         }

//         if (event.target.closest('.img-minus')) {
//             const counter = event.target.closest('.special__quantity').querySelector('.more-more');
//             let value = parseInt(counter.textContent);
//             if (value > 1) counter.textContent = value - 1;
//         }
//     });
// })();