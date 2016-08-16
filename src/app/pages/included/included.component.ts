import {
	OnInit,
	Component,
	animate,
	transition,
	style,
	keyframes,
	trigger,
	ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { COLORS, CONSTS } from './../../constants';
import { DataStore, UIStore } from './../../stores/stores.modules';
import { QuoteService } from './../../services/quote.service';
import { Observable } from 'rxjs/Rx';
import { Utils } from './../../shared/utilities/utilities.component';
import { NotificationService } from './../../services/notifications.service';


/**
 *  Included Page Component
 *
 */
@Component({
	selector: 'p-included',
	template: require('./included.html')
})
export class MembershipIncludedPageComponent implements OnInit {
	// Default Settings for Included Page
	private page: UIPage;
	// Array of Journey Benefit Addon coverLevels
	private coverLevels: CoverLevel[];
	// User has accepted Terms/Conditions
	private hasAgreedTermsConditions: boolean = false;
	// Set to Monthly or Annually - Sets Prices
	private pricingFrequency: string;

	constructor(
		private route: ActivatedRoute,
		private dataStore: DataStore,
		private uiStore: UIStore,
		private quoteService: QuoteService,
		private el: ElementRef,
		private notificationService: NotificationService
	) { }

	ngOnInit() {
		this.page = this.uiStore.getPage('included');
		this.route.data.forEach((data: { config: any }) => {
			this.init();
		});
	}

	private init() {
		this.dataStore.subscribeAndGet(CONSTS.PRICING_UPDATE, () => {
			// Updates whether the monthly or annual price is shown for the cover levels
			this.pricingFrequency = this.dataStore.get(['pricing', 'frequency']);
		});
		this.coverLevels =
			_.cloneDeep(this.dataStore.select('config', 'coverLevel').get());
	}

	public navigateNext(e: Event) {
		if (!this.hasAgreedTermsConditions) {
			let el = this.el.nativeElement.querySelector('body > app-root > main > p-included > div > article > button');
			this.notificationService.createError('You must agree to the terms and conditions before continuing');
			Utils.scrollToElement(el);
		}

	}

	/**
	 *  On Click event if an addon isnt disabled it should call this and set the local active status
	 *  in order for the animation to update and also set the dataStores option
	 */

	public selectAddon(addonUpdate) {
		let level = this.dataStore.getCoverLevel(addonUpdate.index);
		this.coverLevels[addonUpdate.index].active = addonUpdate.isSelected;
		this.quoteService.updateCover(level, addonUpdate.isSelected)
			.retryWhen((attempts) => {
				return Observable.range(1, 3).zip(attempts, (i) => {
					return i;
				}).flatMap((i) => {
					let time = i * 6;
					return Observable.timer(time * 1000);
				});
			})
			.subscribe((next) => {
		});
		this.dataStore.toggleCoverLevel(addonUpdate.index, addonUpdate.isSelected);
	}

	public updateTermsBool(active: boolean) {
		this.hasAgreedTermsConditions = active;
		// Clear the Notifications Service once user accepts
		this.notificationService.clearLastErrorMsg();
		this.notificationService.clearNotifications();
	}

}
