import { Validators } from '@angular/common';
import { CustomValidators } from './../validators/validators';

export class Utils {

	static mapPrice(price: Price) {
		return {
			amount: price.amount / 100,
			str: price.str,
			symbol: price.symbol,
			currency: price.currency,
			pretty: price.pretty
		};
	}

	static isViewportMobile() {
		return window.matchMedia('(max-width: 480px)').matches;
	}
	static isViewportTablet() {
		return window.matchMedia('(max-width: 1023px)').matches;
	}
	static isViewportDesktop() {
		return window.matchMedia('(min-width: 1024px)').matches;
	}

	static isMaxHeight(height) {
		return window.matchMedia(`(max-height: ${height}px)`).matches;
	}

	static scrollToElement(el, complete?) {
		// Using Smoothscroll Polyfill
		el.scrollIntoView();
	}

	static resetCustomValidators(control) {
		control.invalidPassword = false;
		control.invalidPasswordConf = false;
	}

	static retrieveValidator(valid: string[]) {
		let arr = [];
		_.forEach(valid, (e) => {
			if (Validators[e]) {
				arr.push(Validators[e]);
			}
			if (CustomValidators[e]) {
				arr.push(CustomValidators[e]);
			}
		});
		return arr;
	}

	static distanceTopPage(elem) {
		let location = 0;
		if (elem.offsetParent) {
			do {
				location += elem.offsetTop;
				elem = elem.offsetParent;
			} while (elem);
		}
		return location >= 0 ? location : 0;
	}
}
