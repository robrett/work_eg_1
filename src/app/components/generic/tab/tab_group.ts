import { Component, Attribute, EventEmitter } from '@angular/core';
import {isPresent, NumberWrapper} from '@angular/platform-browser/src/facade/lang';
import { TabsDispatcher } from './tab_dispatcher';
import {Tab} from './tab';

let _uniqueIdCounter: number = 0;

let template = require('./tab_group.html');

@Component({
	selector: 'c-tab-group',
	outputs: ['change'],
	inputs: ['disabled', 'value'],
	template: template,
	providers: [TabsDispatcher]
})
export class TabGroup {
	value: any;
	_name: string;
	_tabs: Tab[];
	activeDescendent: any;
	_disabled: boolean;
	selectedTabId: string;
	change: EventEmitter<any> = new EventEmitter();
	tabindex: number;

	constructor(
		@Attribute('tabindex') tabindex: string,
		@Attribute('disabled') disabled: string,
		public tabsDispatcher: TabsDispatcher
	) {
		this._name = `tabs-group-${_uniqueIdCounter++}`;
		this._tabs = [];
		this.selectedTabId = '';
		this._disabled = false;

		this.disabled = isPresent(disabled);
		this.tabindex = isPresent(tabindex) ? NumberWrapper.parseInt(tabindex, 10) : 0;

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

	get tabs() {
		return this._tabs;
	}

	select(tab: Tab) {
		this.disabled = isPresent(this.disabled) && this.disabled !== false;
		if (isPresent(tab.value) && tab.value !== '') {
			this.tabsDispatcher.notify(this._name);
			this._tabs.forEach(_tab => {
				if (_tab.value === tab.value) {
					_tab.isSelected = true;
					this.selectedTabId = _tab.id;
					this.activeDescendent = _tab.id;

				}
			})
		}
	}

	updateValue(tab: Tab) {
		this.selectedTabId = tab.id;
		this.activeDescendent = tab.id;
		this.change.next(tab);
	}

	register(tab: Tab) {
		this._tabs.push(tab);
	}
}
