import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UIStore, DataStore } from './../../stores/stores.modules';
import { Observable } from 'rxjs/Observable';
import { CanDeactivate } from '@angular/router';
import { NotificationService, PaymentService } from './../../services/index';
let template = require('./payment.html');

/**
 *  Payment Page Component
 */

@Component({
	selector: 'p-payment',
	template: template
})
export class MembershipPaymentPageComponent implements CanDeactivate<boolean>, OnInit {
	// Default Settings for Payment Page
	page: UIPage;
	// Payment type - Card|Bank
	paymentType: string = 'Card';
	// Payment Frequency - annual|monthly
	frequency: string = 'monthly';
	quote: Quote;
	// Restrict Navigation if Quote isn't converted
	isQuoteConverted: boolean = false;
	isPaymentAgreementActive: boolean = true;

	constructor(

		private _router: Router,
		private _dataStore: DataStore,
		private _uiStore: UIStore,
		private _el: ElementRef,
		private _notifications: NotificationService,
		private _paymentService: PaymentService
	) {
		this.page = this._uiStore.getPage('payment');
		// Set Frequency to monthly if no option set in store
		this.frequency = this._dataStore.get(['pricing', 'frequency']) ?
			this._dataStore.get(['pricing', 'frequency']) : 'monthly';
		this.paymentType = this._dataStore.get(['pricing', 'type']);
		this.paymentType = 'Bank';
		this.quote = this._dataStore.get(['config', 'quotation']);

	}

	ngOnInit() {
		// TODO: Change this to a session object
		// IF Quote has been converted send user to first page
		let convertedQuote = JSON.parse(sessionStorage.getItem('convertedQuote'));
		if (convertedQuote) {
			this._dataStore.deleteConvertedQuote();
			this._router.navigate(['/']);
		};
	}

	/**
	 * 	Called from onSuccess Events from Child Components
	 * 	@param string convertedQuoteReference - 
	 */
	continueToConfirmation(convertedQuoteReference: string) {
		this._paymentService.convertQuote(convertedQuoteReference).subscribe((next) => {
			this.isQuoteConverted = true;
			this._dataStore.convertQuote(next.json());
			this._router.navigate(['confirmation']);
		});
	}

	/**
	 * 	Swap between payment types and sends the user back to the terms and conditions page
	 */
	togglePaymentType() {
		this.paymentType = this.paymentType === 'Bank' ? 'Card' : 'Bank';
		this._dataStore.update(['pricing', 'type'], this.paymentType);
		this._router.navigateByUrl(`/terms_and_conditions/${this.paymentType}`);
	}

	/**
	 * 	Hides Credit Card Agreement
	 */
	toggleAgreement(event) {
		this.isPaymentAgreementActive = event ? event : false;
	}

	/* istanbul ignore next */
	routerCanDeactivate() {
		return new Promise(res => {
			res(true);
		});
	}


	/**
	 * 	If the user tries to leave the page with an non-converted quote this will block
	 * 	them, or if they try to leave the page while credit card is active, it will trigger
	 * 	a confirmation notification with an observable promise to prevent them leaving until
	 * 	the user accepts the notification.
	 * 
	 */
	canDeactivate(): boolean | Observable<any> {
		if (this.isQuoteConverted) {
			return true;
		}
		if (this.paymentType === 'Card' && this.isPaymentAgreementActive === false) {
			// Create a Promise and Passes it to the Notification Service
			let guardPromise = new Promise((res, rej) => {
				let p = this._notifications.createConfirmationNotification(
					`If you leave your credit card information will be lost.`);

				// Listen for Notifcation Confirmation
				p.subscribe((next) => {
					res(true);
				});
			});
			// Angular (RC 1) Needed an Observable in order to guard the deactivation
			let o = Observable.fromPromise(guardPromise);
			return o;
		} else {
			return true;
		}
	}

}
