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
    this.speed = 28;
    this.frame = null;
    this.lastFrame = null;
    this.loopWidth = 0;

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

    if (this.autoplay && this.cards.length > 1) this.cloneCards();
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
    if (direction < 0 && this.track.scrollLeft <= 2 && this.loopWidth) this.track.scrollLeft = this.loopWidth;
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
    if (!this.autoplay || this.frame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.lastFrame = null;
    this.frame = window.requestAnimationFrame((timestamp) => this.tick(timestamp));
  }

  stop() {
    window.cancelAnimationFrame(this.frame);
    this.frame = null;
    this.lastFrame = null;
  }

  cloneCards() {
    if (this.track.dataset.cloned === 'true') return;
    this.cards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.removeAttribute('data-shopify-editor-block');
      this.track.appendChild(clone);
    });
    this.track.dataset.cloned = 'true';
    window.requestAnimationFrame(() => {
      const firstClone = this.track.children[this.cards.length];
      this.loopWidth = firstClone ? firstClone.offsetLeft : 0;
    });
  }

  tick(timestamp) {
    if (!this.frame) return;
    if (this.lastFrame === null) this.lastFrame = timestamp;

    const elapsed = timestamp - this.lastFrame;
    this.lastFrame = timestamp;
    this.track.scrollLeft += (this.speed * elapsed) / 1000;

    if (this.loopWidth && this.track.scrollLeft >= this.loopWidth) {
      this.track.scrollLeft -= this.loopWidth;
    }

    this.frame = window.requestAnimationFrame((nextTimestamp) => this.tick(nextTimestamp));
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
