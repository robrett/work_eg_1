import { Attribute, Component, ElementRef, Renderer, HostBinding } from '@angular/core';
import { Popup } from './../popups/popup';
import { UIStore }from './../../../stores/uistore.store';
let template = require('./fullscreen_popup.html');

@Component({
	selector: 'pu-fullscreen',
	template: template,
})
export class FullscreenPopupComponent extends Popup {
	@HostBinding('class.isVisible') isVisible: boolean;
	data: any;
	header: any;
	channel: string;

	constructor(
		@Attribute('header') header: string,
		@Attribute('channel') channel: string,
		private store: UIStore,
		el: ElementRef,
		renderer: Renderer

	) {
		super(store, el, renderer);
		this.header = header;
		this.channel = channel;
	}

}
