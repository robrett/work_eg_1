import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UIStore, DataStore } from './../../stores/stores.modules';
let template = require('./confirmation.html');

/**
 *  Confirmation Page Component
 */

@Component({
	selector: 'p-confirmation',
	template: template
})
export class MembershipConfirmationPageComponent {
	// UI Settings for Confirmation
	page: UIPage;
	convertedQuote: QuoteConverted;
	primaryUser: any;
	members: any = [];

	constructor(
		private _el: ElementRef,
		private _uiStore: UIStore,
		private _dataStore: DataStore,
		private _router: Router
	) {
		this.page = this._uiStore.getPage('confirmation');
		this.convertedQuote = this._dataStore.get(['config', 'convertedQuote']);
		if (!this.convertedQuote) {
			this.convertedQuote = JSON.parse(sessionStorage.getItem('convertedQuote'));
			if (!this.convertedQuote) {
				this._router.navigate(['/']);
			} else {
				this.init();
			}
			this._dataStore.deleteConvertedQuote();
		} else {
			this.init();
		}
	}

	init() {
		let memberList = [];
		_.forEach(this.convertedQuote.members, (e) => {
			_.forEach(e, (member: any) => {
				memberList.push(member);
				this.members.push(member);
			});
		});
		this.primaryUser = memberList.shift();
		this.members = memberList;
		// Deletes all data in the journey
		this._dataStore.resetConfig();
	}

}
