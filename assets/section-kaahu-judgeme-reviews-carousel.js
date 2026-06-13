class KaahuReviewsCarousel extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-reviews-track]');
    if (!this.track) return;

    this.prev = this.querySelector('[data-reviews-prev]');
    this.next = this.querySelector('[data-reviews-next]');
    this.dots = Array.from(this.querySelectorAll('[data-reviews-dot]'));
    this.cards = Array.from(this.track.children);
    this.autoplay = this.dataset.autoplay === 'true';
    this.pauseHover = this.dataset.pauseHover === 'true';
    this.dragEnabled = this.dataset.drag === 'true';
    this.continuous = this.dataset.continuous === 'true';
    this.speed = Number(this.dataset.speed) || 5000;
    this.timer = null;

    if (this.continuous) {
      this.track.addEventListener('focusin', () => this.classList.add('is-paused'));
      this.track.addEventListener('focusout', () => this.classList.remove('is-paused'));
      return;
    }

    this.prev?.addEventListener('click', () => this.go(-1));
    this.next?.addEventListener('click', () => this.go(1));
    this.dots.forEach((dot, index) => dot.addEventListener('click', () => this.scrollToCard(index)));
    this.track.addEventListener('scroll', () => this.updateDots(), { passive: true });
    this.track.addEventListener('focusin', () => this.stop());
    this.track.addEventListener('focusout', () => this.start());

    if (this.pauseHover) {
      this.addEventListener('mouseenter', () => this.stop());
      this.addEventListener('mouseleave', () => this.start());
    }

    if (this.dragEnabled) this.enableDrag();
    this.updateDots();
    this.start();
  }

  disconnectedCallback() {
    this.stop();
  }

  cardStep() {
    const first = this.cards[0];
    if (!first) return 320;
    const gap = parseFloat(getComputedStyle(this.track).columnGap || getComputedStyle(this.track).gap || 0);
    return first.getBoundingClientRect().width + gap;
  }

  go(direction) {
    const maxScroll = this.track.scrollWidth - this.track.clientWidth - 2;
    if (direction > 0 && this.track.scrollLeft >= maxScroll) {
      this.track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    if (direction < 0 && this.track.scrollLeft <= 2) {
      this.track.scrollTo({ left: this.track.scrollWidth, behavior: 'smooth' });
      return;
    }
    this.track.scrollBy({ left: direction * this.cardStep(), behavior: 'smooth' });
  }

  scrollToCard(index) {
    const card = this.cards[index];
    if (!card) return;
    this.track.scrollTo({ left: card.offsetLeft - this.track.offsetLeft, behavior: 'smooth' });
  }

  updateDots() {
    if (!this.dots.length) return;
    const center = this.track.scrollLeft + this.track.clientWidth / 2;
    let active = 0;
    let best = Infinity;
    this.cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < best) {
        best = distance;
        active = index;
      }
    });
    this.dots.forEach((dot, index) => dot.classList.toggle('is-active', index === active));
  }

  start() {
    if (!this.autoplay || this.timer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.timer = window.setInterval(() => this.go(1), this.speed);
  }

  stop() {
    window.clearInterval(this.timer);
    this.timer = null;
  }

  enableDrag() {
    let down = false;
    let startX = 0;
    let scrollLeft = 0;

    this.track.addEventListener('pointerdown', (event) => {
      down = true;
      startX = event.clientX;
      scrollLeft = this.track.scrollLeft;
      this.track.classList.add('is-dragging');
      this.track.setPointerCapture(event.pointerId);
      this.stop();
    });

    this.track.addEventListener('pointermove', (event) => {
      if (!down) return;
      event.preventDefault();
      this.track.scrollLeft = scrollLeft - (event.clientX - startX);
    });

    const end = () => {
      if (!down) return;
      down = false;
      this.track.classList.remove('is-dragging');
      this.start();
    };

    this.track.addEventListener('pointerup', end);
    this.track.addEventListener('pointercancel', end);
    this.track.addEventListener('pointerleave', end);
  }
}

if (!customElements.get('kaahu-reviews-carousel')) {
  customElements.define('kaahu-reviews-carousel', KaahuReviewsCarousel);
}
