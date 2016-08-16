import {
	Component, Input, Output, EventEmitter, OnInit, trigger,
	state,
	style,
	transition,
	animate,
	group
} from '@angular/core';
import { Subject } from 'rxjs/Rx';
let template = require('./notification_confirmation.html');
@Component({
	selector: 'c-notification-confirmation',
	template: template,
	animations: [
		trigger('visibleState', [
			state('open', style({ margin: 0 })),
			state('closed', style({ margin: '-100%' })),
			transition('* => open', [
				style({ marginTop: '-100%' }),
				group([
					animate('0.5s cubic-bezier(0.215, 0.61, 0.355, 1)', style({
						marginTop: 0
					}))
				])
			]),
			transition('open => *', [
				style({ marginTop: '0%' }),
				group([
					animate('0.5s cubic-bezier(0.77, 0, 0.175, 1)', style({
						marginTop: '-100%'
					}))
				])
			])
		])
	]
})
export class NotificationConfirmationComponent implements OnInit {
	@Input('notification') notification: AANotification;
	@Output() onClose: EventEmitter<any> = new EventEmitter();
	isOpen: string;
	description: string;
	btnText: string;
	link: string;

	constructor(
	) { }

	ngOnInit() {
		this.description = this.notification.text;
		this.btnText = this.notification.options.btnText ? this.notification.options.btnText : 'Continue';
		this.link = this.notification.options.link ? this.notification.options.link : null;
		this.isOpen = 'open';
	}

	emitContinue() {
		let promise: Subject<any> = this.notification.options.promise;
		this.emitCancel();
		promise.next(true);

	}

	emitCancel() {
		this.isOpen = 'closed';
		setTimeout(() => {
			this.onClose.next(this.notification.id);
		}, 1400);
	}
}
