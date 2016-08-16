import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { MembershipConfirmationPageComponent } from './confirmation.component';
import { AtomicComponentsModule } from './../../components/generic/atomic_components.module';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		AtomicComponentsModule
	],
	providers: [],
	declarations: [
		MembershipConfirmationPageComponent,
	],
	exports: [
		MembershipConfirmationPageComponent
	]
})
export class ConfirmationModule { };
