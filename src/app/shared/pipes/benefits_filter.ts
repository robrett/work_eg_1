import {
	isBlank,
	isString,
	isNumber,
	isArray
} from '@angular/platform-browser/src/facade/lang';

let BENEFITS_LIST = [];
BENEFITS_LIST[`ROADSIDERESCUE`] = true;
BENEFITS_LIST[`24-7EMERGENCYCOVER`] = true;
BENEFITS_LIST[`ANYVEHICLECOVER`] = true;
BENEFITS_LIST[`UKCOVER`] = true;
BENEFITS_LIST[`FUELSAVERCARD`] = true;
BENEFITS_LIST[`AAREWARDS`] = true;
BENEFITS_LIST[`DOORSTEPCOVER`] = true;
BENEFITS_LIST[`CARHIRE`] = true;
BENEFITS_LIST[`ACCOMMODATION`] = true;
BENEFITS_LIST[`TRAVELEXPENSES`] = true;

import {Pipe} from '@angular/core';

@Pipe({
	name: 'benefitsFilter'
})
export class BenefitsFilter {
	transform(value: JourneyBenefit[], args: any): any {
		if (isBlank(value) || value.length === 0) {
			return null;
		}
		return _.filter(value, (e: JourneyBenefit) => {
			return BENEFITS_LIST[e.code];
		});
	}
}
