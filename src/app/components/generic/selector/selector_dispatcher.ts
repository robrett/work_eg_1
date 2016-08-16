import {Injectable} from '@angular/core';
@Injectable()
export class SelectorDispatcher {
	private _listeners: any;

	constructor() {
		this._listeners = [];
	}

	notify(name: string) {
		this._listeners.forEach(listener => listener(name));
	}

	listen(listener) {
		this._listeners.push(listener);
	}
}
