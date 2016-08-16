import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteComponent } from './auto_complete.component';
import { AutoCompleteService } from './../../../services/autocomplete.service';
import { FilterPipe } from './../../../shared/pipes/filter_pipe';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule
	],
	providers: [
		AutoCompleteService
	],
	declarations: [
		FilterPipe,
		AutoCompleteComponent,
	],
	exports: [
		AutoCompleteComponent
	]
})
export class AutoCompleteModule { }
