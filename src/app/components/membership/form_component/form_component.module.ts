import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form_component.component';
import { AutoCompleteModule } from './../../generic/auto_complete/auto_complete.module';
import { TitleSelectorComponent } from './../title_selector/title_selector';
import { SelectorGroupModule } from './../../generic/selector/selector_group.module';
import { AtomicComponentsModule } from './../../generic/atomic_components.module';
import { InputMaskDirective } from './../../../shared/directives/format/mask';
import { MyAALoginDetectionDirective } from './../../../directives/myaa/myaa_login_detection.directive';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AutoCompleteModule,
		SelectorGroupModule,
		AtomicComponentsModule,
	],
	providers: [

	],
	declarations: [
		TitleSelectorComponent,
		FormComponent,
		InputMaskDirective,
		MyAALoginDetectionDirective
	],
	exports: [
		FormComponent
	]
})
export class FormComponentModule { }
