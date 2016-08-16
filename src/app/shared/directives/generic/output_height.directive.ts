import { Directive, AfterViewInit, ElementRef, EventEmitter, Output } from '@angular/core';
@Directive({
	selector: '[output-height]'
})

export class OutputHeightDirective implements AfterViewInit {
	@Output('onHeightChange') onHeightChange: EventEmitter<any> = new EventEmitter();
	constructor(
		public el: ElementRef
	) {
		let observer = new MutationObserver(this.triggerResize);
		observer.observe(this.el.nativeElement, {
			attributes: true,
			childList: true,
			characterData: false,
			subtree: true
		});
		window.addEventListener('resize', this.triggerResize);
	}

	triggerResize = () => {
		this.onHeightChange.next(this.el.nativeElement.offsetHeight);
	}

	ngAfterViewInit() {
		// this.triggerResize();
	}
}
