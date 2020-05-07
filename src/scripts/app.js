window.addEventListener('DOMContentLoaded', () => {

  function scrollToElement() {
    const scrollLinks = document.querySelectorAll('.navigation__link');

    scrollLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const blockID = link.getAttribute('href');
        document.querySelector(blockID).scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      })
    })
  }

  function headerMenu() {
    const btn = document.querySelector('.navigation__btn');
    const menu = document.querySelector('.navigation__list');

    btn.addEventListener('click', e => {
      e.preventDefault();
      btn.classList.toggle('is-active');
      menu.classList.toggle('is-active');
    })
  }


  function modalWindowFunc() {
    const btns = document.querySelectorAll('.get-consultation');
    const modalWindow = document.querySelector('#modal');
    const closeBtn = document.querySelector('.modal__close');

    btns.forEach(btn => {
      btn.addEventListener('click', openModal);
    })

    closeBtn.addEventListener('click', closeModal);

    function openModal(e) {
      e.preventDefault();
      document.body.classList = 'blocked';
      modalWindow.classList.add('is-active');
    }

    function closeModal(e) {
      e.preventDefault();
      document.body.classList = '';
      modalWindow.classList.remove('is-active');
    }

    window.addEventListener('click', e => {
      if (e.target == modalWindow) {
        closeModal(e);
      }
    });
  }

  scrollToElement();
  headerMenu();
  modalWindowFunc();

  const slider = document.querySelector('.swiper-container');
  const newsSlider = document.querySelector('.news-slider');

  const mySwiper = new Swiper(slider, {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 5000,
    },
    disableOnInteraction: false,
    navigation: {
      nextEl: '.hero-slider__control--right',
      prevEl: '.hero-slider__control--left',
    },
  })

  const newsSwiper = new Swiper(newsSlider, {
    slidesPerView: 1,
    loop: true,
    disableOnInteraction: false,
    navigation: {
      nextEl: '.news-slider__control--right',
      prevEl: '.news-slider__control--left',
    },
  })
});