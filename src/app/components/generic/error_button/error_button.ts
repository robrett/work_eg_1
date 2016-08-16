import { Component, Host, OnInit, Input, Optional, EventEmitter } from '@angular/core';
import { NgFormModel, ControlGroup } from '@angular/common';
import {ErrorService} from './../../../services/error.service';

/**
 *  Error Button
 *
 *  Error button for forms that aggregates all the error messages from
 *  the controls in the form, and displays them inside a button
 *
 *  @selector c-error-button
 *
 *  @input {ControlGroup} form - The Form Model
 *  @output {Event} onContinue - Event triggered on clicking the button
 *
 *  ### Example
 *  ````html
 *  <form [ngFormModel]="form" #f="ngForm" autocomplete="off"></form>
 *  <c-error-button [form]="form" (onContinue)="doStuff()"></c-error-button>
 *  ````
 *
 */


@Component({
	selector: 'c-error-button',
	inputs: ['form','short'],
	outputs: ['onContinue'],
	template: require('./error_button.html')
})

export class ErrorButtonComponent implements OnInit {
	@Input('text') text: string;
	onContinue: EventEmitter<any> = new EventEmitter();
	form: ControlGroup;
	controls: any;
	constructor(
		private _errorService: ErrorService,
		@Optional() @Host() formDir: NgFormModel
	) {

	}

	ngOnInit() {
		this.controls = this.form.controls;
		this.text = this.text ? this.text : 'Continue';
	}

	/**
	 *  errorMessage()
	 *  Loops through the Form Controls looking for any error, then calls _errorMessage()
	 *  with the Error Code and the Form Control to get the error message to display
	 *  on the button
	 *
	 *  @returns {string} The first error message found that is matched in _errorMessage()
	 *
	 */

	get errorMessage(): ErrorMessage {
		let errArr = [];
		for (let control in this.form.controls) {
			if (this.form.controls[control].touched && !this.form.controls[control].valid) {
				errArr.push(this.form.controls[control]);
			}
		}
		if (errArr.length > 0) {
			let errCtrl = errArr[0];
			return this._errorService.retrieveButtonError(Object.keys(errCtrl.errors)[0], errCtrl)
		}
		return null;
	}

	/**
	 *  _errorMessage
	 *
	 *  @param {string} code - The Error message found in the errors of the validation property of the form
	 *  @param {ControlGroup} control - The Form Control with the Error
	 *  @returns {string} - The error message
	 */

	_errorMessage(code: string): string {
		// Talk to Error Service
		let config = {
			'required': { message: 'You must complete all fields', image: '' },
			'underage': { message: 'This user is too young', image: '' },
			'overage': { message: `This user is too old`, image: '' },
			'invalidDOB': { message: 'Please enter a valid date', image: '' },
			'invalidPassword': { message: 'Sorry, these details were incorrect, please try again.', image: '' },
			'invalidEmail': { message: 'Please enter a valid email address', image: '' }
		};
		if (config[code]) {
			return config[code];
		} else {
			return null;
		}
	}

	/**
	 *  emitContinue()
	 *
	 *  Emits Continue Event on Button Click
	 *
	 */

	emitContinue() {
		this.onContinue.next(true);
	}
}
