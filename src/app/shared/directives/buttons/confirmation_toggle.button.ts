import { Directive, EventEmitter, Output, HostListener, HostBinding } from '@angular/core';
@Directive({
	selector: '[confirmationButton]'
})
export class ConfirmationToggleButtonDirective {
	@Output('onUpdate') onUpdate: EventEmitter<any> = new EventEmitter();
	@HostBinding('class.isActive') get isSelected() { return this._isSelected; }
	_isSelected: boolean = false;
	@HostListener('click')
	toggleSelected() {
		this._isSelected = !this._isSelected;
		this.onUpdate.next(this._isSelected);
	}
}