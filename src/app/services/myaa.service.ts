import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { UIStore, DataStore } from './../stores/stores.modules';
import { AuthHttp } from './../shared/common/authHttp';
import { Observable, Subject } from 'rxjs/Rx';
import { Analytics } from './analytics.service';
import { NotificationService } from './notifications.service';
import { QuoteService } from './quote.service';
import { CONSTS } from './../constants';

export class MyAAUserResponses {
	_Registered: Number = 1;
	_NotRegisteredVerified: Number = 2;
	_NotRegistered: Number = 3;
	_RegisteredAwaitingValidation: Number = 4;
	_AlreadyRegistered: Number = 5;
	_InvalidPassword: Number = 6;
	_InvalidEmail: Number = 7;
}

@Injectable()
export class MyAAService {
	loginSubscription: Subject<any> = new Subject();
	loginFailure: Subject<any> = new Subject();
	userCheckSubscription: any = new Subject();
	private baseURL = CONSTS.getBaseUrlWithContext();
	private _USER_EXISTS_URL = this.baseURL + 'users/me/email';
	private _LOGIN_URL = this.baseURL + 'oauth/token';
	private _GET_USER_URL = this.baseURL + 'users/me';
	private _SAVE_QUOTE_URL = this.baseURL + 'users/me';
	private _REGISTER_URL = this.baseURL + 'users';
	private _AUTH_COOKIE = this.baseURL + 'cookie/ronan';

	constructor(
		private auth: AuthHttp,
		private analytics: Analytics,
		private http: Http,
		private uiStore: UIStore,
		private dataStore: DataStore,
		private quoteService: QuoteService,
		private notifications: NotificationService
	) {

		this.loginSubscription.subscribe((next) => {
			this.auth.setToken(next);
			this.getUser().subscribe(
				(user) => {
					let userObject = user.json();
					if (userObject.quotes && next.retrieveQuote) {
						this.quoteService.retrieveQuoteList.next(userObject.quotes);
					}
					this.dataStore.setAuthenticatedUser(userObject);
				}
			);
		}, (err) => {
			console.log('FAIL');
		});
	}

	checkIfUserExists(email) {
		return this.auth.put(this._USER_EXISTS_URL, JSON.stringify({ email: email }));
	}

	mapUserResponse(res) {
		let obj = res.json();
		obj.res = this.checkIfUserExistsResponseMapping(obj.login).res;
		return obj;
	}

	checkIfUserExistsResponseMapping(resID: string) {
		let USER_EXISTS_MAP = [];
		USER_EXISTS_MAP["0"] = { res: 'Not Registered' };
		USER_EXISTS_MAP["1"] = { res: 'Registered' };
		USER_EXISTS_MAP["2"] = { res: 'Logged In' };
		return USER_EXISTS_MAP[resID];
	}

	saveQuote() {
		return this.auth.put(this._SAVE_QUOTE_URL, JSON.stringify({ saveMyAA: true }));
	}

	register(user, pass) {
		let registerObject = {
			email: user,
			password: pass
		};
		let res = this.auth.post(this._REGISTER_URL, JSON.stringify(registerObject));
		res.subscribe((next) => {
			this.analytics.registerEvent.next('success');
		}, (err) => {
			this.analytics.registerEvent.next('failure');
		});
		return res;
	}

	login(user: string, pass: string, triggerRetrieveQuote?: boolean) {
		let res = this.auth.post(this._LOGIN_URL, `email=${user}&password=${pass}&grant_type=password`)
			.retryWhen((attempts) => {
				return Observable.range(1, 10).zip(attempts, (i) => { return i; }).flatMap((i) => {
					let time = i * 6;
					this.notifications.createTimedError(`Sorry, we could not connect at the moment.`, time);
					this.analytics.errorEvents.next({
						service: 'MYAA_LOGIN',
						error: 'Couldnt reach the error service.'
					});
					return Observable.timer(time * 1000);
				});
			});
		res.subscribe((next) => {
			let lgnObj = next.json();
			if (lgnObj.error === 'unauthorized') {
				return this.analytics.loginEvents.next('failure');
			}
			this.analytics.loginEvents.next('success');
			if (triggerRetrieveQuote) {
				lgnObj.retrieveQuote = true;
			}
			this.loginSubscription.next(lgnObj);
		}, (err) => {
			this.analytics.loginEvents.next('failure');
		});
		return res;
	}

	getUser() {
		return this.auth.get(this._GET_USER_URL);
	}
}
