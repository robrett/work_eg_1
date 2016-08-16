import {
	isBlank,
} from '@angular/platform-browser/src/facade/lang';

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'pricefrequency'
})
export class PriceFrequencyPipe implements PipeTransform {
	transform(value: any, args: any = null): any {

		if (isBlank(args) || args.length === 0 || value === "") {
			console.log('filter pipe requires one argument');
			return null;
		}
		return value[args].pretty;
	}
}
