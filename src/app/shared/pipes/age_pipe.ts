import {
	isBlank,
	isString,
	isNumber,
	isArray
} from '@angular/platform-browser/src/facade/lang';
import { BaseException, WrappedException } from '@angular/platform-browser/src/facade/exceptions';

import { Pipe } from '@angular/core';
import * as moment from 'moment';


@Pipe({
	name: 'age'
})

export class AgePipe {
	transform(value: any, args: any = null): any {

		if (isBlank(value) || value === '') {
			return null;
		}

		if (!moment(value, 'DD/MM/YYYY').isValid()) {
			throw new BaseException('Not a valid date');
		}

		let years = moment(value, 'DD/MM/YYYY');

		return moment().diff(years, 'years');
	}
}

