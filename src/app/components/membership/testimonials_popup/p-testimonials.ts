import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {QuoteService} from './../../../services/quote.service';
import {DataStore, UIStore} from './../../../stores/stores.modules';
let template = require('./p-testimonials.html');

@Component({
	selector: 'pu-testimonials',
	template: template

})
export class TestimonialPopupComponent {
	@Input('outcome') public outcome: Outcome;
	countdownStarted: boolean = false;

	constructor(
		private _router: Router,
		private _quoteService: QuoteService,
		private _dataStore: DataStore,
		private _uiStore: UIStore
	) {
		this._uiStore.select('modals', 'testimonials').on('update', this.activate);
	}

	activate = (e) => {
		this.goToBreakdownPage();
		// this._quoteService.getQuote().subscribe((next) => {
		// 	this._dataStore.setConfig(next.json());
		// });

	}

	goToBreakdownPage() {
		if (this.countdownStarted === false) {
			this.countdownStarted = true;
			setTimeout(() => {
				this._router.navigate(['/breakdown']);
				this._uiStore.closeAllModals();
			}, 3000);
		}
	}
}
