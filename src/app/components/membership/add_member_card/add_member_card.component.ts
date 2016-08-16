import { Component, OnInit, EventEmitter, Input,Output, HostBinding } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isPresent } from '@angular/platform-browser/src/facade/lang';
import { UIStore, DataStore } from './../../../stores/stores.modules';
import { CONSTS } from './../../../constants';
import { Utils } from './../../../shared/utilities/utilities.component';
import { Analytics } from './../../../services/analytics.service';


/**
 *  Add Member Card
 *
 *  Has Three States: Valid, Editing and Placeholder
 *  isPlaceholder - placeholder: true, valid: false
 *  isEditing - placeholder: false, valid: false
 *  isValid - placeholder: false, valid: true
 *
 *
 *  @selector m-add-member-card
 *  @input {MemberData} data - The details of the member for the card
 *
 *  ### Default Example
 *  ````
 *  <m-add-member-card *ngFor="let member of memberList" [data]="member"></m-add-member-card>
 *  ````
 *
 */

@Component({
	selector: 'm-add-member-card',
	template: require('./add_member_card.html'),
	host: {
		'[class.isValid]': 'state.valid',
		'[class.isEditing]': '!state.valid && !state.placeholder',
		'[class.isPlaceholder]': 'state.placeholder'
	},
})
export class AdditionalMemberCardComponent implements OnInit {

	private member: Member | any;
	private values: any;

	private state: any;
	private ctrls: any = {};

	private fields: JourneyField[] = [];
	private form: FormGroup;
	private pricingFrequency: string;

	@Input('data') data: MemberType;

	@Output() onSave: EventEmitter<any> = new EventEmitter();
	@Output() onDelete: EventEmitter<any> = new EventEmitter();
	@Output() onCancel: EventEmitter<any> = new EventEmitter();

	// @HostBinding('class.isValid') get ValidState() { return this.state.valid; };
	// @HostBinding('class.isEditing') get EditingState() { return !this.state.valid && !this.state.placeholder; };
	// @HostBinding('class.isValid') get PlaceholderSTate() { return this.state.placeholder; };

	constructor(
		private _analytics: Analytics,
		private _fb: FormBuilder,
		private _uiStore: UIStore,
		private _dataStore: DataStore
	) {
		this.state = {
			placeholder: false,
			valid: false
		};
		this._dataStore.subscribeAndGet(CONSTS.PRICING_UPDATE, () => {
			this.pricingFrequency = this._dataStore.get(['pricing', 'frequency']);
		});
	}

	/**
	 *  @angular OnInit
	 *
	 *  Sets Placeholder to true if the member doesn't have any preset values
	 *  Sets Valid to true if member has values
	 *  Creates form out of the fields set in the schema for that member
	 */
	ngOnInit() {
		this.state.placeholder = this.data.values ? false : true;
		this.state.valid = this.data.values ? true : false;
		this.values = this.data.values ? this.data.values : null;
		this.fields = this.data.fields;

		// Set to edit mode if the member is a placeholder member		
		if (this.data.placeholder) {
			this._analytics.triggerEvent('additionalMember', 'placeholder-editing', this.data.index);
			this.state.placeholder = false;
			this.state.valid = false;
		}

		_.forEach(this.fields, (e: any) => {
			this.ctrls[e.name] = [
				isPresent(this.data.values) ? this.data.values[e.name] : null,
				isPresent(e.validation) ? Validators.compose(Utils.retrieveValidator(e.validation)) : null,
				isPresent(e.validationAsync) ? Validators.composeAsync(e.validationAsync) : null
			];
		});

		this.form = this._fb.group(this.ctrls);
		this.form['name'] = `Add Member ${this.data.index} Form`;

		/**
		 *  Adds member specific defaults properties to the form, in order to allow
		 *  the Validators to use them
		 *
		 */
		this.form['defaults'] = this.data;
	}

	/**
	 *  Sets Placeholder to False, Valid to false if clicking
	 *  on an empty valued placeholder card, allowing it to be editable
	 *
	 */
	setEditable() {
		if (this.state.placeholder) {
			this.state.placeholder = false;
			this.state.valid = false;
		}
		this._analytics.triggerEvent('additionalMember', 'editing', this.data.index);
		this.state.valid = false;
	}


	/**
	 *  Emits an onDelete event to parent component
	 *
	 *  @fires onDelete
	 *
	 */
	deleteMember = (evt: Event) => {
		evt.stopPropagation();
		this._analytics.triggerEvent('additionalMember', 'deleted', this.data.index);
		this.onDelete.next(this.values);
	}

	/**
	 *  Cancel Member and reset placeholder to false
	 *  @fires onDelete
	 */
	cancelMember = (evt: Event) => {
		evt.stopPropagation();
		if (this.data.placeholder) {
			this.deleteMember(evt);
		} else {
			this.state.placeholder = true;
		}

	}
	/**
	 *  If the form is valid, create a new member and emit an onSave event up
	 *  to friends and family component to save it to the data store
	 *
	 *  @fires onSave
	 */
	saveMember() {
		if (this.form.valid) {
			this._analytics.triggerEvent('additionalMember', 'saved', this.data.index);
			this.member =
				_.assign(this.form.value,
					{
						price: this.data.price,
						typeDisplay: this.data.typeDisplay,
						type: this.data.type,
						index: this.data.index
					});
			this.onSave.next(this.member);
			this.values = this.member;
			this.state.valid = true;

		} else {
			this._analytics.triggerEvent('additionalMember', 'error-saving', this.data.index);
			for (let control in this.form.controls) {
				if (this.form.controls[control]) {
					this.form.controls[control].markAsTouched();
					this.form.controls[control].markAsDirty();
				}
			}
		}
	}
}
