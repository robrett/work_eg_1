import { Directive, Input, OnInit, ElementRef, Attribute, HostListener } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

/**
 *  Input Mask
 *
 *  Mostly Stolen from https://github.com/awerlang/angular-easy-masks
 *  Modified that the separators are included as the user types rather than after
 *
 *  @selector [mask]
 *
 *
 */

@Directive({
	selector: '[mask]',
})
export class InputMaskDirective {
	@Input('formControl') formControl: FormControl;
	mask: any;
	previousValue: string = '';
	constructor(
		public elRef: ElementRef, @Attribute('mask') mask: string) {
		this.mask = mask;
	}

	isCompleted = function (value) {
		let zeroes = this.mask.match(/0/g);
		let optionalsCount = zeroes ? zeroes.length : 0;
		return (this.mask.length - optionalsCount) <= value.length;
	};

	@HostListener('keydown', ['$event'])
	onKeyDown(event: any) {
		let keyIsBackspace = event.which === 8 || event.keyCode === 8;
		let value = this.elRef.nativeElement.value;
		let lastChar: string = value.slice(-1);
		if (keyIsBackspace) {
			event.preventDefault();
			this.updateValue(value.slice(0, -1));
		}
	}

	@HostListener('keypress', ['$event'])
	onKeyPress(event: any) {
		let element = this.elRef.nativeElement;
		let keyIsTab = event.which || event.keyCode === 9;
		let keyIsEnter = event.which || event.keyCode === 13;
		if (keyIsEnter || keyIsTab) { return; };

		let keyIsSpace = event.which === 32;
		if (keyIsSpace) {
			event.preventDefault();
		} else if (element['selectionStart'] === element['selectionEnd']) {
			let currentValue = element.value;
			let futureValue =
				currentValue.substring(0,
					element['selectionStart']) +
				String.fromCharCode(event.which) +
				currentValue.substring(element['selectionEnd']);
			let parsedValue = this.easyMask(futureValue, this.mask);
			if (parsedValue.length <= currentValue.length) {
				event.preventDefault();
			}
		}
	}
	@HostListener('input', ['$event'])
	onInput($event: any) {
		let element = this.elRef.nativeElement;
		let parsedValue = this.easyMask(element.value, this.mask, $event);

		this.updateValue(parsedValue);


	}

	updateValue(value) {
		if (this.formControl) {
			this.formControl.updateValue(value);
		} else {
			this.elRef.nativeElement.value = value;
		}
	}

	easyMask(input, mask, keyCode?) {
		if (typeof input !== 'string' || typeof mask !== 'string' || mask === '') {
			return null;
		}
		if (this.isSeparator(mask[mask.length - 1])) {
			throw new Error('Mask must not end with a separator: ' + mask[mask.length - 1]);
		}
		let re = this.buildRegExp(mask);
		// Get Regex Matches minus the separators
		let matches = re.regExp.exec(input.replace(/[^\dA-Za-z]/g, ''));

		if (matches) {
			let runningValue = '',
				separatorsToInsert = re.separators,
				lengthTriggers = re.lengths,
				index = 1,
				len = matches.length;

			if (separatorsToInsert[0] !== undefined) {
				runningValue += separatorsToInsert[0];
			}
			while (index < len && matches[index] !== undefined) {
				let mapper = re.mappers[index - 1];
				runningValue += mapper(matches[index]);

				if (mapper(matches[index]).length === lengthTriggers[index - 1]) {
					runningValue += (separatorsToInsert[index] || '');
				}
				index++;
			};
			return runningValue;
		}

		return '';
	}

	createReplacer(wildcardsInMask) {
		return (group) => {
			return Array.prototype.reduce.call(group, (previous, current, index) => {
				return previous + this.wildcardToMapper(wildcardsInMask[index])(current);
			}, '');
		};
	}


	buildRegExp(mask) {
		let result = '';
		let re = /([^09ALZ]*)?([09ALZ]*)+/g;
		let groups,
			lengths = [],
			separators = [],
			mappers = [];

		//  Calls re.exec multiple times to get every regex group!
		while ((groups = re.exec(mask)) !== null && groups[0] !== '') {
			// Gets the separator first if no separator first it'll be blank
			separators.push(groups[1]);
			let wildcardsInMask = groups[2].split('');
			// Gets the Length of the Matchers - used for putting in separators at the right points
			lengths.push(groups[2].length)
			// Create the regex from the wildcards
			result += '(' + wildcardsInMask.map(this.mapToRegExp).join('') + ')?';
			// Returns a replacer function
			mappers.push(this.createReplacer(wildcardsInMask));
		}

		return {
			regExp: new RegExp('^' + result + '$'),
			separators: separators,
			mappers: mappers,
			lengths: lengths
		};


	}

	mapToRegExp(item) {
		let map = {};
		map['0'] = '\\d*?';
		map['9'] = '\\d?';
		map['A'] = '[\\dA-Za-z]*?';
		map['L'] = '[A-Za-z]?';
		map['Z'] = '[A-Za-z]*?';
		return map[item];
	}

	isSeparator(char) {
		return this.mapToRegExp(char) === undefined;
	}

	wildcardToMapper(item) {
		let noop = function (i) {
			return i || '';
		};
		let map = {};
		map['A'] = function (i) {
			return i.toUpperCase();
		};
		map['L'] = function (i) {
			return i.toUpperCase();
		};
		map['Z'] = function (i) {
			return i.toLowerCase();
		};
		return map[item] || noop;
	}
}
