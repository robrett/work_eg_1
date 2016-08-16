import { Injectable }          from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DataStore } from './../../../stores/datastore.store';
import { QuoteService } from './../../../services/quote.service';

@Injectable()
export class CanActivateQuote implements CanActivate {
	quote: any;

	constructor(
		private _quoteService: QuoteService,
		private _dataStore: DataStore,
		private router: Router) { }

	canActivate() {
		if (this.quote = this._dataStore.get(['config','quotation'])) {
			return true;
		} else {
			this._quoteService.getQuote().subscribe((next) => {
				this._dataStore.setConfig(next.json());
				return true;
			}, (err) => {
				// If No Quote - Send to Included
			});
			return true;
		}

	}
}