class PairedProductSlideshow {
  constructor(element) {
    this.section = element;
    this.swiperElement = element.querySelector('.pps-swiper');
    this.progress = element.querySelector('.pps-progress span');
    this.toggle = element.querySelector('.pps-toggle');
    this.swiper = null;
    this.mobileQuery = window.matchMedia('(max-width: 749px)');
    this.initialSlide = element.querySelector('.pps-slide--initial');

    if (!this.swiperElement) return;

    this.init();
  }

  init() {
    this.mountSlider();
    this.bindControls();
    this.bindMobileReset();
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
        slideChangeTransitionStart: () => {
          this.clearInitialSlideState();
          this.restartProgress();
        }
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
    this.resetMobileSlide();
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

  bindMobileReset() {
    if (!this.swiper) return;

    this.mobileQuery.addEventListener('change', () => this.resetMobileSlide());
    this.resetMobileSlide();
  }

  resetMobileSlide() {
    if (!this.swiper || !this.mobileQuery.matches) return;

    if (this.swiper.params.loop) {
      this.swiper.slideToLoop(0, 0, false);
    } else {
      this.swiper.slideTo(0, 0, false);
    }
    this.restartProgress();
  }

  restartProgress() {
    if (!this.progress || this.section.classList.contains('is-paused')) return;

    this.progress.style.animation = 'none';
    this.progress.offsetHeight;
    this.progress.style.animation = '';
  }

  clearInitialSlideState() {
    if (!this.initialSlide) return;

    this.initialSlide.classList.remove('pps-slide--initial');
    this.initialSlide = null;
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
