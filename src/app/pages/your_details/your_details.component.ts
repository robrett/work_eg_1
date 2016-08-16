import { Component, OnDestroy, ElementRef, EventEmitter, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { isPresent, isBlank } from '@angular/platform-browser/src/facade/lang';

import { DataStore, UIStore } from './../../stores/stores.modules';
import { Observable } from 'rxjs/Observable';
import { Utils } from './../../shared/utilities/utilities.component';
// import {CanComponentDeactivate, CanDeactivateGuard} from './../../../common/canDeactivateGuard';
import { CanDeactivate } from '@angular/router';
import { CONSTS } from './../../constants';
import { NotificationService, QuoteService } from './../../services/index';
let template = require('./your_details.html');

/**
 *  Your Details Page Component
 */

@Component({
	selector: 'p-your-details',
	template: template
})
export class MembershipYourDetailsPageComponent implements OnInit, AfterViewInit, CanDeactivate<boolean>, OnDestroy {
	// Default Settings for Your Details Page
	page: UIPage;
	primaryAdultUser: MemberType;
	fields: JourneyField[];
	// Ctrls generated with Validator and Values from the Fields Array
	ctrls: any = {};
	userDetailsForm: FormGroup;

	address: any;
	validatedAddress: any;
	// Boolean for checking whether thet address is validated
	isValidated: boolean = false;
	// Boolean for show/hide button based on whether all address controls are valid
	isReadyToValidate: boolean = false;
	isReadyLoading: boolean = false;
	isAddressListVisible: boolean = false;
	validateAddressText: string = 'Validate Address';
	// Detect Attempt to Navigate Forward
	isNavigatingNext: boolean = false;
	isFieldsWarningVisible: boolean = false;
	isUpdatingMultipleAddressFields = false;

	sub: ISubscriptionDefinition<any>;

	constructor(
		private _uiStore: UIStore,
		private _el: ElementRef,
		private _dataStore: DataStore,
		private _formBuilder: FormBuilder,
		private _notifications: NotificationService,
		private _quote: QuoteService
	) {
		this.page = this._uiStore.getPage('yourDetails');
		this.primaryAdultUser = this._dataStore.getGeneratedMember('adults', 0);
		this.sub = this._dataStore.subscribe(CONSTS.LOGIN_UPDATE, this.onUserUpdate);
	}


	ngOnInit() {
		this.fields = this.primaryAdultUser.fields;
		_.forEach(this.fields, (e: JourneyField) => {
			let valids = Utils.retrieveValidator(e.validation);
			this.ctrls[e.name] = [
				isPresent(this.primaryAdultUser.values) ? this.primaryAdultUser.values[e.name] : '',
				isPresent(valids) && valids.length > 0 ? Validators.compose(valids) : null
			];
		});
		this.userDetailsForm = this._formBuilder.group(this.ctrls);
		this.userDetailsForm['name'] = 'Your Details Form';


		// Adds in Journey Schema details into the form control, to let
		// the age requirements validation have values to work with
		this.userDetailsForm['defaults'] = this.primaryAdultUser;


		this.validatedAddress = this._uiStore.get(['pages', 'yourDetails', 'options', 'validAddress']);
		this.isAddressReady();

	}

	ngAfterViewInit() {
		this.userDetailsForm.controls['addressLine1'].valueChanges.subscribe(e => {
			this.isAddressReady();

		});
		this.userDetailsForm.controls['addressLine2'].valueChanges.subscribe(e => {
			this.isAddressReady();
		});
		this.userDetailsForm.controls['area'].valueChanges.subscribe(e => {
			this.isAddressReady();

		});
		this.userDetailsForm.controls['county'].valueChanges.subscribe(e => {
			this.isAddressReady();
		});
	}

	/**
	 *  Method to determine if the address is ready to be validated and toggle
	 *  isAddressReady boolean, as well as set the address variable to be passed
	 *  to the reference service
	 */
	isAddressReady() {
		// Ignore If Updating Multiple Address Fields at once
		if (this.isUpdatingMultipleAddressFields) {
			return true;
		}
		// Check the address Line1 and Area against previous Address
		if (this.validatedAddress) {
			if (_.isEqual(this.userDetailsForm.controls['addressLine1'].value, this.validatedAddress.addressLine1) &&
				_.isEqual(this.userDetailsForm.controls['area'].value.description, this.validatedAddress.area)) {
				this.isValidated = true;
				return;
			}
		}

		// Check All Addressses are valid
		if (this.userDetailsForm.controls['addressLine1'].valid &&
			this.userDetailsForm.controls['addressLine2'].valid &&
			this.userDetailsForm.controls['area'].valid &&
			this.userDetailsForm.controls['county'].valid
		) {
			this.isValidated = false;
			this.address = {
				addressLine1: this.userDetailsForm.controls['addressLine1'].value,
				addressLine2: this.userDetailsForm.controls['addressLine2'].value,
				area: this.userDetailsForm.controls['area'].value,
				county: this.userDetailsForm.controls['county'].value
			};
			this.isReadyToValidate = false;
			this.isReadyLoading = false;
			this.validateAddressText = `Validate your Address`;


		} else {
			this.isReadyLoading = false;
			this.isReadyToValidate = false;
			this.isValidated = false;
		}
	}

	/**
	 *  Called from the Address list object onLoading event
	 * 		- Sets the Form not ready to validate to prevent navigation
	 * 		- Shows the Address List and sets its text to Searching for Address
	 */
	onLoadingAddress() {
		this.isReadyToValidate = false;
		this.isAddressListVisible = false;
		this.isReadyLoading = true;
		this.validateAddressText = 'Searching For Address';
	}
	/**
	 *  Called from the Address list object onReady event
	 * 		- Sets the Form as Ready to Validate
	 * 		- Sets the Address List text to Validate Your Address
	 */
	onReadyAddress() {
		this.isReadyToValidate = true;
		this.validateAddressText = 'Validate your Address';
	}

	/**
	 *  If form is set to readyToValidate
	 * 		- Opens the address list with AddressListVsisible to true
	 * 		- Sets the Address List text to Validate Your Address
	 */
	openValidateAddress() {
		if (this.isReadyToValidate) {
			this.isAddressListVisible = true;
			this.validateAddressText = 'Choose an address from the choices below';
		}

	}

	setValidatedAddress(obj) {
		if (obj !== null) {
			// The isReadyAddress() function checks multiple fields to check whether user has made changes
			// to previous fields, the itUpdatingMultipleAddressFields flag is to block it triggering on
			// the multiple fields being updated from setValidatedAddress
			this.isUpdatingMultipleAddressFields = true;

			this.validatedAddress = obj;
			// Stores the Validated Address in the UIStore in case of page change
			this._uiStore.update(['pages', 'yourDetails', 'options', 'validAddress'], this.validatedAddress);


			let addressLine1: any = this.userDetailsForm.controls['addressLine1'];
			let addressLine2: any = this.userDetailsForm.controls['addressLine2'];
			let area: any = this.userDetailsForm.controls['area'];
			let county: any = this.userDetailsForm.controls['county'];

			addressLine1.updateValue(obj.addressLine1);
			addressLine1.markAsTouched();
			addressLine2.updateValue(obj.addressLine2);
			addressLine2.markAsTouched();
			area.updateValue({ description: obj.area });
			area.markAsTouched();
			county.updateValue({ description: obj.county });

			this.isUpdatingMultipleAddressFields = false;
			county.markAsTouched();

			this.isAddressListVisible = false;
			// Update the 
			this.validateAddressText = obj.selected.address;
			this.isValidated = true;
		} else {
			this.isValidated = false;
		}

	}

	onUserUpdate = (user) => {
		let sessionUser = this._dataStore.constructUserObjFromSession('adults', 0);
		if (sessionUser) {
			_.forIn(sessionUser, (e, k) => {
				if (this.userDetailsForm.controls[k]) {
					let control: any = this.userDetailsForm.controls[k];
					control.updateValue(e);
					control.markAsTouched();
				}
			});
		}
	}

	submitForm() {
		let member = _.clone(this.userDetailsForm.value);

		// TODO: REFACTOR Update Quote PROCESS
		this._quote.updateProposal({
			email: this.userDetailsForm.value.email,
			firstName: this.userDetailsForm.value.firstName,
			surname: this.userDetailsForm.value.surname,
			title: this.userDetailsForm.value.title,
			dateOfBirth: this.userDetailsForm.value.dateOfBirth,
			phoneNumber: this.userDetailsForm.value.phoneNumber
		}).subscribe((next) => {
			// TODO: REFACTOR RENEWAL PROCESS
			if (next.text() !== '' && next.json().renewal) {
				this._notifications.createNotification
					(`<a href="http://www.theaa.ie/">Are you a current AA Member looking to renew? 
					Click here to go to the renewals page.</a>`);
			};
		});

		_.assign(member,
			{
				price: this.primaryAdultUser.price,
				typeDisplay: this.primaryAdultUser.typeDisplay,
				type: this.primaryAdultUser.type,
				index: 0
			});
		this._dataStore.update(['config', 'members', 'adults', 0], member, CONSTS.MEMBER_UPDATE);

	}

	navigateNext(e: Event) {
		this.isNavigatingNext = true;

		if (this.isReadyToValidate && !this.isValidated) {
			let button = this._el.nativeElement.querySelector('#validateAddBtn');
			// Velocity(button, 'callout.shake');
			if (this.validateAddressText === 'Please click here to validate your address') {
				this.validateAddressText = 'You must validate your address to contiunue';
			} else {
				this.validateAddressText = 'Please click here to validate your address';
			}
		}
		if (!this.userDetailsForm.valid) {
			for (let control in this.userDetailsForm.controls) {
				if (this.userDetailsForm.controls[control]) {
					this.userDetailsForm.controls[control].markAsTouched();
					this.userDetailsForm.controls[control].markAsDirty();
				}
			}
		} else {
			//this.submitForm();
		}
	}


	canDeactivate(): boolean | Observable<any> {
		this._notifications.clearNotifications();
		if (!this.isNavigatingNext) {
			return true;
		}
		if (this.isNavigatingNext && this.userDetailsForm.valid && this.isValidated) {
			this.submitForm();
			return true;
		} else if (this.isNavigatingNext && !this.userDetailsForm.valid) {
			this.isNavigatingNext = false;
			return false;
		} else {
			return false;
		}

	}

	ngOnDestroy() {
		this._dataStore.unsubscribe(this.sub);
	}


}
