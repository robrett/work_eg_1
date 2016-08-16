import {
	Component,
	trigger,
	state,
	style,
	HostBinding,
	transition,
	EventEmitter,
	animate,
	Output,
	Input,
	keyframes
} from '@angular/core';
import {COLORS} from './../../../constants';
import {NotificationService, PaymentService} from './../../../services/index';

@Component({
	selector: 'm-payment-agreement',
	template: require('./payment_agreement.html'),
	animations: [
		trigger('successBump', [
			transition('inactive => active', animate(350, keyframes([
				style({ backgroundColor: COLORS.brand, offset: 0 }),
				style({ backgroundColor: COLORS.primary, offset: 0.5 })
			])))
		]),
		trigger('errorBump', [
			transition('inactive => active', animate(1000, keyframes([
				style({ borderColor: COLORS.medDarkGrey, offset: 0 }),
				style({ borderColor: COLORS.redWarning, offset: .1 }),
				style({ borderColor: COLORS.medDarkGrey, offset: 1 })
			])))
		]),
		trigger('toggleAllProducts', [
			state('void', style({
				opacity: 0,
				position: 'absolute'
			})),
			state('inactive', style({
				opacity: 0,
				position: 'absolute'
			})),
			state('active', style({
				opacity: 1,
				position: 'absolute'
			})),
			transition('active => inactive', animate('250ms ease-in')),
			transition('inactive => active', animate('500ms 250ms ease-in'))
		]),
		trigger('toggleSingleProduct', [
			state('void', style({
				opacity: 0
			})),
			state('inactive', style({
				opacity: 0
			})),
			state('active', style({
				opacity: 1
			})),
			transition('active => inactive', animate('250ms ease-in')),
			transition('* => active', animate('750ms 250ms ease-in-out'))
		])
	]
})
export class PaymentAgreementComponent {
	@Input('frequency') frequency: string;
	@Input('type') type: string;
	@Output('onSuccess') onSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
	@HostBinding('attr.id') id: string = 'payment-agreement';

	private consentAllProductState: boolean = true;
	private toggleAllProductsState: string = 'active';
	private toggleSingleProductState: string = 'inactive';
	private singleSuccessBtn = 'inactive';
	private singleErrorBtn = false;
	private state: string = null;


	constructor(
		private paymentService: PaymentService,
		private notificationService: NotificationService
	) {}

	acceptAgreement(type) {
		let all = type === 'all' ? true : false;
		this.paymentService.confirmTermsConditions(all).subscribe(next => {
			console.log(next);
		});
		this.notificationService.clearNotifications();
		setTimeout(() => {
			this.onSuccess.next(true);
		}, 350);

	}
}
