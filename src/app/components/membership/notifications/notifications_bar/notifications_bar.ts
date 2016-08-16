import {
	Component,
} from '@angular/core';
import {NotificationService} from './../../../../services/notifications.service';

@Component({
	selector: 'c-notification-bar',
	template: require('./notifications_bar.html'),
})
export class NotificationBarComponent {
	notificationDrawerStatus: string;
	notificationsArr: AANotification[];
	currentNotification: AANotification;
	confirmationNotification: AANotification;
	loginNotification: AANotification;
	errorNotificationsArr: AANotification[] = [];


	constructor(
		private _notificationService: NotificationService
	) {
		this._notificationService.notifications.subscribe((next) => {
			if (next.options.display === 'instant') {
				this.consumeInstant(next);
			} else {
				this.consumeNotification();
			}
		});

		this._notificationService.clearNotificationsObs.subscribe((next) => {
			this.clearNotifications();
		})
	}

	consumeNotification() {
		this.currentNotification = this._notificationService.getNextNotification();
	}

	consumeInstant(notification: AANotification) {
		if (notification.type === 'error') {
			this.errorNotificationsArr.unshift(notification);
		} else if (notification.type === 'login') {
			this.loginNotification = notification;
		} else {
			this.confirmationNotification = notification;
		}
	}

	cancelConfirmation() {
		this.confirmationNotification = null;
	}

	cancelError(notificationId?: string) {
		this._notificationService.clearLastErrorMsg();
		let a = _.remove(this.errorNotificationsArr, (e) => {
			return e.id === notificationId;
		});

		if (a.length === 0) {
			this.loginNotification = null;
		}

	}

	public clearNotifications() {
		_.remove(this.errorNotificationsArr, (e) => { return e; });
		this.loginNotification = null;
		this.confirmationNotification = null;
	}
}
