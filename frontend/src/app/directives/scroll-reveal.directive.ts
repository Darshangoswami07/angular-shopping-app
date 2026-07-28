import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

// Each `.scroll-reveal` element manages its own IntersectionObserver, created
// exactly when Angular instantiates that element — whether that happens on
// initial render or seconds later once an async fetch resolves. This replaces
// a fragile approach where a single parent component queried the DOM once,
// 100ms after init, for `.scroll-reveal` elements: any element rendered after
// that one-shot query (e.g. cards populated once an HTTP call resolves) was
// never registered with an observer and stayed permanently invisible per the
// `.scroll-reveal { opacity: 0 }` rule in styles.css. Scoping the observer to
// the element's own lifecycle makes that class of bug structurally impossible.
@Directive({
  selector: '.scroll-reveal',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    if (typeof IntersectionObserver === 'undefined') {
      this.el.nativeElement.classList.add('revealed');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
