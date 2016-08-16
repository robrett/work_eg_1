import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdditionalMemberCardComponent } from './add_member_card.component';
import { SharedModule } from './../../../shared/shared.module';
import { AtomicComponentsModule } from './../../generic/atomic_components.module';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		ReactiveFormsModule,
		AtomicComponentsModule
	],
	providers: [

	],
	declarations: [
		AdditionalMemberCardComponent,

	],
	exports: [
		AdditionalMemberCardComponent
	]
})
export class AddMemberCardModule { }
