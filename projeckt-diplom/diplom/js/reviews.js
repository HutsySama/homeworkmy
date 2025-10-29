(function () {
    const foto = document.querySelector('.reviews__foto');
    const dryer = document.querySelector('.reviews__dryer');

    foto.addEventListener('click', (event) => {
        event.preventDefault() // отменяем переход по ссылке, если это <a>
        dryer.classList.toggle('active') // добавляем или убираем класс
        foto.textContent = dryer.classList.contains('active')
            ? 'Скрыть'
            : 'Смотреть все фото'
    });

    
})();