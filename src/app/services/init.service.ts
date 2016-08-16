import {Injectable} from '@angular/core';
import {AuthHttp} from './../shared/common/authHttp';
import {CONSTS} from './../constants';
import {environment } from './../index';

export class Config {
	baseUrl: string = `${CONSTS.getBaseUrlWithContext()}config`;
}

export class ProductConfig {
	criteria: any[];
	coverLevel: any[];
}

@Injectable()
export class InitService {
	public current: ProductConfig = null;
	public isProductConfigPreloaded = false;
	constructor(
		private http: AuthHttp,
		private config: Config
	) {}

	load(): Promise<ProductConfig> {
		if (this.current !== null) {
			return new Promise((res) => {
				res(this.current);
			});
		}
		let promise = this.http.get(this.config.baseUrl).map(res => res.json()).toPromise();
		if (environment.production) {
			// ENDPOINTS
			// HOMESTART
			// HOMESTARTPRICE
			// HOMESTARTPRICEADDITIONAL
			// HOMESTARTPRICEADDITIONALPLATINUM
			// QUOTEFEES
			// LANDINGPAGE2ADDITIONAL
			document.cookie = 'xsrftoken=HOMESTARTPRICE';
		}
		promise.then((site) => {
			this.current = site;
			this.isProductConfigPreloaded = true;
		});
		return promise;
	}
}

export var INIT_SERVICE_PROVIDERS = [
	Config,
	ProductConfig,
	InitService
];
