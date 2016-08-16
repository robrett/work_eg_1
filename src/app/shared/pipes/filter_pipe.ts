import {isBlank} from '@angular/platform-browser/src/facade/lang';

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'filter'
})
export class FilterPipe implements PipeTransform {
	transform(value: any, args: any = null): any {
		if (isBlank(args) || args.length === 0 || value === "") {
			console.log('filter pipe requires one argument');
			return null;
		}

		let key: any = Object.keys(args);

		if (args[key] === '*') {
			return value;
		}

		let regex = new RegExp('(.*?)' + args[key].replace(/[.*+?^${}()|[\]\\]/g, "").split(' ').join('(.*?)'), 'i');

		return _.filter(value, (obj) => {
			let k: any = Object.keys(args);
			let v = obj[k];
			return regex.test(v);
		});

	}
}
