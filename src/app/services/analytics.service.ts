import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';

@Injectable()
export class Analytics {
	public uiStore: any;
	public pageEvents: Subject<any> = new Subject();
	public userEvents: Subject<any> = new Subject();
	public formEvents: Subject<any> = new Subject();
	public loginEvents: Subject<any> = new Subject();
	public errorEvents: Subject<any> = new Subject();
	public registerEvent: Subject<any> = new Subject();

	private _allEvents: Observable<any>;
	private _dataLayer: any;
	private userId: any;

	constructor() {

		this._dataLayer = window['dataLayer'] || [];
		this.pageEvents.subscribe((next) => { this.triggerPageEvent(next); });
		this.formEvents.subscribe((next) => { this.triggerFormEvent(next); });
		this.loginEvents.subscribe((next) => { this.triggerLoginEvent(next); });
		this.registerEvent.subscribe((next) => { this.triggerRegistrationEvent(next); });
		this.errorEvents.subscribe((next: AnalyticsErrorEvent) => { this.triggerErrorEvent(next); });
	}

	createEvent(evt) {
		let obj = _.assign({}, {
			'page-name': this.uiStore.get(['activePage']).address
		}, evt);
		this._dataLayer.push(obj);
	}

	triggerEvent(name: string, status?: any, value?: any) {
		let evtObj: any = {};
		// Event Name - name
		evtObj.event = name;
		// Event Status - status
		if (status && status != null) { evtObj.status = status; };
		// Event Value - value
		if (value && value != null) { evtObj.value = value; };
		this.createEvent(evtObj);
	}

	triggerErrorEvent(evt: AnalyticsErrorEvent) {
		let evtObj = {
			// Event Name - service-error
			'event': 'service-error',
			// Service Name - Which service triggered the error
			'service': evt.service,
			// Error - What the error was
			'error-value': evt.error
		};
		this.createEvent(evtObj);
	}

	triggerFormEvent(evt: AnalyticsFormEvent) {
		let evtObj = {
			// Name of the Event = form-input
			'event': 'form-input',
			// Name of the Form
			'form-label': evt['form-label'],
			// Name of the Input Field
			'field-name': evt['input-name'],
			// Input Status Value - Init/Success/Failure
			'input-status-value': evt['input-status-value'],
			'input-value': evt['input-value']
		};
		this.createEvent(evtObj);
	}

	triggerLoginEvent(status) {
		let evtObj = {
			'event': 'login-attempt',
			// Whether logging in was successful
			'status': status
		};
		this.createEvent(evtObj);
	}

	triggerRegistrationEvent(status) {
		let evtObj = {
			'event': 'register-attempt',
			// Whether logging in was successful
			'status': status
		};
		this.createEvent(evtObj);
	}

	triggerPaymentEvent(type, status) {
		let evtObject = {
			event: 'payment-event',
			type: type,
			status: status
		}
		this.createEvent(evtObject);
	}
	triggerPageEvent(evt) {
		let evtObj: AnalyticsPageEvent = {
			'event': 'page-view',
			'page-name': evt.title
		};
		this.createEvent(evtObj);
	}
}
