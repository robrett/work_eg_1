import {Injectable} from '@angular/core';
import {isPresent} from '@angular/platform-browser/src/facade/lang';
import {CONSTS} from './../constants';
import { DispatcherStore, Dispatcher } from './../shared/common/index';
import { InitService } from './../services/init.service';

import * as Baobab from 'Baobab';
import * as _ from 'lodash';
import * as Postal from 'postal';

let monkey: any = Baobab.monkey;

@Injectable()
export class DataStore extends DispatcherStore {

	public ACTIVE_TITLES = ['Miss', 'Mr', 'Ms', 'Mrs'];

	constructor(
		// private _analytics: Analytics,
		private _productService: InitService,
		// private _referenceService: ReferenceService,
		// private _uiStore: UIStore,
		dispatcher: Dispatcher
	) {
		super(dispatcher, 'UIStore', createDataStore(_productService));
		this.getTitles();
	}

	deleteConvertedQuote() {
		sessionStorage.removeItem('convertedQuote');
		this.remove(['config', 'convertedQuote']);
	}

	convertQuote(convertedQuote: any) {
		// this._analytics.triggerEvent('convert-quote', null, convertedQuote);
		sessionStorage.setItem('convertedQuote', JSON.stringify(convertedQuote));
		this.update(['config', 'convertedQuote'], convertedQuote);
	}

	getCoverLevel(index): CoverLevel {
		return this.get(['config', 'coverLevel', index]);
	}

	toggleCoverLevel(index: number, active: boolean) {
		let level: CoverLevel = this.get(['config', 'coverLevel', index]);
		if (!level.disabled) {
			this.deleteQuote();
			// this._analytics.triggerEvent('coverLevel', active, this.get(['config', 'coverLevel', index, 'name']));
			this.update(
				['config', 'coverLevel', index, 'active'], active, CONSTS.ADDONS_UPDATE);
		}
	}

	getTitles() {
		let titles = this.get(['titles']);
		let defaultTitles = [{ 'id': 'Miss', 'value': 'Miss.' },
			{ 'id': 'Mr', 'value': 'Mr.' },
			{ 'id': 'Mrs', 'value': 'Mrs.' },
			{ 'id': 'Ms', 'value': 'Ms.' }];

		// if (!_.values(titles).length) {
		// 	this._referenceService.getTitles().subscribe((next) => {
		// 		titles = next.json();
		// 		titles.shift();
		// 		titles = _.filter(titles, (e: any) => {
		// 			return _.find(this.ACTIVE_TITLES, (x: any) => { return e.id === x; });
		// 		});
		// 		this.update(['titles'], titles, CONSTS.TITLE_OPTION);
		// 	}, (err) => {
		// 		this.update(['titles'], defaultTitles);
		// 	});
		// 	return defaultTitles;
		// } else {
		// 	return this.get(['titles']);
		// }
		return defaultTitles;
	}

	setActivePaymentType(i) {
		let paymentOptions = this.get(['config', 'paymentOptions']);
		let activePaymentOption = this.get(['config', 'paymentOptions', i]);
		for (let key in paymentOptions) {
			if (paymentOptions[key]) {
				this.update(['config', 'paymentOptions', key, 'active'], false);
			}
		}
		this.update(['pricing', 'frequency'], activePaymentOption.type, CONSTS.PRICING_UPDATE);
		this.update(['config', 'paymentOptions', i, 'active'], true, CONSTS.PRICING_UPDATE);
	}

	/**
	 * 	Returns a specific member type used to construct a member object
	 * 	@param {string} type - type of member to be generated
	 * 	@param {number} index - index of the type of member to be generated
	 */

	getGeneratedMember(type, index) {
		return this.getGeneratedMembersByType(type).value[index];
	}

	/**
	 * 	Returns all memberType objects used to construct a member object of a certain member type
	 * 	@param {string} type - type of member to be generated
	 * 	@param {number} index - index of the type of member to be generated
	 */

	getGeneratedMembersByType(type): any {
		return _.find(this.select('memberSetup').get(), { type: type });
	}

	/**
	 * 	Generates a number of placeholder members of a certain type
	 * 	@param {number} amount - amount of members to generate
	 *  @param {string} memberType - type of member to generate
	 */

	generatePlaceholderMembers(amount: number, memberType: string) {
		let index = 0;
		if (memberType === 'adults') {
			index = 1;
			amount += 1;
		}
		for (index; index < amount; index++) {
			// Get Member Type and create a placeholder member for that type
			let member: Member = _.clone(this.getGeneratedMember(memberType, index));
			let placeholderMember: Member = {
				price: member.price,
				typeDisplay: member.typeDisplay,
				type: member.type,
				index: index
			};
			placeholderMember.placeholder = true;
			this.update([
				'config',
				'members',
				placeholderMember.type,
				placeholderMember.index], placeholderMember, CONSTS.MEMBER_UPDATE);
		}
	}


	setConfig = (config) => {
		// this._uiStore.update(['UIOptions', 'isQuoteSaved'], false);
		this.update(['config'], config, CONSTS.QUOTE_UPDATE);
	}

