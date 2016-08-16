import {Component, Input, Output, ElementRef} from '@angular/core';
import {SHARED_MODULES} from './../../shared/shared_modules';
import {UIStore} from './../../../stores/ui_store';
import {isPresent} from '@angular/platform-browser/src/facade/lang';
import * as Velocity from 'velocity-animate';
import {MyAAService} from './../../../services/services_modules';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators } from '@angular/forms';

let template = require('./save_quote_button.html');

@Component({
	selector: 'button[m-save-quote]',
	template: template,
	directives: [SHARED_MODULES, REACTIVE_FORM_DIRECTIVES],
	host: {
		'[class.btn--grey]': 'disabled',
		'[class.btn--outline]': '!disabled',
		'[class.btn--dark]': '!disabled',
		'(click)': 'onClick($event)',
		'[disabled]': 'disabled'
	}
})
export class SaveQuoteButton {
	isAnimating: boolean = false;
	isError: boolean = false;
	@Input('disabled') disabled: boolean = false;

	constructor(
		private _uiStore: UIStore,
		private _myAA: MyAAService
	) {

	
	}
	
	onClick(evt: Event) {
		this._myAA.saveQuote().subscribe((next) => {
			this._uiStore.update(['UIOptions', 'isQuoteSaved'], true);
			this.disabled = true;
		}, (err) => {
			this.isError = true;
		});
		
	}
}
