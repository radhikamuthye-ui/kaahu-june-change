class PairedProductSlideshow {
  constructor(element) {
    this.section = element;
    this.swiperElement = element.querySelector('.pps-swiper');
    this.progress = element.querySelector('.pps-progress span');
    this.toggle = element.querySelector('.pps-toggle');
    this.swiper = null;

    if (!this.swiperElement) return;

    this.init();
  }

  init() {
    this.mountSlider();
    this.bindControls();
    this.bindThemeEditorEvents();
  }

  mountSlider() {
    const interval = parseInt(this.swiperElement.dataset.interval, 10) || 5000;
    const speed = parseInt(this.swiperElement.dataset.speed, 10) || 800;
    const autoplay = this.swiperElement.dataset.autoplay === 'true';
    const effect = 'fade';

    this.section.style.setProperty('--pps-interval', `${interval}ms`);

    const config = {
      loop: this.swiperElement.querySelectorAll('.swiper-slide').length > 1,
      speed,
      effect,
      slidesPerView: 1,
      spaceBetween: 0,
      autoHeight: true,
      allowTouchMove: true,
      fadeEffect: {
        crossFade: true
      },
      on: {
        init: () => this.restartProgress(),
        slideChangeTransitionStart: () => this.restartProgress()
      }
    };

    if (autoplay) {
      config.autoplay = {
        delay: interval,
        disableOnInteraction: false
      };
      this.section.classList.add('is-playing');
    }

    this.swiper = new Swiper(this.swiperElement, config);
  }

  bindControls() {
    if (!this.toggle || !this.swiper) return;

    this.toggle.addEventListener('click', () => {
      const isPaused = this.section.classList.toggle('is-paused');
      this.toggle.setAttribute('aria-pressed', isPaused ? 'true' : 'false');

      if (!this.swiper.autoplay) return;

      if (isPaused) {
        this.swiper.autoplay.stop();
      } else {
        this.restartProgress();
        this.swiper.autoplay.start();
      }
    });
  }

  bindThemeEditorEvents() {
    if (!window.Shopify || !window.Shopify.designMode || !this.swiper) return;

    document.addEventListener('shopify:block:select', event => {
      const slide = event.target.closest('.pps-slide');
      if (!slide || !this.section.contains(slide)) return;

      const index = parseInt(slide.dataset.index, 10);
      if (!Number.isNaN(index)) {
        this.swiper.slideToLoop(index, 400);
        if (this.swiper.autoplay) this.swiper.autoplay.stop();
        this.section.classList.add('is-paused');
      }
    });
  }

  restartProgress() {
    if (!this.progress || this.section.classList.contains('is-paused')) return;

    this.progress.style.animation = 'none';
    this.progress.offsetHeight;
    this.progress.style.animation = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.paired-product-slideshow').forEach(section => {
    if (section.dataset.ppsInitialized === 'true') return;
    section.dataset.ppsInitialized = 'true';
    new PairedProductSlideshow(section);
  });
});

document.addEventListener('shopify:section:load', event => {
  event.target.querySelectorAll('.paired-product-slideshow').forEach(section => {
    if (section.dataset.ppsInitialized === 'true') return;
    section.dataset.ppsInitialized = 'true';
    new PairedProductSlideshow(section);
  });
});
