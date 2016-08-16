import { Component, OnDestroy, ElementRef, OnInit, Renderer, HostBinding } from '@angular/core';
import { isPresent } from '@angular/platform-browser/src/facade/lang';
import { UIStore, DataStore } from './../../../stores/stores.modules';
import { Utils } from './../../../shared/utilities/utilities.component';
import { CONSTS } from './../../../constants';
import * as Velocity from 'velocity-animate';
import { Analytics } from './../../../services/analytics.service';
import { Observable } from 'rxjs/Rx';
let template = require('./overview.html');

/**
 *  Overview
 *
 *  Loads a half/full screen drop down that contains information about the membership journey
 *
 *  @selector c-overview
 *  @host [class.isVisible] isVisible - Show or Hide the Overlay
 *
 *  ### Example
 *  ````html
 *  <c-overview></c-overview>
 *  ````
 *  
 */

@Component({
	selector: 'c-overview',
	template: template
})
export class OverViewComponent implements OnInit, OnDestroy {
	@HostBinding('class.isVisible') get isVisible() { return this._isVisible; };
	options: any;
	journeySchema: any;
	primaryMember: any;
	price: any;
	members: any = [];
	element: any;

	private _isVisible: boolean = false;
	set isVisible(v) {
		this._isVisible = v;
	}

	updateMembersSubscription: ISubscriptionDefinition<any>;
	updateOptionsSubscription: ISubscriptionDefinition<any>;
	updatePricingSubscription: ISubscriptionDefinition<any>;
	updateQuoteSubscription: ISubscriptionDefinition<any>;

	priceFrequency: string;
	quotation: Quote;
	breakdown: QuoteBreakdownItem[];

	constructor(
		private _analytics: Analytics,
		private _dataStore: DataStore,
		private _uiStore: UIStore,
		private _el: ElementRef,
		private _renderer: Renderer
	) {
		this.updateQuoteSubscription = this._dataStore.subscribe(CONSTS.QUOTE_UPDATE, this.replaceQuote);
		this.updateMembersSubscription = this._dataStore.subscribe(CONSTS.MEMBER_UPDATE, this.updateMembers);
		this.updateOptionsSubscription = this._dataStore.subscribe(CONSTS.ADDONS_UPDATE, this.updateOptions);
		this.updatePricingSubscription = this._dataStore.subscribe(CONSTS.PRICING_UPDATE, this.updatePrice);

		let resizeEvent = Observable.fromEvent(window, 'resize')
			.debounceTime(50);

		resizeEvent.subscribe(() => {
			let distance = Utils.isViewportTablet() ? '100vh' : '400px';
			if (this._isVisible) {
				Velocity(
					this.element,
					{ height: distance },
					{ visibility: 'visible', duration: 300 });
			}
		});

	}

	setPricingFrequency(frequency) {
		this._dataStore.update(['pricing', 'frequency'], frequency, CONSTS.PRICING_UPDATE);
	}


	replaceQuote = (quote) => {
		this.updateOptions();
		this.updatePriceBreakdown(quote);
		this.updateMembers();
		this.updatePrice();
	}


	updatePriceBreakdown = (obj) => {
		this.quotation = obj.get(['config', 'quotation']);
		this.breakdown = this.quotation ? this.quotation.breakdown : null;
	}

	/**
	 *  Called by ADDONS_UPDATE Datastore Subscription
	 *  Gets the active/named benefits in the active schema
	 *  Update the Price based on those benefits
	 *
	 */
	updateOptions = () => {
		this.journeySchema = this._dataStore.get(['config']);
		this.options = _.filter(this.journeySchema.coverLevel, (e: any) => {
			if (e.active) {
				return e;
			}
		});
		this.updatePrice();
	}

	/**
	 *  Called by MEMBER_UPDATE Datastore Subscription
	 *  Get's all Members except primary (price=0)
	 *  Update the Price based on members
	 *
	 */
	updateMembers = () => {
		this.members = [];
		_.forEach(_.values(this._dataStore.get(['config', 'members'])), (v: any, i) => {
			this.primaryMember = _.find(v, (n: any) => {
				return n.type === 'primaryUser';
			});
			this.members = _.filter(v, (n: any) => {
				return n.type !== 'primaryUser';
			});
		});
		this.updatePrice();
	}

	updatePrice = () => {
		this.priceFrequency = this._dataStore.get(['pricing', 'frequency']);
		this.price = this._dataStore.get(['pricing', 'estimate', 'calculatedPrice']);
	}

	/**
	 *  @angular OnInit
	 *
	 *  Creates a Subscription to the UIStore that will show/hide element on updates to
	 *  {overview : {isVisible: boolean}}
	 *
	 */
	ngOnInit() {
		let sub = this._uiStore.select('overView', 'isVisible');
		this._isVisible = sub.get();
		this.element = this._el.nativeElement;
		sub.on('update', this.updateVisiblity);
	}

	/**
	 *  Toggles Visibility
	 * 	@param {Event|Boolean} event - true/false
	 *  Both From Update Events & From User Input
	 */
	updateVisiblity = (event) => {
		let toggle = isPresent(event.data.currentData) ? event.data.currentData : event;
		this._isVisible = toggle;
		this._analytics.triggerEvent('overview', 'visiblity', toggle);
		if (toggle) {
			this.open();
		} else {
			this.close();
		}
	}

	/**
	 * 	Triggers Overview to Open & Animations
	 */
	open = () => {
		let items = this._el.nativeElement.querySelectorAll('.o-links');
		let button = this._el.nativeElement.querySelectorAll('button');

		this._renderer.setElementStyle(document.querySelector('body'), 'overflow', 'hidden');
		this._renderer.setElementStyle(document.querySelector('body'), 'position', 'fixed');
		let distance = Utils.isViewportTablet() ? '100vh' : '400px';
		Velocity(this.element, { height: distance }, { visibility: 'visible', duration: 300 });
		Velocity(items, 'transition.slideUpIn', { delay: 300, stagger: 200, duration: 800, visibility: 'visible' });
		Velocity(button, 'transition.expandIn', { delay: 1200, duration: 350, visibility: 'visible' });
	}

	/**
	 * 	Triggers Overview to Open & Animations
	 */
	close() {
		let items = this._el.nativeElement.querySelectorAll('.o-links');
		let button = this._el.nativeElement.querySelectorAll('button');
		let distance = 0;
		this._renderer.setElementStyle(document.querySelector('body'), 'overflow', 'auto');
		this._renderer.setElementStyle(document.querySelector('body'), 'position', 'relative');

		Velocity(button, 'transition.expandOut', { duration: 350, visibility: 'visible' });
		Velocity(items, 'transition.slideUpOut', { stagger: 100, duration: 300, visibility: 'hidden' });
		Velocity(this.element, { height: distance }, { delay: 800, visibility: 'hidden', duration: 300 });
		this._uiStore.update(['overView', 'isVisible'], false);
	}

	ngOnDestroy() {
		this._dataStore.unsubscribe(this.updateMembersSubscription);
		this._dataStore.unsubscribe(this.updateOptionsSubscription);
		this._dataStore.unsubscribe(this.updatePricingSubscription);
	}


}
