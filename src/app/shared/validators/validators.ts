import { isPresent, isString } from '@angular/platform-browser/src/facade/lang';
import * as moment from 'moment';
import * as iban from 'iban';

export class CustomValidators {
	static namingRestrictions(c): { [key: string]: boolean } {
		let re = /^[a-zA-Z-'\s]+$/;
		if (isPresent(c.value) && c.value.match(re)) {
			return null;
		} else {
			return {
				'invalidSpecial': true
			};
		}
	}
	static checkIban(c): { [key: string]: boolean } {
		if (isPresent(c.value) && iban.isValid(c.value)) {
			return null;
		} else {
			return {
				'invalidIBAN': true
			};
		}

	}
	static noSpecialCharacters(c): { [key: string]: boolean } {
		let re = /^\w+$/;
		if (isPresent(c.value) && c.value.match(re)) {
			return null;
		} else {
			return {
				'invalidSpecial': true
			};
		}
	}
	static checkBic(c): { [key: string]: boolean } {
		let re = /^[a-z]{6}[2-9a-z][0-9a-np-z]([a-z0-9]{3}|x{3})?$/i;
		if (isPresent(c.value) && c.value.match(re)) {
			return null;
		} else {
			return {
				'invalidBIC': true
			};
		}
	}
	static onlyMonth(c): { [key: string]: boolean } {
		let re = /^(0?[1-9]|1[012])$/;
		if (isPresent(c.value) && c.value.match(re)) {
			return null;
		} else {
			return {
				'invalidOnlyMonths': true
			};
		}
	}
	static onlyDays(c): { [key: string]: boolean } {
		let re = /(0[1-9]|[12]\d|3[01])/;
		if (isPresent(c.value) && c.value.match(re)) {
			return null;
		} else {
			return {
				'invalidOnlyDays': true
			};
		}
	}

	static phoneNumber(c): { [key: string]: boolean } {
		let re = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm;
		if (isPresent(c.value) && isString(c.value) && c.value.match(re)) {
			return null;
		} else {
			return {
				'invalidPhoneNumber': true
			};
		}
	}

	static notLetters(c): { [key: string]: boolean } {
		let re = /[^a-zA-Z\s:]+/;
		if (isPresent(c.value) && isString(c.value) && c.value.match(re)) {
			return null;
		} else {
			return {
				'invalidOnlyNumber': true
			};
		}
	}
	static sortCode(c): { [key: string]: boolean } {
		let re = /^(?!(?:0{6}|00-00-00))(?:\d{6}|\d\d-\d\d-\d\d)$/;
		if (isPresent(c.value) && c.value.match(re)) {
			return null;
		} else {
			return {
				'invalidSortCode': true
			};
		}
	}
	static ccv(c): { [key: string]: boolean } {
		let re = /\b[0-9]{3,4}\b/;
		if (isPresent(c.value) && isString(c.value) && c.value.match(re)) {
			return null;
		} else {
			return {
				'invalidCCV': true
			};
		}
	}
	static onlyNumbers(c): { [key: string]: boolean } {
		let re = /^[0-9]*$/;
		if (isPresent(c.value) && isString(c.value) && c.value.match(re)) {
			return null;
		} else {
			return {
				'invalidOnlyNumber': true
			};
		}
	}

	static invalidPassword(c): { [key: string]: boolean } {
		if (isPresent(c.value) && isPresent(c.invalidPassword) && c.invalidPassword === true) {
			return {
				'invalidPassword': true
			};
		} else {
			return null;
		}
	}

	static emailValidator(c): { [key: string]: boolean } {
		let re = /.+@.+\..+/i;
		if (isPresent(c.value) && isString(c.value) && c.value.match(re)) {
			return null;
		} else {
			return {
				'invalidEmail': true
			};
		}
	}

	static validDate(c): { [key: string]: boolean } {
		if (isPresent(c.value) && c.value.length === 10 && moment(c.value, 'DD/MM/YYYY').isValid()) {
			return null;
		} else {
			return { 'invalidDOB': true };
		}

	}
	static ageRequirements(c): { [key: string]: boolean } {
		let parent = c._parent;
		if (isPresent(parent)) {
			if (isPresent(c.value) && c.value.length === 10 && moment(c.value, 'DD/MM/YYYY').isValid()) {
				let age = moment().diff(moment(c.value, 'DD/MM/YYYY'), 'years');
				if (moment(c.value, 'DD/MM/YYYY').isAfter(moment())) {
					return { 'invalidDOB': true };
				}
				if (age < parent.defaults.minAge) {
					return { 'underage': true };
				} else if (age > parent.defaults.maxAge) {

					return { 'overage': true };
				} else if (age >= parent.defaults.minAge && age <= parent.defaults.maxAge) {
					return null;
				}
			} else {
				return {
					'invalidDOB': true
				};
			}
		}
	}

	static minAccount(c): { [key: string]: boolean } {
		if (isPresent(c.value) && c.value.length === 8) {
			return null;
		} else {
			return { 'invalidAccount': true };
		}

	}

	static invalidAccount(c): { [key: string]: boolean } {
		if (isPresent(c.accountInvalid) && c.accountInvalid === true) {
			return { 'invalidAccount': true };
		}
		return null;
	}

	static invalidPasswordConf(c): { [key: string]: boolean } {
		if (isPresent(c.invalidPasswordConf) && c.invalidPasswordConf === true) {
			return { 'invalidPasswordConf': true };
		}
		return null;
	}
	static autoCompleteExists(control: any): any {
		if (control.default && control.value.description !== control.default) {
			return { 'invalidChoice': true };
		} else if (!control.default) {
			return { 'required': true };
		} else {
			return null;
		}
	}
}
