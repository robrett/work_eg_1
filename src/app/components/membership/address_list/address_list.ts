import {Component, Input, Output, EventEmitter, OnChanges, ElementRef} from '@angular/core';
import {ReferenceService, NotificationService, Analytics} from './../../../services/index';
import {isPresent} from '@angular/platform-browser/src/facade/lang';
import {Observable, Subject} from 'rxjs/Rx';

/**
 * 	Address List Component
 * 	@hostBinding [class.isVisible] - isVisible - Show or Hide Address
 *
 */
@Component({
	selector: 'm-address-list',
	template: require('./address_list.html'),
	host: {
		'[class.isVisible]': 'isVisible'
	}
})
export class AddressListComponent implements OnChanges {
	// The Address String to Validate
	@Input('data') data: string;
	// Whether the Component is currently visible
	@Input('visible') isVisible: boolean = false;
	// onValid is emitted after the user selects an address and confirmation is
	// recieved from the GeoCode service
	@Output() onValid: EventEmitter<any> = new EventEmitter();
	// onReadyValid is emitted once the address service has retrieved addresses
	// from the geocode service to validate
	@Output() onReadyValid: EventEmitter<any> = new EventEmitter();
	// onLoading is emitted when the address service is first called and cancelled
	@Output() onLoading: EventEmitter<any> = new EventEmitter();

	// Array of Addresses	
	addList: any = [];
	// RxJs Stream of updated addresses triggered from ngOnChanges
	addressToValidate: Subject<any> = new Subject;

	constructor(
		private _analytics: Analytics,
		private _el: ElementRef,
		private _geoService: ReferenceService,
		private _notificationService: NotificationService
	) {

		this.addressToValidate
			.debounce((x) => { return Observable.timer(500); })
			.distinctUntilChanged()
			.do(next => { this.onLoading.next(true); })
			.switchMap(address => this._geoService.checkAddress(address))
			.subscribe((next: any) => {
				this.onReadyValid.next(true);
				this.addList = next.json().lookups;
				this.addList[this.addList.length - 1].isEcho = true;
				console.log(this.addList);
				this.onValid.next(null);
			}, (err) => {
				this._notificationService.createError('Could not connect.');
			});
	}

	/* istanbul ignore next */
	ngOnChanges(_) {
		// Send the address string to the addressToValidate stream
		if (_.data && isPresent(_.data.currentValue)) {
			this.addressToValidate.next(this.data);
		}
		// On Input Update - Open the Address List
		if (_.isVisible && _.isVisible.currentValue === true) {
			this.openAddresses();
		}
	}

	scrollToAddress() {
		let sequence = [
			{
				e: this._el.nativeElement.querySelector('.o-slot-container'),
				p: 'scroll',
				o: { duration: 300, easing: 'easeInOut', offset: 150 }
			}
		];
		setTimeout(() => {
			Velocity.RunSequence(sequence);
		}, 0);
	}

	/**
	 * 	Open Address List & Trigger Animations
	 */
	openAddresses = () => {
		let items = this._el.nativeElement.querySelectorAll('.o-slot, article');
		let sequence = [
			{
				e: this._el.nativeElement.querySelector('.o-slot-container'),
				p: 'scroll',
				o: { duration: 600, easing: 'easeInOut', offset: -250 }
			},
			{
				e: items,
				p: 'transition.bounceIn',
				o: { sequenceQueue: false, stagger: 100, duration: 1500 }
			}

		];
		// Set this to run after template has been updated
		setTimeout(() => {
			Velocity.RunSequence(sequence);
		}, 0);
	}


	/**
	 *  TODO: Animate Adddresses Appearing
	 *  TODO: Select Adddress & Emit Valid Addresses
	 *  TODO: Show Selected Address & Reset on Address Change
	 */
	setAddress(address: any) {
		// If No Address Listed Fire a No Address Found Event for Analytics		
		this._geoService.selectAddress(address.id).subscribe((next) => {
			if (address.address === 'My address is not listed') {
				this._analytics.triggerEvent('validateAddress', 'noAddress');
			} else {
				this._analytics.triggerEvent('validateAddress', 'selectAddress');
			}
			this.onValid.next(next.json());
		}, (err) => {
			this._notificationService.createError('Could not connect.');
			this._analytics.triggerErrorEvent({ service: 'ReferenceService', error: 'Problem Selecting Address' });
		});
	}
}
