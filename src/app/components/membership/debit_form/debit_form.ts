import { Component, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {UIStore, DataStore} from './../../../stores/stores.modules';
import {Utils} from './../../../shared/utilities/utilities.component';
import {Subject, Observable} from 'rxjs/Rx';
import {PaymentService} from './../../../services/index';
import { isPresent } from '@angular/platform-browser/src/facade/lang';

let template = require('./debit_form.html');


@Component({
	selector: 'm-debit-form',
	template: template,
})

export class DebitForm {
	@Output('onValidationInit') onValidationInit: EventEmitter<any> = new EventEmitter();
	@Output('onValidationSuccess') onValidationSuccess: EventEmitter<any> = new EventEmitter();
	@Output('onPaymentTypeChange') onPaymentTypeChange: EventEmitter<any> = new EventEmitter();
	data: any;
	update: any;
	fields: JourneyField;
	ctrls: any = {};
	form: FormGroup;
	isUpdating: boolean = false;
	isAccountValidated: boolean = false;
	accountValidationStatus: boolean = false;
	accountToValidate: Subject<any> = new Subject();
	sub: ISubscriptionDefinition<any>;

	constructor(
		private _paymentService: PaymentService,
		private _fb: FormBuilder,
		private _uiStore: UIStore,
		private _dataStore: DataStore
	) {

		this.isAccountValidated = false;
		this.accountValidationStatus = false;
		this.accountToValidate
			.do((x) => { this.onValidationInit.next(false); })
			.debounce((x) => { return Observable.timer(500); })
			.filter((x) => { return this.form.valid && !this.isUpdating; })
			.do((x) => { this.onValidationInit.next(true); })
			.switchMap((x) => this._paymentService.validateBankDetails(x))
			.subscribe((next) => {
				let acc: any = next.json();
				this.isAccountValidated = true;
				if (isPresent(acc.valid) && acc.valid === 'true') {
					this.onValidationSuccess.next(acc);
					this._dataStore.update(['paymentMethods', 'debit', 'values'], this.form.value);
					this.accountValidationStatus = true;
				} else {
					this._dataStore.remove(['paymentMethods', 'debit', 'values']);
					this.onValidationSuccess.next(false);
					this.accountValidationStatus = false;
				}
			});

		this.data = this._dataStore.get(['paymentMethods', 'debit']);
		console.log(this._dataStore.get(['paymentMethods']))
		console.log(this.data);
		this.fields = this.data.fields;
		_.forEach(this.data.fields, (e: any) => {
			let valids = Utils.retrieveValidator(e.validation);
			this.ctrls[e.name] = [
				isPresent(this.data.values) ? this.data.values[e.name] : '',
				isPresent(e.validation) ? Validators.compose(valids) : null
			];
		});
		if (this.ctrls['accountName'][0] === '') {
			this.ctrls['accountName'][0] = this._dataStore.get(['utils', 'userName']);
		}
		this.form = this._fb.group(this.ctrls);
		this.form['name'] = 'Direct Debit Form';
		this.form.valueChanges.subscribe(this.accountToValidate);
	}

}
