import {provide, Injectable} from '@angular/core';
import {Http, Headers, Request, RequestOptions, RequestOptionsArgs, RequestMethod, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';
// Avoid TS error "cannot find name escape"
declare var escape: any;

interface IToken {
	access_token: string;
	expiration_date?: any;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: string;
}

export interface IAuthConfig {
	headerName: string;
	headerPrefix: string;
	tokenName: string;
	tokenGetter: any;
	globalHeaders: Array<Object>;
	setToken(token): void;
}
/**
 * Sets up the authentication configuration.
 */

export class AuthConfig {
	config: any;
	headerName: string;
	headerPrefix: string;
	tokenName: string;
	tokenGetter: ()=> IToken|any;
	noTokenScheme: boolean;
	globalHeaders: Array<Object>;

	constructor(config?: any) {
		this.config = config || {};
		this.headerName = 'Authorization';
		this.headerPrefix = 'Bearer ';
		this.tokenName = 'access_token';
		this.tokenGetter = this.config.tokenGetter || (() => localStorage.getItem(this.tokenName));
		this.globalHeaders = [{ 'X-XSRF-TOKEN': getCookie('xsrftoken') }];
	}

	public setToken(token: IToken) {
		let tk: IToken = token;
		tk.expiration_date = moment().add(token.expires_in, 'seconds');
		this.tokenGetter = (): IToken => tk;
	}

	getConfig() {
		return {
			headerName: this.headerName,
			headerPrefix: this.headerPrefix,
			tokenName: this.tokenName,
			tokenGetter: this.tokenGetter,
			globalHeaders: this.globalHeaders,
			setToken: this.setToken
		};
	}
}

/**
 * Allows for explicit authenticated HTTP requests.
 */

@Injectable()
export class AuthHttp {
	public tokenStream: Observable<string>;
	private _config: IAuthConfig;

	constructor(options: AuthConfig, private http: Http) {
		this._config = options.getConfig();
	}

	setToken(token) {
		this._config.setToken(token);
	}

	setCookieToken() {
		let cookie = parseCookie(getCookie('MyAAAuthCookie'));
		if (cookie) {
			this._config.setToken(this.convertCookieToToken(cookie));
		} else {
			return new Error('NO SESSION COOKIE FOUND');
		}
	}



	convertCookieToToken(tkn) {
		let obj = {};
		obj['access_token'] = tkn.SessionID;
		obj['expires_in'] = '1800';
		return obj;
	}

	getCookie(name) {
		let value = '; ' + document.cookie;
		let parts = value.split('; ' + name + '=');
		if (parts.length === 2) {
			return parts.pop().split(';').shift();
		}
	}

	setGlobalHeaders(headers: Array<Object>, request: Request | RequestOptionsArgs) {
		headers = [];
		headers.push({ 'X-XSRF-TOKEN': this.getCookie('xsrftoken') });
		headers.forEach((header: Object) => {
			let key: string = Object.keys(header)[0];
			let headerValue: string = (<any>header)[key];
			request.headers.set(key, headerValue);
		});
	}

	request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

		let request: any;
		let globalHeaders = this._config.globalHeaders;

		if (typeof url === 'string') {
			let reqOpts: RequestOptionsArgs = options || {};

			if (!reqOpts.headers) {
				reqOpts.headers = new Headers();
			}

			if (globalHeaders) {
				this.setGlobalHeaders(globalHeaders, reqOpts);
			}

			if (tokenNotExpired(null, this._config.tokenGetter())) {
				let token: IToken = this._config.tokenGetter();
				reqOpts.headers.set(this._config.headerName, this._config.headerPrefix + token.access_token);
			}
			request = this.http.request(url, reqOpts);
		} else {
			let req: Request = <Request>url;

			if (!req.headers) {
				req.headers = new Headers();
			}

			if (globalHeaders) {
				this.setGlobalHeaders(globalHeaders, req);
			}
			if (tokenNotExpired(null, this._config.tokenGetter())) {
				let token: IToken = this._config.tokenGetter();
				req.headers.set(this._config.headerName, this._config.headerPrefix + token.access_token);
			}
			request = this.http.request(req);
		}


		return request;
	}

	get(url: string, options?: RequestOptionsArgs): Observable<Response> {
		return this.requestHelper({ url: url, method: RequestMethod.Get }, options);
	}

	post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
		return this.requestHelper({ url: url, body: body, method: RequestMethod.Post }, options);
	}

	put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
		return this.requestHelper({ url: url, body: body, method: RequestMethod.Put }, options);
	}

	delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
		return this.requestHelper({ url: url, method: RequestMethod.Delete }, options);
	}

	patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
		return this.requestHelper({ url: url, body: body, method: RequestMethod.Patch }, options);
	}

	head(url: string, options?: RequestOptionsArgs): Observable<Response> {
		return this.requestHelper({ url: url, method: RequestMethod.Head }, options);
	}

	private requestHelper(requestArgs: RequestOptionsArgs, additionalOptions: RequestOptionsArgs): Observable<Response> {
		let options: RequestOptions = new RequestOptions(requestArgs);

		if (additionalOptions) {
			options = options.merge(additionalOptions);
		}
		return this.request(new Request(options));
	}

}

/**
 * Helper class to decode and find JWT expiration.
 */

export class JwtHelper {

	public isTokenExpired(token: any, offsetSeconds?: number) {

		let expireDate = token.expiration_date;
		let date = moment();
		// Token expired?
		return moment(expireDate).isBefore(moment());
	}
}



export function parseCookie(cookieString: string) {
	if (!cookieString) {
		return;
	}
	let obj = {};
	cookieString.split('&').forEach((prop) => {
		let tup = prop.split('=');
		obj[tup[0]] = tup[1];
	});
	return obj;
}

/**
 * Checks for presence of token and that token hasn't expired.
 * For use with the @CanActivate router decorator and NgIf
 */
export function tokenNotExpired(tokenName?: string, tokenObj?: any) {
	let authToken: string = tokenName || 'access_token';
	let token: any;

	if (tokenObj) {
		token = tokenObj;
	} else {
		token = localStorage.getItem(authToken);
	}

	let jwtHelper = new JwtHelper();

	if (!token || jwtHelper.isTokenExpired(token, null)) {
		return false;
	} else {
		return true;
	}
}

export function getCookie(name) {
		let value = '; ' + document.cookie;
		let parts = value.split('; ' + name + '=');
		if (parts.length === 2) {
			return parts.pop().split(';').shift();
		}
}

export const AUTH_PROVIDERS: any = [
	provide(AuthHttp, {
		useFactory: (http: Http) => {
			return new AuthHttp(new AuthConfig(), http);
		},
		deps: [Http]
	})
];