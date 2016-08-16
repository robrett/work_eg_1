import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
} from '@angular/core';
import { isString } from '@angular/platform-browser/src/facade/lang';
import { UIStore, DataStore } from './../../../stores/stores.modules';
import { Analytics } from './../../../services/analytics.service';
import { Subject } from 'rxjs/Rx';

@Component({
	selector: 'm-cc-form',
	template: require('./cc_form.html'),

})

export class CreditCardFormComponent implements OnInit {
	@Output() onPaymentTypeChange = new EventEmitter();
	@Output() onSuccess = new EventEmitter();
	@Input('quote') quote: Quote;
	@Input('frequency') frequency: string;
	throttleHeight: Subject<any> = new Subject<any>();
	iframeHeight: any;
	iframeWidth: any;
	errorMessageVisible: boolean = false;
	iframeVisible: boolean = true;
	data: any;


	constructor(
		private _analytics: Analytics,
		private _uiStore: UIStore,
		private _dataStore: DataStore
	) {
		this.data = this._dataStore.get(['paymentMethods', 'credit']);
		this.throttleHeight.subscribe(this.updateCCDimensions);
	}

	/**
	 * 	Method called when window recieves messages from the Realex form
	 */
	watchEvents = (evt) => {
		// TODO: Change This Origin to Real Address for Deployment
		if (evt.data !== null && isString(evt.data) && evt.origin === "https://hpp.sandbox.realexpayments.com") {
			let data = JSON.parse(evt.data);
			if (data.QUOTE_REFERENCE && data.RESULT === '00') {
				this._analytics.triggerPaymentEvent('credit', 'success');
				this.onSuccess.next(data.QUOTE_REFERENCE);
			} else if (data.RESULT === '101') {
				this._analytics.triggerPaymentEvent('credit', 'declined');
				this.iframeVisible = false;
				this.errorMessageVisible = true;
				setTimeout(() => {
					this.iframeVisible = true;
				}, 1);

			}
			if (data.iframe) {
				this.throttleHeight.next(data.iframe);

			}
		}

		if (evt.data === 'SUCESS') {
			this._analytics.triggerPaymentEvent('credit', 'success');
			this.onSuccess.next(true);

		}
	}

	swapPaymentType() {
		this.onPaymentTypeChange.next(true);
	}

	updateCCDimensions = (data) => {
		// TODO: Implement Updating Width/Height
		this.iframeHeight = data.height;
		this.iframeWidth = data.width;
	}

	ngOnInit() {
		if (window.addEventListener) {
			window.addEventListener('message', this.watchEvents, false);
			// document.querySelector('iframe').addEventListener("message", this.watchEvents, false);
		} else {
			// window.attachEvent('message', this.watchEvents);
		}
	}
}
