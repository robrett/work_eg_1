import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AuthHttp } from './../shared/common/authHttp';
import { isJsObject, isBlank } from '@angular/platform-browser/src/facade/lang';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from './notifications.service.ts';
import { Analytics } from './analytics.service';
import { CONSTS } from './../constants';

@Injectable()
export class ReferenceService {
	private _baseURL = CONSTS.BASE_URL;
	private _ADDRESS_URL = `${this._baseURL}XREFService/xref/address`;
	private _SELECT_ADDRESS_URL = `${this._baseURL}XREFService/xref/address/selected`;
	private _BANK_URL = `${CONSTS.getBaseUrlWithContext()}users/me/bank`;
	private _TITLE_URL = `${this._baseURL}XREFService/xref/titles`;

	constructor(
		private analytics: Analytics,
		private notifications: NotificationService,
		private auth: AuthHttp,
		public http: Http
	) { }

	getTitles() {
		return this.auth.get(this._TITLE_URL);
	}

	selectAddress(id) {
		let options = new RequestOptions({
			headers: new Headers({
				'Content-Type': 'application/json;charset=UTF-8'
			})
		});
		return this.http.post(this._SELECT_ADDRESS_URL, JSON.stringify({ id: id }), options);
	}

	checkAddress(input: any) {
		let cleanInput = _.mapValues(input, (e) => {
			if (isJsObject(e)) {
				return e.description;
			} else if (isBlank(e)) {
				return '';
			} else {
				return e;
			}
		});
		let options = new RequestOptions({
			headers: new Headers({
				'Content-Type': 'application/json;charset=UTF-8'
			})
		});
		return this.auth.put(this._ADDRESS_URL, JSON.stringify(cleanInput), options).retryWhen((attempts) => {
			return Observable.range(1, 10).zip(attempts, (i) => { return i; }).flatMap((i) => {
				let time = i * 6;
				this.notifications.createTimedError(`Could not connect.`, time);
				this.analytics.errorEvents.next({
					service: 'REF_CHECK_ADDRESS',
					error: 'Couldnt reach the Address Checker service.'
				});
				return Observable.timer(time * 1000);
			});
		});

	}
}
