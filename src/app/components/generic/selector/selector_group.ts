import {
	Component,
	Input,
	forwardRef,
	EventEmitter,
	Attribute,
	OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { isPresent, NumberWrapper } from '@angular/platform-browser/src/facade/lang';

import { Selector } from './selector';
import { SelectorDispatcher } from './selector_dispatcher';
let template = require('./selector_group.html');
let _uniqueSGIdCounter = 0;

export const SG_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => SelectorGroup),
	multi: true
};


@Component({
	selector: 'c-selector-group',
	outputs: ['onChange'],
	inputs: ['disabled', 'value', 'init', 'channel', 'tab', 'data'],
	host: {
		'role': 'radiogroup',
		'[attr.aria-disabled]': 'disabled',
		'[attr.aria-activedescendant]': 'activedescendant',
		'(keydown)': 'onKeydown($event)',
		'[tabindex]': 'tabindex'
	},
	template: template
})

export class SelectorGroup implements ControlValueAccessor, OnInit {
	value: any;
	init: FormControl;
	_name: string;
	_selectors: Selector[];

	activeDescendent: any;
	_disabled: boolean;
	selectedSelectorId: string;
	onChange: EventEmitter<any> = new EventEmitter();
	onTouched: EventEmitter<any> = new EventEmitter();
	tabindex: number;
	channel: string;
	tab: boolean;

	@Input('control') control: FormControl;
	@Input('formControl') formControl: FormControl;

	constructor(
		@Attribute('channel') channel: string,
		@Attribute('tabindex') tabindex: string,
		@Attribute('disabled') disabled: string,
		public selectorDispatcher: SelectorDispatcher
	) {
		// _cd.valueAccessor = this;
		this._name = `selector-group-${_uniqueSGIdCounter++}`;
		this._selectors = [];
		this.selectedSelectorId = '';
		this._disabled = false;
		this.disabled = isPresent(disabled);
		this.tabindex = isPresent(tabindex) ? NumberWrapper.parseInt(tabindex, 10) : -1;



	}

	ngOnInit() {
		if (!this.control && this.formControl) {
			this.control = this.formControl;
		}
		if (this.init) {
			this.init.valueChanges.subscribe((next) => {
				if (isPresent(next) && next !== '') {
					this.selectorDispatcher.notify(this._name);
					this._selectors.forEach(selector => {
						if (selector.value === next) {
							selector.isChecked = true;
							this.selectedSelectorId = selector.id;
							this.activeDescendent = selector.id;
						}
					});
				}
			});
		}

	}

	getName(): string {
		return this._name;
	}

	get disabled() {
		return this._disabled;
	}

	set disabled(value) {
		this._disabled = isPresent(value) && value !== false;
	}


	onChanges(_) {
		this.disabled = isPresent(this.disabled) && this.disabled !== false;
		if (isPresent(this.value) && this.value !== '') {
			this.selectorDispatcher.notify(this._name);
			this._selectors.forEach(selector => {
				if (selector.value === this.value) {
					selector.isChecked = true;
					this.selectedSelectorId = selector.id;
					this.activeDescendent = selector.id;
				}
			});
		}
	}
	updateValue(value: any) {
		this.value = value;
		this.onChanges(_);
		this.control.updateValue(this.value, true);
		this.onTouched.emit(true);
		this.onChange.emit(this.value);
	}

	register(selector: Selector) {
		this._selectors.push(selector);
	}

	onKeydown(event) {
		if (this.disabled) {
			return;
		}

		switch (event.keyCode) {
			// Up
			case 38:
				this.stepSelector(-1);
				event.preventDefault();
				break;
			// Left
			case 37:
				this.stepSelector(-1);
				event.preventDefault();
				break;
			// Down
			case 40:
				this.stepSelector(1);
				event.preventDefault();
				break;
			// Right
			case 39:
				this.stepSelector(1);
				event.preventDefault();
				break;
			default:
				break;
		}
	}

	getCurrentSelectorIndex(): number {
		for (let i = 0; i < this._selectors.length; i++) {
			if (this._selectors[i].id === this.selectedSelectorId) {
				return i;
			}
		}

		return -1;
	}

	stepSelector(step) {
		let index = this.getCurrentSelectorIndex() + step;
		if (index < 0 || index >= this._selectors.length) {
			return;
		}

		let radio = this._selectors[index];

		// If the next radio is line is disabled, skip it (maintaining direction).
		if (radio.disabled) {
			this.stepSelector(step + (step < 0 ? -1 : 1));
			return;
		}

		this.selectorDispatcher.notify(this._name);
		radio.isChecked = true;
		// ObservableWrapper.callNext(this.onChange, null);

		this.value = radio.value;
		this.updateValue(radio.value);
		this.selectedSelectorId = radio.id;
		this.activeDescendent = radio.id;
	}

	writeValue(value) {
		this.value = value;
		//this.updateValue(value);
	}
	registerOnChange(fn): void {
		this.onChange.subscribe(fn);
	}
	registerOnTouched(fn): void {
		this.onTouched.subscribe(fn);
	}
}
