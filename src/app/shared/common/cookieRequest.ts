import {BrowserXhr, HTTP_PROVIDERS} from '@angular/http';
import {Injectable, provide} from '@angular/core';

@Injectable()
export class CORSBrowserXHR extends BrowserXhr {
	build(): any {
		let xhr: any = super.build();
		xhr.withCredentials = true;
		return xhr;
	}
}