	setQuote = (quote: Quote) => {
		// this._uiStore.update(['UIOptions', 'isQuoteSaved'], false);
		this.update(['config', 'quotation'], quote, CONSTS.QUOTE_UPDATE);
	}

	resetConfig() {
		// this._uiStore.reset();
		// this._productService.getConfig().subscribe((next) => {
		// 	this.setConfig(next.json());
		// });
	}

	deleteMembers() {
		this.remove(['config', 'members'], CONSTS.MEMBER_UPDATE);
	}

	deleteQuote() {
		// this._uiStore.update(['UIOptions', 'isQuoteSaved'], false);
		this.remove(['config', 'quotation'], CONSTS.QUOTE_UPDATE);
	}

	/**
	 * 	Saves a member to the store
	 * 	@param {Member} member - member to save
	 */

	saveMember = (member: Member) => {
		this.deleteQuote();
		this.update(['config', 'members', member.type, member.index], member, CONSTS.MEMBER_UPDATE);
	}

	/**
	 * 	Deletes a member from the store
	 * 	@param {Member} member - member to remove
	 */

	removeMember = (member: Member) => {
		this.deleteQuote();
		this.remove(['config', 'members', member.type, member.index], CONSTS.MEMBER_UPDATE);
	}

	getUser() {
		return this.get(['session', 'user']);
	}

	isUserLoggedIn() {
		return this.get(['session', 'user']) ? true : false;
	}

	setAuthenticatedUser(user) {
		this.update(['session', 'user'], user, CONSTS.LOGIN_UPDATE);
		// this._analytics.triggerEvent('aa-populate-fields', 'success');
		this.constructUserObjFromSession('adults', 0);
	}


	updatePaymentDetails(type: any, details: any, triggerPublication?: boolean) {
		if (triggerPublication) {
			this.update(
				['paymentMethods', type, 'values'],
				details,
				CONSTS.BANK_UPDATE);
		} else {
			this.update(
				['paymentMethods', type, 'values'],
				details);
		}

	}

	constructUserObjFromSession(type, index) {

		let sessionUser = this.get(['session', 'user']);
		let user = this.getGeneratedMember(type, 0);
		if (sessionUser) {
			let member: Member = {
				price: user.price,
				typeDisplay: user.typeDisplay,
				type: user.type,
				index: 0
			};

			if (sessionUser.email) {
				member.email = sessionUser.email;
			}
			if (sessionUser.title) {
				member.title = sessionUser.title.id;
			}
			if (sessionUser.firstName) {
				member.firstName = sessionUser.firstName;
			}
			if (sessionUser.surname) {
				member.surname = sessionUser.surname;
			}
			if (sessionUser.dateOfBirth) {
				member.dateOfBirth = sessionUser.dateOfBirth;
			}
			if (sessionUser.phoneNumber) {
				member.phoneNumber = sessionUser.phoneNumber;
			}
			if (sessionUser.address.addressLine1) {
				member.addressLine1 = sessionUser.address.addressLine1;
			}
			if (sessionUser.address.addressLine2) {
				member.addressLine2 = sessionUser.address.addressLine2;
			}
			if (sessionUser.address.area) {
				member.area = sessionUser.address.area;
			}
			if (sessionUser.address.county) {
				member.county = sessionUser.address.county;
			}
			this.update(['config', 'members', type, index], member, CONSTS.MEMBER_UPDATE);
			return member;

		}
	}


	getCreatedMembers() {
		let members = [];
		let membArr = this.get(['config', 'members']);
		for (let key in membArr) {
			if (membArr[key]) {
				for (let subKey in membArr[key]) {
					if (membArr[key][subKey]) {
						members.push(membArr[key][subKey]);
					}
				}
			}

		}
		return members;
	}

	getGeneratedAdditionalMembers(): any[] {
		let members = [];
		_.forEach(this.get(['memberSetup']), (e) => {
			_.forEach(e.value, (m: MemberType) => {
				if (m.type !== 'primaryUser') {
					members.push(m);
				}
			});
		});
		return members;
	}


};

function createDataStore(pService) {
	let storeObject: any = {};
	// Get From Window Object
	storeObject.config = pService.schema;
	storeObject.memberSetup = MemberSetup();
	storeObject.pricing = new Pricing();
	storeObject.paymentMethods = PaymentMethods();
	storeObject.utils = new DataStoreUtils();
	storeObject.titles = {};
	return storeObject;
}


export class DataStoreUtils {
	// Get the Primary Member User Name
	userName = monkey(['config', 'members', 'adults', 0], function (primaryUser) {
		if (!primaryUser || !primaryUser.firstName || !primaryUser.surname) {
			return '';
		}
		return primaryUser.firstName + ' ' + primaryUser.surname;
	});
}

export class Session {
	isActive: boolean = false;
}

export class Members { }

