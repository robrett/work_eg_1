import {
	Component,
	Input,
	ElementRef,
	trigger,
	state,
	HostBinding,
	style,
	transition,
	animate} from '@angular/core';
import { Router } from '@angular/router';
import {DataStore} from './../../../stores/stores.modules';
import {QuoteService, MyAAService, NotificationService} from './../../../services/index';
let template = require('./quotes_list.html');

@Component({
	selector: 'm-quotes-list',
	template: template,
	animations: [
		trigger('openList', [
			state('inactive', style({
				maxHeight: '0',
				padding: '0'
			})),
			state('active', style({
				maxHeight: '500px',
				padding: '5vh 0'
			})),
			transition('* => *', animate('350ms ease-in'))
		])
	]
})
export class QuotesListComponent {

	@HostBinding('class.isOpen') isOpenId: boolean = true;
	@Input('isVisible') isVisible: boolean = false;
	isLoading: boolean = false;
	quotes: any;
	open: string;

	constructor(
		private _el: ElementRef,
		private _router: Router,
		private _dataStore: DataStore,
		private notificationService: NotificationService,
		private myAAService: MyAAService,
		private quoteService: QuoteService,
	) {

		this.quoteService.retrieveQuoteList.subscribe((next) => {
			if (next) {
				this.quotes = next;
				this.open = 'active';
				this.isVisible = true;
			}
		});
	}

	cancel() {
		this.open = 'inactive';
		this.isVisible = false;
	}

	requoteQuote(quote) {
		if (this.isLoading === true) {
			return;
		}
		this.isLoading = true;
		this.quoteService.retrieveQuote(quote.reference).subscribe((res) => {
			this.isLoading = false;
			this.open = 'inactive';
			this.quoteService.setQuote(res.json(), true);
		},
			(err) => {
				if (err.status === 403) {
					this.isLoading = false;
					this.notificationService.createError(`Sorry, there was a problem retrieving your AA Membership quote. 
					Please try again.`);
				}
		});
	}
	/**
	 * 	Retrieves a specific from the quote service, updates the dataStore with the quote
	 * 	and then closes the retrieve quote list as well as redirecting the user to the
	 * 	price breakdown page
	 */
	retrieveQuote(quote) {
		if (this.isLoading === true) {
			return;
		}
		this.isLoading = true;
		this.quoteService.retrieveQuote(quote.reference).subscribe((res) => {
			this.isLoading = false;
			this.open = 'inactive';
			this.quoteService.setQuote(res.json(), false);
		},
			(err) => {
				if (err.status === 403) {
					this.isLoading = false;
					this.notificationService.createError(`Sorry, there was a problem retrieving your AA Membership quote. 
					Please try again.`);
				}
		});
	}
}
