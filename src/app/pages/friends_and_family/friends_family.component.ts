import { Component, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {isPresent} from '@angular/platform-browser/src/facade/lang';
import {UIStore, DataStore} from './../../stores/stores.modules';
import {CONSTS} from './../../constants';
// import {RulesEngineService} from './../../../services/rules_engine_service';
import {QuoteService} from './../../services/quote.service';
import {Observable} from 'rxjs/Rx';

/**
 *  Friends & Family Page Component
 *  TODO: Remove Placeholder functions if its not being used 
 *
 */

@Component({
	selector: 'p-friends-and-family',
	template: require('./friends_family.html')
})
export class MembershipFriendsAndFamilyPageComponent implements OnDestroy {
	// Default Settings for Friends and Family Page
	page: UIPage;
	// Array of Members without Primary Member
	members: MemberType[];
	// Member to be removed for the Remove Member modal
	memberToBeRemoved: Member;
	placeholderMemberToBeRemoved: any;
	// Testimonial Outcome
	outcome: Outcome;
	sub: ISubscriptionDefinition<any>;

	constructor(
		private _router: Router,
		private _uiStore: UIStore,
		private _dataStore: DataStore,
		private _el: ElementRef,
		// private _rulesEngine: RulesEngineService,
		private _quoteService: QuoteService
	) {
		this.page = this._uiStore.getPage('friendsFamily');
		this.members = this._dataStore.getGeneratedAdditionalMembers();
		this.sub = this._dataStore.subscribeAndGet(CONSTS.MEMBER_UPDATE, (event) => {
			this.members = this._dataStore.getGeneratedAdditionalMembers();
		});

	}

	/**
	 *  Listens for onSave Event from AddMemberCard components, saves the member to the datastore
	 *  @listens onSave
	 */
	saveMember(member: Member) {
		this._quoteService.addMember(member.index, {
			firstName: member.firstName,
			surname: member.surname,
			dateOfBirth: member.dateOfBirth
		})
			.retryWhen((attempts) => {
				return Observable.range(1, 3).zip(attempts, (i) => {
					return i;
				}).flatMap((i) => {
					let time = i * 6;
					return Observable.timer(time * 1000);
				});
			})
			.subscribe((next) => {

			}, (err) => {
				console.log(err);
			});
		this._dataStore.saveMember(member);
	}


	/**
	 *  Calls the removeMember function of the store and closes the modals
	 *  @method
	 *  @params {Member} member
	 *
	 */
	deleteMember(member: Member) {
		// event.stopPropagation();
		this._quoteService.removeMember(member.index)
			.retryWhen((attempts) => {
				return Observable.range(1, 3).zip(attempts, (i) => {
					return i;
				}).flatMap((i) => {
					let time = i * 6;
					return Observable.timer(time * 1000);
				});
			}).subscribe((next) => {

			}, (err) => {
				console.log(err);
			});
		this._dataStore.removeMember(member);
		this._uiStore.closeAllModals();
	}

	/**
	 *  @method
	 *  @params {Member} member
	 *
	 */
	removePlaceholderMember(member: Member) {
		this._dataStore.removeMember(member);
		this._uiStore.closeAllModals();
		this.openTestimonials();
	}

	/**
	 *  Listens to onNavigate from the fixed navigation component,
	 *  called when user attempts to navigate forward
	 *
	 *  @listens onNavigate
	 */

	openTestimonials() {
		// This is being tested in the rules engine, and the testimonials appearing
		// will be checked in RF tests

		/* istanbul ignore next */
		if (!this.checkForPlaceholderMembers()) {
			setTimeout(() => {
				// this.outcome = this._rulesEngine.random();
				this._uiStore.openModal('testimonials');
			}, 0);
		}

	}

	/**
	 *  Finds any members in created members in the datastore with placeholder
	 *  property set to true and opens the placeholder warning modal
	 *
	 */
	checkForPlaceholderMembers() {
		let placeholder = _.find(this._dataStore.getCreatedMembers(), (e: Member) => {
			return e.placeholder;
		});

		if (isPresent(placeholder)) {
			this.placeholderMemberToBeRemoved = placeholder;
			this._uiStore.openModal('removePlaceholderMember');
			return true;
		}
	}

	ngOnDestroy() {
		this._dataStore.unsubscribe(this.sub);
	}
	/* istanbul ignore next */
	routerOnActivate() {
		// this._transitions.animatePageIn(this._el);
	}
	/* istanbul ignore next */
	routerOnDeactivate() {
		// return this._transitions.animatePageOut(this._el);
	}
}
