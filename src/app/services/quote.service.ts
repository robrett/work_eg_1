import { Injectable} from '@angular/core';
import { Router } from '@angular/router';

import {DataStore, UIStore } from './../stores/stores.modules';
import {AuthHttp} from './../shared/common/authHttp';
import {CONSTS} from './../constants';
import {Subject} from 'rxjs/Rx';

@Injectable()
export class QuoteService {
	BASE_URL: string = CONSTS.getBaseUrlWithContext();
	GET_QUOTE_URL: string = 'users/me/quote';
	RETRIEVE_QUOTE_URL: string = 'users/me/quote?reference=';
	UPDATE_PROPOSAL_URL: string = 'users/me';
	UPDATE_COVER_URL: string = 'users/me/cover/';
	UPDATE_MEMBER_URL: string = 'users/me/members/';
	retrieveQuoteList: Subject<any> = new Subject();

	constructor(
		private _dataStore: DataStore,
		private _uiStore: UIStore,
		private _auth: AuthHttp,
		private _router: Router,
	) { }

	/**
	 * 	Pushes an update to the Quote
	 * 	@param ProposalObject obj - Quote Object
	 */
	updateProposal(obj: ProposalObject) {
		return this._auth.put(this.BASE_URL + this.UPDATE_PROPOSAL_URL, JSON.stringify(obj));
	}

	/**
	 * 	Update the Cover Level
	 */
	updateCover(coverLevel: CoverLevel|QuoteBreakdownItem, active: boolean) {
		return this._auth.put(this.BASE_URL + this.UPDATE_COVER_URL + coverLevel.name, JSON.stringify({active: active}));
	}

	/**
	 * 	Add a Member
	 */
	addMember(memberIndex: number, memberObject: Member) {
		return this._auth.put(this.BASE_URL + this.UPDATE_MEMBER_URL + memberIndex, JSON.stringify(memberObject));
	}

	/**
	 * 	Remove a member
	 */
	removeMember(memberIndex: number) {
		return this._auth.delete(this.BASE_URL + this.UPDATE_MEMBER_URL + memberIndex);
	}

	/**
	 * 	Update the local journey and calls getQuote again
	 * 	@param QuoteBreakdownItem item
	 */
	removeBreakdownItem(item: QuoteBreakdownItem) {
		if (item.type === 'member') {
			this.removeMember(item.index).subscribe((next) => {
				this.getQuote().subscribe((quote) => {
					this._dataStore.setQuote(quote.json().quotation);
				});
			});

		} else if (item.type === 'cover') {
			let coverIdx = _.findIndex(this._dataStore.get(['config', 'coverLevel']), (e: any) => {
				return e.name === item.name;
			});
			this.updateCover(item, false).subscribe((next) => {
				this._dataStore.toggleCoverLevel(coverIdx, false);
				this.getQuote().subscribe((quote) => {
					this._dataStore.setQuote(quote.json().quotation);
				});
			});
		}
	}
	/**
	 * 	Get a Quote
	 */
	getQuote() {
		this._uiStore.update(['UIOptions', 'isSaveQuoteVisible'], 'visible');
		return this._auth.get(this.BASE_URL + this.GET_QUOTE_URL);
	}

	/**
	 * 	On retrieving a quote either from the basic journey or retrieving a quote, updates the local
	 * 	quotation/entire configuration and directs the user either to the whats included page or the
	 * 	breakdown page.
	 */
	setQuote(config: any, isExpired: boolean, isRetrieved?: boolean) {
		if (isExpired) {
			this._dataStore.update(['config'], config);
			this._router.navigate(['/']);
		} else {
			this._dataStore.setQuote(config.quotation);
			// Make Save Quote on the Breakdown Screen invisible
			this._uiStore.update(['UIOptions', 'isSaveQuoteVisible'], 'hidden');
			this._dataStore.update(['config'], config);
			this._router.navigate(['breakdown']);
		}
	}

	/**
	 * 	Retrieves a previous quote if the user is already verified through a MyAA session cookie
	 */
	retrieveQuote(quoteReference: string) {
		return this._auth.get(this.BASE_URL + this.RETRIEVE_QUOTE_URL+quoteReference);
	}
	/**
	 * 	Retrieves a previous quote using the webreference and the users date of birth
	 * 	@param string quoteReference
	 * 	@param string dateOfBirth
	 */
	retrieveQuoteWeb(quoteReference: string, dateOfBirth: string) {
		return this._auth.get(this.BASE_URL + this.RETRIEVE_QUOTE_URL+quoteReference+'&dateOfBirth='+dateOfBirth);
	}
}
