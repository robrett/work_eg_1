import {Directive, Input, Output, EventEmitter, HostListener, HostBinding} from '@angular/core';

@Directive({
	selector: 'button[outline]'
})
export class ButtonOutlineDirective {
	@Input('outline') outline: any;
	@HostBinding('class.btn--outline') get baseLine() { return this._baseLine };
	@HostBinding('class.btn--primary') get primary() { return this._primary };

	set primary(p) {
		this._primary = p;
	}

	set baseLine(p) {
		this._baseLine = p;
	}

	@Output('onClick') onNext: EventEmitter<any> = new EventEmitter();
	evt: Event;
	_baseLine: boolean = true;
	// Colours
	_primary: boolean = false;

	@HostListener('click', ['$event'])
	onClick($event: Event) {
		$event.stopPropagation();
		this.evt = $event;
		if (this.outline.color) {
			this._baseLine = false;
			this[this.outline.color] = true;
		}
		setTimeout(() => {
			this.onNext.next($event);
		}, 300);
	}
}
