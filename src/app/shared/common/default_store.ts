export let defaultStore: any = {};
import * as Baobab from 'Baobab';

export class DefaultStore {

	private _store: any;
	private _channel: string;

	constructor(channel: string, store?: any) {
		this._channel = channel + '.store';

		if (store) {
			this._store = new Baobab(store, { asynchronous: false });
		} else {
			this._store = new Baobab(defaultStore);
		}

	}

	on(event: string, e: any) {
		return this._store.on(event, e);
	}

	select(...args): DefaultStore {
		return this._store.select(args);
	}

	get(path?: any): any {
		return path ? this._store.get(path) : this._store.get();
	}

	remove(prop: any, topic?: string): void {
		this._store.unset(prop);
	}

	update(prop: any, value: any, topic?: any): void {
		this._store.set(prop, value);
	}

	push(prop: any, value: any) {
		this._store.push(prop, value);
	}
}
