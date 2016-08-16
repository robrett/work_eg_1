import { Component, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {UIStore, DataStore} from './../../../stores/stores.modules';
import {Utils} from './../../../shared/utilities/utilities.component';
import {Subject, Observable} from 'rxjs/Rx';
import {PaymentService} from './../../../services/index';
import { isPresent } from '@angular/platform-browser/src/facade/lang';

let template = require('./iban_form.html');

@Component({
	selector: 'm-iban-form',
	template: template,
})

export class IbanForm {
	@Output('onValidationInit') onValidationInit: EventEmitter<any> = new EventEmitter();
	@Output('onValidationSuccess') onValidationSuccess: EventEmitter<any> = new EventEmitter();
	@Output('onPaymentTypeChange') onPaymentTypeChange: EventEmitter<any> = new EventEmitter();
	data: any;
	update: any;
	fields: JourneyField;
	ctrls: any = {};
	form: FormGroup;
	isAccountValidated: boolean = false;
	accountValidationStatus: boolean = false;
	accountToValidate: Subject<any> = new Subject();

	constructor(
		private _paymentService: PaymentService,
		private _fb: FormBuilder,
		private _uiStore: UIStore,
		private _dataStore: DataStore
	) {
		this.data = this.data = this._dataStore.get(['paymentMethods', 'iban']);
		this.isAccountValidated = false;
		this.accountValidationStatus = false;

		this.accountToValidate
			.do((x) => { this.onValidationInit.next(false); })
			.debounce((x) => { return Observable.timer(500); })
			.filter((x) => { return this.form.valid; })
			.do((x) => { this.onValidationInit.next(true); })
			.switchMap((x) => this._paymentService.validateBankDetails(x))
			.subscribe((next) => {
				let acc: any = next.json();
				this.isAccountValidated = true;
				if (isPresent(acc.valid) && acc.valid === 'true') {
					this.accountValidationStatus = true;
					this.onValidationSuccess.next(acc);
					this._dataStore.update(['paymentMethods', 'iban', 'values'], this.form.value);
				} else {
					this._dataStore.remove(['paymentMethods', 'iban', 'values']);
					this.onValidationSuccess.next(false);
					this.accountValidationStatus = false;
				}
			});
		this.init();
	}

	init() {
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
		this.form['name'] = 'Iban Form';
		this.form.valueChanges.subscribe(this.accountToValidate);
	}


}
