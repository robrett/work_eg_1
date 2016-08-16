import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { MembershipTermsConditionsComponent } from './terms_conditions.component';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
	],
	providers: [],
	declarations: [
		MembershipTermsConditionsComponent,
	],
	exports: [
		MembershipTermsConditionsComponent
	]
})
export class TermsConditionsModule { };
