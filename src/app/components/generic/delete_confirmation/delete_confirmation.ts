import {
	Component,
	trigger,
	animate,
	state,
	transition,
	style,
	Input,
	Output,
	EventEmitter} from '@angular/core';
@Component({
	selector: 'c-confirm-delete',
	template: require('./delete_confirmation.html'),
	host: {
		"[class.c-delete-confirmation]": 'true',
		"[class.isOpen]": 'isOpen'
	},
	animations: [
		trigger('initButtonVisible', [
			state('visible', style({transform: 'scale(1)'})),
			state('hidden', style({ transform: 'scale(0)' })),
			transition('* => visible', [animate('350ms 700ms cubic-bezier(0.215, 0.61, 0.355, 1)')]),
			transition('* => hidden', [animate('300ms cubic-bezier(0.215, 0.61, 0.355, 1)')])
			
		]),
		trigger('confirmationVisible', [
			state('visible', style({transform: 'translateX(0)'})),
			state('hidden', style({ transform: 'translateX(100%)' })),
			transition('* => visible', [animate('300ms 350ms cubic-bezier(0.215, 0.61, 0.355, 1)')]),
			transition('* => hidden', [animate('300ms cubic-bezier(0.215, 0.61, 0.355, 1)')])
			
		])
	]
})
export class DeleteConfirmation {
	@Output('onConfirm') onConfirm: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output('onOpen') onOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
	initBtnVisible: string = 'visible';
	confGrpVisible: string = 'hidden';
	isOpen: boolean = false;
	constructor() {
		
	}
	open() {
		this.onOpen.next(true);
		this.initBtnVisible = 'hidden';
		this.confGrpVisible = 'visible';
	}
	close() {
		this.onOpen.next(false);
		this.confGrpVisible = 'hidden';
		this.initBtnVisible = 'visible';
	}
	confirm() {
		this.close();
		this.onConfirm.next(true);
	}
}
