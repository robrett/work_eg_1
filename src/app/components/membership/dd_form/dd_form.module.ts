import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../../shared/shared.module';;
import { DirectDebitFormComponent} from './dd_form.component';
import { IbanForm } from './../iban_form/iban_form';
import { DebitForm } from './../debit_form/debit_form';
import { AtomicComponentsModule} from './../../generic/atomic_components.module';
@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		AtomicComponentsModule
	],
	providers: [],
	declarations: [
		DirectDebitFormComponent,
		IbanForm,
		DebitForm
	],
	exports: [
		DirectDebitFormComponent
	]
})
export class DirectDebitModule { };