export class Pricing {
	indicative = {};
	type: string = 'Card';
	frequency = 'monthly';
	basePrice = monkey(
		['config', 'basePrice'], function (basePrice: any): any {
			return 0;
		}
	);
	estimate = {
		annual: monkey(['config', 'members'], ['config'], ['config', 'quotation'],
			function (members: any, schema: any, quote: Quote): any {
				if (quote && quote.premium) {
					return quote.premium.annual;
				}
				return calculatePrice(members, schema, true, 'annual');
			}),
		monthly: monkey(['config', 'members'], ['config'], ['config', 'quotation'],
			function (members: any, schema: any, quote: Quote): any {
				if (quote && quote.premium) {
					return quote.premium.monthly;
				}
				return calculatePrice(members, schema, false, 'monthly');
			}),

		Month: monkey(['pricing', 'estimate', 'monthly'],
			function (pricing: any): any {
				return pricing;
			}),
		Year: monkey(['pricing', 'estimate', 'annual'],
			function (pricing: any): any {
				return pricing;
			}),


		calculatedPrice: monkey(
			['config', 'members'],
			['config'],
			['pricing', 'frequency'],
			['pricing', 'estimate', 'monthly'],
			['pricing', 'estimate', 'annual'],
			function (members: any, schema: any, frequency: any, monthly: Price, annual: Price): any {
				if (frequency === 'monthly') {
					return monthly;
				} else {
					return annual;
				}
			})
	};
}


export function MemberSetup() {
	return monkey(['config'], ['config', 'members'], function (pkg, members) {
		let mObj = [];
		_.forEach(pkg.criteria, (e) => {
			let obj: any = {
				value: generateMembersFromScheme(e.max, e.defaults, e.overrides, 'adults', members)
			};
			obj.header = e.header;
			obj.type = 'adults';
			mObj.push(obj);
		});
		return mObj;
	});
}



function generateMembersFromScheme(count, defaults, overrides, type, memberData) {
	let members = [];

	for (let i = 0; i < count; i++) {
		members.push(_.merge({
			index: i
		}, defaults));
	}

	if (overrides) {
		overrides.forEach(overide => {
			members[overide.index] = overide;
		});
	}

	if (memberData && memberData[type]) {
		members = _.map(members, function (e, i) {
			if (memberData[type][i]) {
				let placeholder = isPresent(memberData[type][i]['placeholder']) ? true : false;
				let values = {
					values: memberData[type][i],
					placeholder: placeholder

				};
				_.defaults(values, e);
				return values;
			} else {
				return e;
			}
		});
	}

	return members;
}

function PaymentMethods() {
	return {
			iban: {
				name: 'iban',
				fields: [
					{
						name: 'accountName',
						label: 'Full Name',
						placeholder: 'Full Name',
						type: 'text',
						validation: ['required']
					},
					{
						name: 'BIC',
						label: 'BIC',
						placeholder: 'BIC',
						type: 'text',
						validation: ['required', 'checkBic']
					},
					{
						name: 'IBAN',
						label: 'IBAN',
						placeholder: 'IBAN',
						type: 'text',
						validation: ['required', 'checkIban']
					}
				]
			},

			debit: {
				name: 'debit',
				fields: [
					{
						name: 'accountName',
						label: 'Full Name',
						placeholder: 'Full Name',
						type: 'text',
						validation: ['required']
					},
					{
						name: 'accountNumber',
						label: 'Account Number',
						placeholder: 'Account Number',
						type: 'text',
						validation: ['required', 'minAccount']
					},
					{
						name: 'sortCode',
						label: 'Sort Code',
						placeholder: 'Sort Code',
						type: 'sortcode',
						validation: ['required', 'sortCode']
					}
				]
			},
			credit:
			{
				name: 'credit',
				fields: [
					{
						name: 'accountName',
						label: 'Full Name',
						placeholder: 'Full Name',
						type: 'text',
						validation: ['required']
					},
					{
						name: 'expiryDate',
						label: 'Expiry Date',
						placeholder: 'Expiry Date',
						type: 'date',
						validation: ['required']
					},
					{
						name: 'ccv',
						label: 'CCV',
						placeholder: 'CCV',
						type: 'number',
						validation: ['required', 'notLetters', 'ccv']
					},
					{
						name: 'cardNumber',
						label: 'Card Number',
						placeholder: 'Card Number',
						type: 'text',
						validation: ['required', 'notLetters']
					}
				]
			}
		};
}



function calculatePrice(members: any, config: any, multiplierActive: boolean, type: string) {
	let price: any = 0;
	if (config) {
		_.forEach(members, (e: any) => {
			if (_.size(e) > 0) {
				price = price + (_.reduce(_.map(e, `price.${type}.amount`), function (total: any, num: any) {
					return total + num;
				}));
			}
		});
		_.forEach(config.coverLevel, (e) => {
			if (e.active) {
				price = price + (e.price[type].amount);
			}
		});

		price = {
			amount: price,
			str: `${price / 100}`,
			symbol: '€',
			currency: 'EUR',
			pretty: `€${(price / 100).toFixed(Math.max(0, 2))
			}`
		};
	}


	return price;
}
