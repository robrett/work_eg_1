import { Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import {AuthHttp} from './../shared/common/authHttp';
import {CONSTS} from './../constants';
import {Analytics} from './analytics.service';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class PaymentService {
	BASE_URL: string = CONSTS.getBaseUrlWithContext();
	CONVERT_QUOTE_URL: string = this.BASE_URL + 'convert/';
	UPDATE_PROPOSAL_URL: string = this.BASE_URL + 'users/me';
	UPDATE_PAYMENT_URL: string = this.BASE_URL + 'users/me/payment';
	BANK_URL: string = this.BASE_URL + 'users/me/bank';
	TOKEN_AGREEMENT: string = this.BASE_URL + 'users/me/payment/cardAgreement';

	constructor(
		private _analytics: Analytics,
		private _auth: AuthHttp,
		public http: Http
	) { }


	updatePaymentType(type?: string, frequency?: string) {
		return this._auth.put(this.UPDATE_PAYMENT_URL, JSON.stringify({ type: type, frequency: frequency }));
	}

	confirmTermsConditions(all: boolean) {
		return this._auth.put(this.TOKEN_AGREEMENT, JSON.stringify({ all: all }));
	}
	/**
	 * 	Validates Bank Account Details
	 * 	@param AccountDetails accountDetails
	 * 	@url /users/me/bank
	 * 	@return Observable<AccountDetails>
	 */
	validateBankDetails(accountDetails: AccountDetails): Observable<Response> {
		return this._auth.put(this.BANK_URL, JSON.stringify(accountDetails));
	}
	/**
	 * 	Convert the Quote
	 * 	@param string quoteReference
	 * 	@url /convert/[QUOTE_REFERENCE]
	 * 	@return Observable<QuoteConverted>
	 * 	
	 */
	convertQuote(quoteReference: string): Observable<Response> {
		return this._auth.get(this.CONVERT_QUOTE_URL + quoteReference);
	}


}
