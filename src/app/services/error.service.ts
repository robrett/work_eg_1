import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {
	constructor() {}

	/**
	 * 	The Error messages available for the Error Page
	 * 	If there is no error messaging code it will return the default error message
	 * 	@param string code - Error Code
	 * 	@return ErrorMessage
	 */
	retrieveServiceError(code?: string): ErrorMessage {
		let message = {
			'default': { message: 'Sorry, an error has occured' },
			'quoteRejection': {
				message: `Unfortunately based on the information that you've provided, 
				we are unable to provide you with a quote for AA Membership at this time<br><br>
				If you would like to ring us to discuss this further please call <strong>0818 227 228</strong>`
			}
		};

		if (message[code]) {
			return message[code];
		} else {
			return message['default'];
		}
	}

	/**
	 * 	The Error messages available for the Error Button
	 * 	If there is no error messaging code it will return the default error message
	 * 	@param string code - Error Code
	 * 	@param string label - Form Field Label
	 * 	@return ErrorMessage
	 */
	retrieveButtonError(code?: string, label?: string): ErrorMessage {
		let message = {
			'required': { message: 'You must complete all fields', image: '' },
			'underage': { message: 'This user is too young', image: '' },
			'overage': { message: `This user is too old`, image: '' },
			'invalidDOB': { message: 'Please enter a valid date', image: '' },
			'invalidPassword': { message: 'Sorry, these details were incorrect, please try again.', image: '' },
			'invalidEmail': { message: 'Please enter a valid email address', image: '' }
		};
		if (message[code]) {
			return message[code];
		} else {
			return null;
		}
	}

	/**
	 * 	The Error messages available for the Form Input Fields
	 * 	@param string code - Error Code
	 * 	@param string label - Form Field Label
	 * 	@return ErrorMessage
	 */
	retrieveFieldError(code: string, label?: string): ErrorMessage {
		let message = {
			'invalidPasswordConf': { message: 'Please check your password to make sure it matches' },
			'invalidSpecial': { message: 'This field does not accept special characters' },
			'invalidOnlyMonths': { message: 'Please enter a valid month' },
			'invalidBIC': { message: 'Please enter a valid BIC' },
			'invalidIBAN': { message: 'Please enter a valid IBAN' },
			'invalidCCV': { message: 'Please enter a valid CCV' },
			'invalidSortCode': { message: 'Please enter a valid Sort Code' },
			'invalidOnlyNumber': { message: 'You can only enter numbers here' },
			'invalidEmail': { message: `Please enter a valid email address`, image: '' },
			'invalidPhoneNumber': { message: `Please enter a valid phone number `, image: '' },
			'invalidPassword': { message: 'Sorry, these details were incorrect, please try again.', image: '' },
			'required': { message: `${label} is required`, image: '' },
			'underage': { message: 'This user is too young', image: '' },
			'overage': { message: 'This user is too old', image: '' },
			'invalidChoice': { message: 'Is not a valid choice', image: '' },
			'invalidDOB': { message: `Please enter a valid date`, image: '' },
			'invalidAccount': { message: 'Please enter a valid account number' },
			'invalidCreditCard': { message: 'Please enter a valid credit card number', image: '' }
		};
		return message[code];
	}
}
