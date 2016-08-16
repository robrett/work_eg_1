import { Component, Attribute, OnInit, Optional, SkipSelf, Host } from '@angular/core';
import {isPresent} from '@angular/platform-browser/src/facade/lang';
import {TabsDispatcher} from './tab_dispatcher';
import {TabGroup} from './tab_group';

@Component({
	selector: 'c-tab',
	inputs: ['id', 'name', 'selected', 'disabled', 'value'],
	template: require('./tab.html'),
	host: {
		'[id]': 'id',
		'[tabindex]': 'tabindex',
		'[class.selected]': 'isSelected',
		'[attr.aria-disabled]': 'disabled'
	}
})
export class Tab implements OnInit {
	isSelected: boolean = false;
	selected: boolean;
	public id: string;
	public name: string;
	public value: string;
	private _disabled: boolean = false;

	constructor(
		@Optional() @SkipSelf() @Host() public tabGroup: TabGroup,
		@Attribute('id') id: string,
		@Attribute('selected') selected: boolean,
		@Attribute('tabindex') tabindex: string,
		public tabsDispatcher: TabsDispatcher
	) {
		tabsDispatcher.listen((name) => {
			if (name === this.name) {
				this.isSelected = false;
			}
		});
		this.name = tabGroup.getName();
		this.tabGroup.register(this);

	}

	ngOnInit() {
		if (isPresent(this.selected)) {
			this.tabGroup.select(this);
		}
	}

	isDisabled(): boolean {
		return this._disabled || (isPresent(this.tabGroup) && this.tabGroup.disabled);
	}

	get disabled(): boolean {
		return this.isDisabled();
	}

	set disabled(value: boolean) {
		this._disabled = isPresent(value) && value !== false;
	}
}
