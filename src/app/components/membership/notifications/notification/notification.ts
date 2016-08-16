import {
	Component, Input, Output, EventEmitter, OnInit, trigger,
	state,
	style,
	transition,
	animate,
	group
} from '@angular/core';
import { Analytics } from './../../../../services/analytics.service';
@Component({
	selector: 'c-notification',
	template: require('./notification.html'),
	animations: [
		trigger('visibleState', [
			state('open', style({ marginTop: 0 })),
			state('void, closed', style({ marginTop: '-100%' })),
			transition('* => open', [
				style({ marginTop: '-100%' }),
				group([
					animate('700ms cubic-bezier(0.215, 0.61, 0.355, 1)', style({
						marginTop: 0
					}))
				])
			]),
			transition('open => *', [
				style({ marginTop: '0%' }),
				group([
					animate('700ms cubic-bezier(0.77, 0, 0.175, 1)', style({
						marginTop: '-100%'
					}))
				])
			])
		])
	]
})
export class NotificationComponent implements OnInit {
	@Input('notification') notification: AANotification;
	@Output() onClose: EventEmitter<any> = new EventEmitter();

	isOpen: string;
	description: string;
	count: number;
	errorTimer: number;
	interval;

	constructor(
		private _analytics: Analytics
	) {

	}

	ngOnInit() {
		this.description = this.notification.text;
		this.isOpen = 'open';
		/**
		 *  Timed Error Notification
		 */
		if (this.notification.type === 'error' && this.notification.options && this.notification.options.timer) {
			this.count = this.notification.options.timer - 3;
			this.interval = setInterval(() => {
				this.description = this.notification.text + ` We will try to connect again in ${this.count} seconds`;
				this.errorTimer = this.count;
				this.count--;
				if (this.count <= -1) {
					this.description = `Trying to Connect`;
				}
				if (this.count <= -3) {
					this.emitCancel();
					clearInterval(this.interval);
				}
			}, 1000);

		}
	}

	emitCancel() {
		this.isOpen = 'closed';
		setTimeout(() => {
			this.onClose.next(this.notification.id);
		}, 1400);
	}
}
