import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordianPanelComponent  } from './accordian_panel';
import { AccordianComponent } from './accordian';
@NgModule({
	imports: [
		CommonModule,
	],
	providers: [],
	declarations: [
		AccordianPanelComponent,
		AccordianComponent
	],
	exports: [
		AccordianComponent,
		AccordianPanelComponent
	]
})
export class AccordianModule { };
