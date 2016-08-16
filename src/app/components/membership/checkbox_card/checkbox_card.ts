import {
	Input,
	Output,
	Component,
	EventEmitter,
	state,
	transition,
	style,
	HostBinding,
	HostListener,
	animate,
	trigger} from '@angular/core';
let template = require('./checkbox_card.html');
import {Observable} from 'rxjs/Rx';
import {Utils} from './../../../shared/utilities/index';

let nextCheckboxId = 0;

/**
 *  Checkbox Card
 *
 *  Card's that can be toggled
 *
 *  @selector c-checkbox-card
 *
 *  @host role checkbox - Sets ARIA-ROLE
 *  @host [attr.aria-labelledby] lableId - sets the Aria Label to {{id}}-label
 *  @host (click) onInteractionEvent(E) - toggles isSelected if not disabled
 *  @host (keyup.space) onInteractionEvent(E) - toggles isSelected if not disabled
 *  @host (keydown.space) onSpaceDown - prevents EventPropagation for space
 *  @host [attr.aria-disabled] isDisabled - sets ARIA-Disabled
 *  @host [attr.aria-checked] isSelected - sets ARIA-checked
 *  @host [attr.tabindex] disabled ? null : tabindex' - Enables/Disables Tabindex based on disabled
 *
 *  ### Example
 *  ````html
 *  <c-checkbox-card (onSelect)='makeSelection($event)' [selected]='option.active' [disabled]='option.disabled'>
 *      <article title>Title</article>
 *      <article content>I am content</article>
 *  </c-checkbox-card>
 *  ````
 *
 */

@Component({
	selector: 'c-checkbox-card',
	template: template,
	host: {
		// 'role': 'checkbox',
		'[class.c-checkbox-card]': 'true',
		'[class.isDisabled]': 'isDisabled',
		'[class.isChecked]': 'isSelected',
		'[attr.aria-labelledby]': 'labelId',
		'[id]': 'id',
		'(click)': 'onInteractionEvent()',
		'(keyup.space)': 'onInteractionEvent($event)',
		'(keydown.space)': 'onSpaceDown($event)',
		'[attr.aria-disabled]': 'isDisabled',
		'[attr.aria-checked]': 'isSelected',
		'[attr.tabindex]': 'isDisabled ? null : tabindex'
	},
	animations: [
		trigger('collapseContent', [
			state('hidden', style({ marginTop: '-180px' })),
			state('visible', style({ marginTop: '0' })),
			transition('hidden => visible', [animate('350ms')]),
			transition('visible => hidden', [animate('350ms')])
		])
	]
})

export class CheckboxCardComponent {
	public isContentCollapsed: string = 'visible';
	public isContentCollapsable: boolean = false;

	@HostBinding('attr.role') role: string = 'checkbox';
	@HostBinding('class.c-checkbox-card') checkBoxClass: boolean = true;
	@HostBinding('class.isDisabled') get disabled() { return this.isDisabled; }
	@HostBinding('class.isChecked') get checked() { return this.isSelected; }
	@HostBinding('id') get id() { return this._id; }

	// Event Emitted on toggling of the checkbox
	@Output() onSelect: EventEmitter<any> = new EventEmitter();
	// Tab index for the checkbox
	@Input() tabindex: number = 0;
	// Either get an ID from the component or autogenerate one
	@Input('id') set ind(id) { this._id = `md-checkbox-${++nextCheckboxId}`;}
	// Set whether the Checkbox is preselected
	@Input('isSelected') private isSelected: boolean = false;
	// Whether the checkbox is disabled - prevents it from being toggled
	@Input('isDisabled') private isDisabled: boolean = false;
	// The Index of the Checkbox that is emitted by the onSelect event
	@Input('index') private index: number;
	private _id: string;

	constructor() {
		let resizeEvent = Observable.fromEvent(window, 'resize')
			.debounceTime(50);
		resizeEvent.subscribe(() => {
			if (Utils.isViewportMobile()) {
				this.isContentCollapsed = 'hidden';
				this.isContentCollapsable = true;
			} else {
				this.isContentCollapsed = 'visible';
				this.isContentCollapsable = false;
			}
		});

		this.isContentCollapsed = Utils.isViewportMobile() ? 'hidden' : 'visible';
		this.isContentCollapsable = Utils.isViewportMobile();
	}

	/** The id that is attached to the checkbox's label. */
	get labelId() {
		return `${this.id}-label`;
	}

	// Event Handler for Click & Space down
	@HostListener('keyup.space', ['$event'])
	@HostListener('click', ['$event'])
	onInteractionEvent(event: Event) {
		if (this.isDisabled && event) {
			event.stopPropagation();
			return;
		}
		this.toggle();
	}

	// Prevent Spacebar bubbling (Scrolling Down)
	onSpaceDown(evt: Event) {
		evt.preventDefault();
	}

	toggleContentCollapse(evt: Event) {
		evt.preventDefault();
		evt.stopPropagation();
		if (Utils.isViewportMobile()) {
			this.isContentCollapsed = this.isContentCollapsed === 'visible' ? 'hidden' : 'visible';
		}
	}

	 /** Toggles the checked state of the checkbox. If the checkbox is disabled, this does nothing. */

	toggle() {
		if (!this.isDisabled) {
			this.isSelected = !this.isSelected;
			let update = {
				index: this.index,
				isSelected: this.isSelected
			};
			this.onSelect.next(update);
		}
	}
}
