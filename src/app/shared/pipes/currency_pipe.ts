import {
	isBlank,
	isString,
	isNumber,
	isArray
} from '@angular/platform-browser/src/facade/lang';

import {Pipe} from '@angular/core';

@Pipe({
	name: 'currency'
})

export class CurrencyPipe {

	transform(value: any, args: any = null): any {
		if (isBlank(value) || value === '') {
			return null;
		}


		let val;
		let digits = args.digits;
		let symbol = '€';

		let freeOptions = args.free;
		value = new Number(value);
		if (freeOptions && value === 0) {
			return 'FREE';
		}
		let sections = 3;
		let re = '\\d(?=(\\d{' + (sections || 3) + '})+' + (digits > 0 ? '\\.' : '$') + ')';
		return symbol + value.toFixed(Math.max(0, ~~digits)).replace(new RegExp(re, 'g'), '$&,');

	}
}
