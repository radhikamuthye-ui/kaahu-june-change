class CollectionMetafieldSlideshow {
  constructor(element) {
    this.section = element;
    this.swiperElement = element.querySelector('.cms-swiper');
    this.progress = element.querySelector('.cms-progress span');
    this.toggle = element.querySelector('.cms-toggle');
    this.swiper = null;
    this.hasLeftFirstSlide = false;

    if (!this.swiperElement) return;

    this.init();
  }

  init() {
    this.mountSlider();
    this.bindControls();
  }

  mountSlider() {
    const interval = parseInt(this.swiperElement.dataset.interval, 10) || 5000;
    const speed = parseInt(this.swiperElement.dataset.speed, 10) || 800;
    const autoplay = this.swiperElement.dataset.autoplay === 'true';
    const slideCount = this.swiperElement.querySelectorAll('.swiper-slide').length;
    const totalInterval = (interval * Math.max(slideCount, 1)) + (speed * Math.max(slideCount - 1, 0));

    this.section.style.setProperty('--cms-interval', `${totalInterval}ms`);

    const config = {
      loop: slideCount > 1,
      speed,
      effect: 'fade',
      slidesPerView: 1,
      spaceBetween: 0,
      allowTouchMove: slideCount > 1,
      fadeEffect: {
        crossFade: true
      },
      on: {
        init: () => this.restartProgress(),
        realIndexChange: swiper => this.syncProgressToCycle(swiper)
      }
    };

    if (autoplay && slideCount > 1) {
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
        this.swiper.autoplay.start();
      }
    });
  }

  restartProgress() {
    if (!this.progress || this.section.classList.contains('is-paused')) return;

    this.progress.style.animation = 'none';
    this.progress.offsetHeight;
    this.progress.style.animation = '';
  }

  syncProgressToCycle(swiper) {
    if (!swiper || swiper.realIndex === undefined) return;

    if (swiper.realIndex !== 0) {
      this.hasLeftFirstSlide = true;
      return;
    }

    if (this.hasLeftFirstSlide) {
      this.hasLeftFirstSlide = false;
      this.restartProgress();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.collection-metafield-slideshow').forEach(section => {
    if (section.dataset.cmsInitialized === 'true') return;
    section.dataset.cmsInitialized = 'true';
    new CollectionMetafieldSlideshow(section);
  });
});

document.addEventListener('shopify:section:load', event => {
  event.target.querySelectorAll('.collection-metafield-slideshow').forEach(section => {
    if (section.dataset.cmsInitialized === 'true') return;
    section.dataset.cmsInitialized = 'true';
    new CollectionMetafieldSlideshow(section);
  });
});
