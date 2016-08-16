import {Component, ElementRef, AfterViewInit, Renderer} from '@angular/core';

let template = require('./addon_list.html');
import {Utils} from './../../../shared/utilities/index';
import * as IScroll from 'iscroll';

/**
 *
 * Addon List Component
 *
 * Generates a List of Benefits from benefit data array
 *
 * @selector m-addon-list
 * @input data: JourneyBenefit[] - An array of benefits
 * 
 *
 * ```` 
 * <m-addon-list [data]="option.benefits"></m-addon-list>
 * ````
 */

@Component({
	selector: 'm-addon-list',
	template: template,
	inputs: ['data']
})
export class AddonList implements AfterViewInit {
	// iScroll - iScroll Instantiation
	iScroll: any;
	// resizeTimeout - Prevents Resize trigger over triggering on browser resize
	resizeTimeout;
	// Array of Benefits
	data: JourneyBenefit[];

	constructor(
		private _renderer: Renderer,
		private _el: ElementRef
	) { }

	ngAfterViewInit() {
		// Add Iscroll to Benefits List
		let element = this._el.nativeElement.querySelector('.m-addon-list__wrapper');
		this.iScroll = new IScroll(element, { el: 'li', snap: true, scrollX: true, scrollY: true });
		// Listen for Resize Event Trigger and Throttle Event
		window.addEventListener('resize', this.throttle, false);
		// Resize Iscroll on load
		this.resizeIscroll();
	}

	/* istanbul ignore next */
	next(evt: Event) {
		evt.stopPropagation();
		evt.preventDefault();
		this.iScroll.next();
	}
	/* istanbul ignore next */
	prev(evt: Event) {
		evt.stopPropagation();
		evt.preventDefault();
		this.iScroll.prev();
	}

	/* istanbul ignore next */
	throttle = () => {
		if (!this.resizeTimeout) {
			this.resizeTimeout = setTimeout(() => {
				this.resizeTimeout = undefined;
				this.resizeIscroll();

				// The actualResizeHandler will execute at a rate of 15fps
			}, 66);
		}
	}
	/* istanbul ignore next */
	resizeIscroll() {
		let li = this._el.nativeElement.querySelectorAll('li');
		let scroller = this._el.nativeElement.querySelector('.m-addon-list__scroller');

		if (Utils.isViewportTablet()) {
			let width = this._el.nativeElement.querySelector('article').scrollWidth + 'px';
			let scrollerWidth = li.length * (this._el.nativeElement.scrollWidth - 15);
			this._renderer.setElementStyle(scroller, 'width', scrollerWidth + 'px');
			_.each(li, (e) => {
				this._renderer.setElementStyle(e, 'width', width);
			});
		} else {
			this._renderer.setElementStyle(scroller, 'width', 'inherit');
			_.each(li, (e) => {
				this._renderer.setElementStyle(e, 'width', 'inherit');
				this._renderer.setElementStyle(e, 'width', 'initial');
			});
		}

		this.iScroll.refresh();
	}

}
