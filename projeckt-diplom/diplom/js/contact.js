const swiper = new Swiper('.special__swiper', {
    spaceBetween: 0,
    slidesPerView: 1,
    // If we need pagination
    pagination: {
        el: '.special__pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});