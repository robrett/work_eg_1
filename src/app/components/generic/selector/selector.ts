import { Component, Attribute, Optional, Host, OnInit } from '@angular/core';
import {isPresent} from '@angular/platform-browser/src/facade/lang';
import {SelectorGroup} from './selector_group';
import {SelectorDispatcher} from './selector_dispatcher';
let template = require('./selector.html');

let _uniqueIdCounter = 0;

@Component({
	selector: 'c-selector',
	inputs: ['id', 'name', 'value', 'checked', 'disabled', 'group'],
	host: {
		'(keydown.space)': 'select($event)',
		'(click)': 'select($event)',
		'role': 'radio',
		'[id]': 'id',
		'[class.isSelected]': 'isChecked',
		'[attr.aria-checked]': 'isChecked',
		'[attr.aria-disabled]': 'disabled',
		'[tabindex]': 'tabindex'
	},
	template: template,
	providers: []
})
export class Selector implements OnInit {
	id: string;
	value: any;
	group: any;
	name: string;
	checked: boolean;
	isChecked: boolean;
	_disabled: boolean;
	selectorDispatcher: SelectorDispatcher;
	tabindex: number = -1;

	constructor(
		@Attribute('checked') checked: boolean,
		@Attribute('value') value: string,
		@Optional() @Host() public selectorGroup: SelectorGroup,
		selectorDispatcher: SelectorDispatcher,
		@Attribute('id') id: string,
		@Attribute('tabindex') tabindex: string
	) {
		this.value = value;
		this.isChecked = false;
		this.id = isPresent(id) ? id : `selector-${_uniqueIdCounter++}`;
		this.selectorDispatcher = selectorDispatcher;

		selectorDispatcher.listen((name) => {
			if (name === this.name) {
				this.isChecked = false;
			}
		});

		if (isPresent(selectorGroup)) {
			this.name = selectorGroup.getName();
			this.selectorGroup.register(this);
			if (selectorGroup.tabindex === -1) {
				this.tabindex = 0;
			}
		}

	}

	ngOnInit() {
		if (isPresent(this.selectorGroup)) {
			this.name = this.selectorGroup.getName();

			if (isPresent(this.checked) && this.checked === true) {
				this.selectorDispatcher.notify(this.name);
				this.isChecked = true;
				if (isPresent(this.selectorGroup)) {
					this.selectorGroup.updateValue(this.value);
				}
			}
			if (isPresent(this.selectorGroup.init)) {
				let initValue = this.selectorGroup.init.value ? this.selectorGroup.init.value : this.selectorGroup.init;
				if (initValue !== '' && initValue === this.value) {
					this.selectorDispatcher.notify(this.name);
					this.isChecked = true;
					if (isPresent(this.selectorGroup)) {
						this.selectorGroup.updateValue(this.value);
					}
				}
			}
		}

	}

	isDisabled(): boolean {
		return this.disabled || (isPresent(this.selectorGroup) && this.selectorGroup.disabled);
	}

	get disabled(): boolean {
		return this._disabled;
	}

	set disabled(value: boolean) {
		this._disabled = isPresent(value) && value !== false;
	}

	select(event: Event) {
		if (this.isDisabled()) {
			event.stopPropagation();
			return;
		}

		this.selectorDispatcher.notify(this.name);

		this.isChecked = true;

		if (isPresent(this.selectorGroup)) {
			this.selectorGroup.updateValue(this.value);
		}
	}

	onKeydown(event: KeyboardEvent): void {
		if (event.keyCode === 49) {
			event.preventDefault();
			this.select(event);
		}
	}

}
