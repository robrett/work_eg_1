import {
	Component,
	EventEmitter,
	ElementRef,
	OnInit,
	Input,
	Output,
	forwardRef,
	AfterViewInit,
} from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { AutoCompleteService } from './../../../services/autocomplete.service';
import { Observable, Subject } from 'rxjs/Rx';
let template = require('./auto_complete.html');

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const AUTOCOMPLETE_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => AutoCompleteComponent),
	multi: true
};


export class AutocompleteChangeEvent {
	value: any;
}

/**
 *  Autocomplete Component
 *
 *  Creates an autocomplete input field
 *  @input {Object} data
 *  @input {ControlGroup} form
 *  @input {String} filterBy
 *  @input {String} placeholder
 *  @input {Control} FormControl
 *
 *  @host (blur) onBlur($Event)
 *  @host [class.isOpen] isSearchResultsVisible
 *  
 *
 */

const noop = () => { };

@Component({
	providers: [AUTOCOMPLETE_VALUE_ACCESSOR],
	selector: 'c-auto-complete',
	template: template,
})
export class AutoCompleteComponent implements OnInit, ControlValueAccessor, AfterViewInit {

	@Input('data') _dataSrc: string;
	@Input('disabled') disabled: boolean;
	@Input('filterBy') _filterBy: string;

	@Input('form') form: FormGroup;
	@Input('id') id: string;
	@Input('placeholder') placeholder: string;

	@Output('onLoading') onLoading: EventEmitter<any> = new EventEmitter<any>();
	@Output('onLoading') onCompleteLoading: EventEmitter<any> = new EventEmitter<any>();

	@Input('control') public control: FormControl;
	public active: boolean = true;
	public filter: any;
	public isSearchResultsVisible: boolean = false;
	public options: any[] = [];
	public inputValue: FormControl = new FormControl("");

	private input: Subject<any> = new Subject();
	private loadingBarActive: string = 'inactive';
	private _data: Observable<Array<any>>;

	private _isInitialized: boolean = false;

	private _value: any = '';
	private _onTouchedCallback: () => void = noop;
	private _onChangeCallback: (_: any) => void = noop;


	get value() {
		return this._value;
	}


	set value(newValue: any) {

		if (this._value !== newValue) {
			// Workaround to allow reset
			if (newValue === '') {
				this.reset(this.inputValue);
				return;
			}
			// Set this before proceeding to ensure no circular loop occurs with selection.
			this._value = newValue;
			if (this.value.description) {
				this.inputValue.updateValue(this.value.description);
			} else {
				this.inputValue.updateValue(this.value);
			}

			this.inputValue.markAsTouched();
			this.disabled = true;
			this._onChangeCallback(this.value);
		}
	}


	constructor(
		private _el: ElementRef,
		private _autoCompleteService: AutoCompleteService
	) {

		this.filter = { 'description': '*' };
	}


	reset(ctrl) {
		let control: any = ctrl;
		this._value = '';

		control._touched = false;
		control._untouched = true;
		control._pristine = true;
		control._dirty = false;
		this.disabled = false;
		control.updateValue('');
		control.updateValueAndValidity();
	}

	onBlur() {
		this._onTouchedCallback();
	}

	ngAfterViewInit() {
		this._isInitialized = true;

		if (this._filterBy) {
			this.form.controls[this._filterBy].valueChanges.subscribe((val) => {
				if (this.form.controls[this._filterBy].value === '' && this.value !== '') {
					// Ignore the Analytics from this event as its already captured in the form component
					this.reset(this.inputValue);
					this.reset(this.form.controls[this.id]);
					this._autoCompleteService.reset();
				}
			});
		}
	}

	handleChange(event: Event) {
		let iValue = (<HTMLInputElement>event.target).value;
		this.input.next(iValue);
	}

	ngOnInit() {
		this._autoCompleteService.search(this._dataSrc, this.input);

		this._autoCompleteService.searching.subscribe((next) => {
			if (!next) {
				this.onLoading.next(next);
			}

		});

		this._autoCompleteService[this._dataSrc].subscribe(next => {
			// Generate a list of options from the retrieved data
			this.options =
				_.map(next, (e: any) => {
					return { id: e.id, description: e.description, filter: e.items };
				});
		});

		this.input.subscribe((next) => {
			this.isSearchResultsVisible = true;
			this.onLoading.next(true);
			this.filter = { 'description': next };
		});
	}



	select(event: any, option: any) {
		this.value = option;
		this.input.next(option.description);
		this._autoCompleteService.setFilter(this._dataSrc);
		this.isSearchResultsVisible = false;
		this._onTouchedCallback();

	}


	writeValue(value: any) {
		this.value = value;
	}

	registerOnChange(fn: any) {
		this._onChangeCallback = fn;
	}

	registerOnTouched(fn: any) {
		this._onTouchedCallback = fn;
	}


}
