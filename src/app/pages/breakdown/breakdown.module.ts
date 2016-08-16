import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { QuoteService } from './../../services/quote.service';
import { MembershipPriceBreakdownPageComponent } from './breakdown.component';
import { BreakdownDrawerItemDirective } from './../../directives/breakdown/breakdown_height_drawer.directive';
import { MyAASaveQuoteSignInComponent } from './../../components/membership/myAA_signin/myAA_signin.component';
import { AtomicComponentsModule } from './../../components/generic/atomic_components.module';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		AtomicComponentsModule
	],
	providers: [
		QuoteService
	],
	declarations: [
		MembershipPriceBreakdownPageComponent,
		BreakdownDrawerItemDirective,
		MyAASaveQuoteSignInComponent

	],
	exports: [
		MembershipPriceBreakdownPageComponent
	]
})
export class BreakdownModule { };
