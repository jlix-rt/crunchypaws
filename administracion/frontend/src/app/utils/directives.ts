import { Directive, ElementRef, Input, HostListener, Renderer2, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements OnInit {
  @Input() appAutoFocus: boolean = true;
  @Input() delay: number = 0;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.appAutoFocus) {
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, this.delay);
    }
  }
}

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective implements OnDestroy {
  @Input() appClickOutside: () => void = () => {};

  private clickListener: () => void;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.clickListener = this.renderer.listen('document', 'click', (event) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.appClickOutside();
      }
    });
  }

  ngOnDestroy() {
    this.clickListener();
  }
}

@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective {
  @Input() appDebounceClick: () => void = () => {};
  @Input() delay: number = 300;

  private timeoutId: any;

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.appDebounceClick();
    }, this.delay);
  }
}

@Directive({
  selector: '[appThrottleClick]'
})
export class ThrottleClickDirective {
  @Input() appThrottleClick: () => void = () => {};
  @Input() delay: number = 1000;

  private lastClickTime: number = 0;

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    const now = Date.now();
    if (now - this.lastClickTime >= this.delay) {
      this.lastClickTime = now;
      this.appThrottleClick();
    }
  }
}

@Directive({
  selector: '[appCopyToClipboard]'
})
export class CopyToClipboardDirective {
  @Input() appCopyToClipboard: string = '';

  @HostListener('click')
  onClick() {
    if (this.appCopyToClipboard) {
      navigator.clipboard.writeText(this.appCopyToClipboard).then(() => {
        // Could emit an event or show a toast here
        console.log('Text copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  }
}

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input() appTooltip: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() delay: number = 500;

  private tooltipElement: HTMLElement | null = null;
  private showTimeout: any;
  private hideTimeout: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.createTooltip();
  }

  ngOnDestroy() {
    this.destroyTooltip();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hideTooltip();
  }

  private createTooltip() {
    if (!this.appTooltip) return;

    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.addClass(this.tooltipElement, `tooltip-${this.position}`);
    this.renderer.setProperty(this.tooltipElement, 'textContent', this.appTooltip);
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '1000');
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.3s');
    
    this.renderer.appendChild(document.body, this.tooltipElement);
  }

  private showTooltip() {
    if (!this.tooltipElement) return;

    clearTimeout(this.hideTimeout);
    this.showTimeout = setTimeout(() => {
      this.positionTooltip();
      this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
    }, this.delay);
  }

  private hideTooltip() {
    if (!this.tooltipElement) return;

    clearTimeout(this.showTimeout);
    this.hideTimeout = setTimeout(() => {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    }, 100);
  }

  private positionTooltip() {
    if (!this.tooltipElement) return;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (this.position) {
      case 'top':
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 8;
        break;
    }

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }

  private destroyTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
    clearTimeout(this.showTimeout);
    clearTimeout(this.hideTimeout);
  }
}

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  @Input() appLazyLoad: string = '';
  @Input() placeholder: string = '';

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.createIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private createIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage();
          this.observer?.unobserve(entry.target);
        }
      });
    });

    this.observer.observe(this.el.nativeElement);
  }

  private loadImage() {
    const img = this.el.nativeElement as HTMLImageElement;
    if (this.appLazyLoad) {
      img.src = this.appLazyLoad;
    }
  }
}

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight: string = '';
  @Input() highlightClass: string = 'highlight';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.highlightText(target.value);
  }

  private highlightText(text: string) {
    if (!this.appHighlight) {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', text);
      return;
    }

    const regex = new RegExp(`(${this.appHighlight})`, 'gi');
    const highlightedText = text.replace(regex, `<span class="${this.highlightClass}">$1</span>`);
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', highlightedText);
  }
}

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {
  @Input() allowDecimals: boolean = false;
  @Input() allowNegative: boolean = false;

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (event.key === '-' && this.allowNegative) {
      const target = event.target as HTMLInputElement;
      if (target.value.includes('-') || target.selectionStart !== 0) {
        event.preventDefault();
      }
      return;
    }

    if (event.key === '.' && this.allowDecimals) {
      const target = event.target as HTMLInputElement;
      if (target.value.includes('.')) {
        event.preventDefault();
      }
      return;
    }

    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pastedText = event.clipboardData?.getData('text') || '';
    const regex = this.allowDecimals ? 
      (this.allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/) :
      (this.allowNegative ? /^-?\d*$/ : /^\d*$/);

    if (!regex.test(pastedText)) {
      event.preventDefault();
    }
  }
}

@Directive({
  selector: '[appPreventDefault]'
})
export class PreventDefaultDirective {
  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.preventDefault();
  }
}

@Directive({
  selector: '[appStopPropagation]'
})
export class StopPropagationDirective {
  @HostListener('click', ['$event'])
  onClick(event: Event) {
    event.stopPropagation();
  }
}

@Directive({
  selector: '[appSelectOnFocus]'
})
export class SelectOnFocusDirective {
  @HostListener('focus', ['$event'])
  onFocus(event: Event) {
    const target = event.target as HTMLInputElement;
    target.select();
  }
}

@Directive({
  selector: '[appResize]'
})
export class ResizeDirective implements OnInit, OnDestroy {
  @Input() appResize: (width: number, height: number) => void = () => {};

  private resizeObserver: ResizeObserver | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          this.appResize(width, height);
        }
      });
      this.resizeObserver.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}



