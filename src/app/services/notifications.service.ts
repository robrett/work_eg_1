import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import {isPresent} from '@angular/common/src/facade/lang';
let initialNotifications: AANotification[] = [];


@Injectable()
export class NotificationService {
	// Stream that publishes the new notifications
	notifications: Observable<any>;
	public clearNotificationsObs: Subject<boolean> = new Subject<boolean>();
	private notificationsArray: AANotification[] = [];
	private notificationId: number = 0;
	private newNotifications: Subject<AANotification> = new Subject<AANotification>();
	private confirmationNotification: Subject<boolean> = new Subject<boolean>();
	private confirmationPromise;
	private lastErrMsg: string;
	private errorNotifications;
	private nNotifications;

	constructor(
	) {

		this.errorNotifications = this.newNotifications
			.filter((x) => { return x.type === 'error'; });

		this.nNotifications = this.newNotifications
			.filter((x) => { return x.type !== 'error'; });

		this.notifications = Observable.merge(
			this.nNotifications,
			this.errorNotifications
		);

		// Debugging		
		setTimeout(() => {
			// this.createLogin('login@gmail.com');
			// this.createNotification('Blah');
			// this.createError('Use 24 characters or fewer for file names.');
			// this.createTimedError("There was a fatal error, please wait!", 12);
			// this.createTimedError("There was a fatal error 2, please wait!", 12);
			// this.createTimedError("There was a fatal error 3, please wait!", 12);

		}, 100);

		this.confirmationNotification.subscribe((next) => {

		});
	}

	// Grab the next notification from the array and delete it
	getNextNotification(): AANotification {
		let result = this.notificationsArray[0];
		this.notificationsArray.shift();
		return result;
	}

	/**
	 * 	Pushes a notification to the default notification queue with default settings
	 * 	@param string text
	 */
	createNotification(text: string): void {
		this.notificationId++;
		this.addNotification({
			id: 'nID' + this.notificationId,
			type: 'default',
			text: text,
			options: {
				display: 'default'
			}
		});
	}

	/**
	 * 	Pushes a Login notification to the instant notification queue
	 * 	@param string email
	 * 	@param boolean myaa - changes whether form asks the user do they want to login 
	 */
	createLogin(email: string, myaa?: boolean): void {
		this.notificationId++;
		let myAAStatus = isPresent(myaa) ? myaa : false;
		this.addInstantNotification({
			id: 'nID' + this.notificationId,
			type: 'login',
			text: email,
			options: {
				display: 'instant',
				myAAStatus: myAAStatus
			}
		});
	}

	/**
	 * 	Pushes an Error notification to the instant notification queue
	 * 	@param string errText
	 */
	createError(errText: string): void {
		// Prevent the same message being triggered repeatedly
		if (errText !== this.lastErrMsg) {
			this.lastErrMsg = errText;
			this.notificationId++;
			this.addInstantNotification({
				id: 'nID' + this.notificationId,
				text: errText,
				type: 'error',
				options: {
					display: 'instant'
				}
			});
		}

	}

	/**
	 * 	Pushes an Error notification with a countdown timer to the instant notification queue
	 * 	@param string errText
	 * 	@param number timer - amount of seconds till the notification closes
	 */
	createTimedError(errText: string, timer: number): void {
		this.notificationId++;
		this.addInstantNotification({
			id: 'nID' + this.notificationId,
			text: errText,
			options: {
				display: 'instant',
				timer: timer
			},
			type: 'error'
		});
	}

	/**
	 * 	Pushes a notification with a confirmation button to the instant notification queue
	 * 	This is currently used inside the Act/Deactivation guards certain pages to prevent a
	 * 	user from navigating with out user confirmation. As such this passes a promise to the
	 * 	notification child component, that will resolve back to the Page component level.
	 *
	 * 	@param string text
	 * 	@return Observable - returns an observable promise 
	 */
	createConfirmationNotification = (text: string, btnText?: string, link?: string): Observable<boolean> => {
		this.notificationId++;
		this.addInstantNotification({
			id: 'nID' + this.notificationId,
			text: text,
			options: {
				display: 'instant',
				btnText: btnText,
				link: link,
				promise: this.confirmationNotification
			},
			type: 'confirmation'
		});
		return this.confirmationNotification;
	}

	public clearLastErrorMsg() {
		this.lastErrMsg = '';
	}
	public clearNotifications() {
		this.clearNotificationsObs.next(true);
	}
	// Instant Notifications are displayed immediately
	private addInstantNotification(notification: AANotification): void {
		this.newNotifications.next(notification);
	}
	// Generic Notifications are added to the queue
	private addNotification(notification: AANotification): void {
		this.notificationId++;
		this.notificationsArray.push(notification);
		this.newNotifications.next(notification);
	}

}
