import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { MembershipPaymentPageComponent } from './payment.component';
import { DirectDebitModule } from './../../components/membership/dd_form/dd_form.module';
import { CreditCardFormComponent } from './../../components/membership/cc_form/cc_form';
import { PaymentAgreementComponent } from './../../components/membership/payment_agreement/payment_agreement';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		DirectDebitModule
	],
	providers: [],
	declarations: [
		MembershipPaymentPageComponent,
		CreditCardFormComponent,
		PaymentAgreementComponent
	],
	exports: [
		MembershipPaymentPageComponent
	]
})
export class PaymentModule { };
