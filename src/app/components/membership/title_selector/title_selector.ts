import {Component, Input, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import { DataStore } from './../../../stores/stores.modules';
import {CONSTS} from './../../../constants';

@Component({
	selector: 'm-title-selector',
	template: require('./title_selector.html'),
})

export class TitleSelectorComponent implements OnDestroy {
	// Input Field
	@Input('field') field: any;
	// Field Control
	@Input('control') control: FormControl;
	// List of Titles
	titles: any[] = [];
	// Subscription to Datastore for updated title
	sub: ISubscriptionDefinition<any>;

	constructor(
		private _dataStore: DataStore
	) {
		this.titles = this._dataStore.getTitles();
		this.sub = this._dataStore.subscribe(CONSTS.TITLE_OPTION, (data) => {
			this.titles = data.get('titles');
		});
	}

	ngOnDestroy() {
		this._dataStore.unsubscribe(this.sub);
	}

}

