import { OnInit, ElementRef, Renderer} from '@angular/core';
import {UIStore} from './../../../stores/uistore.store';
import {isPresent} from '@angular/platform-browser/src/facade/lang';
import * as Velocity from 'velocity-animate';

export class Popup implements OnInit {
	channel: string;
	isVisible: boolean = false;
	transition: string;
	subscription: any;
	body: any;
	topNav: any;

	constructor(
		private _uiStore: UIStore,
		private _el: ElementRef,
		private _renderer: Renderer
	) {
	}
	ngOnInit() {
		this.body = document.querySelector('body');
		this.topNav = document.querySelector('c-top-nav');
		this._uiStore.update(['modals', this.channel], false);
		this._uiStore.select('modals', this.channel).on('update', this.toggleVisiblity)
	}
	toggleVisiblity = (event) => {
		let toggle = event.data.currentData;
		this.isVisible = toggle ? toggle : !this.isVisible;

		let transitionString = isPresent(this.transition) ? this.transition : 'shrink';
		if (this.isVisible) {
			this.setBody(true);
			this.setNav(true);
			Velocity(this._el.nativeElement, 'transition.' + transitionString + 'In', {
				visibility: 'visible'
			});

		} else {
			this.setBody(false);
			this.setNav(false);
			Velocity(this._el.nativeElement, 'transition.' + transitionString + 'Out',
				{
					duration: 150,
					visibility: 'hidden',
					complete: () => {

					}
				});
		}
	}

	close() {
		this._uiStore.closeAllModals();
		this.setBody(false);
		this.setNav(false);
	}

	setNav(toggle) {
		// Temp if topNav for  Tests - Top Nav doesnt exist
		// Decouple this into TopNav
		if (this.topNav) {
			if (toggle) {
				this._renderer.setElementClass(this.topNav, 'zIndexZero', true);
			} else {
				this._renderer.setElementClass(this.topNav, 'zIndexZero', false);
			}
		}

	}

	setBody(toggle) {
		if (toggle) {
			this._renderer.setElementStyle(document.querySelector('body'), 'overflow', 'hidden');
			this._renderer.setElementStyle(document.querySelector('body'), 'position', 'fixed');

		} else {
			this._renderer.setElementStyle(document.querySelector('body'), 'overflow', 'visible');
			this._renderer.setElementStyle(document.querySelector('body'), 'position', 'relative');
		}
	}

}
