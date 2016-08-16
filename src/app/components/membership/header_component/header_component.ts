import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {UIStore, DataStore} from './../../../stores/stores.modules';
let template = require('./header_component.html');

@Component({
	selector: 'c-top-nav',
	template: template,
	directives: []
})
export class HeaderComponent {
	price: any;
	prev: any = null;
	header: any;
	isPriceVisible: boolean = true;

	constructor(
		public uiStore: UIStore,
		private _dataStore: DataStore,
		private _router: Router
	) {
		this.uiStore.select('activePage').on('update', (e) => {
			this.updateByPageObject(e.data.currentData);
		});
		this.price = this._dataStore.get(['pricing', 'estimate', 'calculatedPrice']);
		this._dataStore.select('pricing', 'estimate', 'calculatedPrice').on('update', (e) => {
			this.price = e.data.currentData;
		});
	}

	updateByPageObject(page) {
		this.header = page.title;
		if (page.prev) {
			this.prev = this.uiStore.get(['pages', page.prev]);
		} else {
			this.prev = null;
		}
		if (page.options && page.options.navHidden) {
			this.prev = null;
			this.isPriceVisible = false;
		} else {
			this.isPriceVisible = true;
		}
	}

	toggleDropdown() {
		let path = ['overView', 'isVisible'];
		this.uiStore.update(path, !this.uiStore.get(path));
	}
	
	triggerBack() {
		if (this.prev) {
			this._router.navigate([this.prev.address]);
		}
	}
}
