import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectorGroup, SG_VALUE_ACCESSOR } from './selector_group';
import { Selector } from './selector';
import { SelectorDispatcher } from './selector_dispatcher';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
	],
	providers: [
		SelectorDispatcher,
		SG_VALUE_ACCESSOR
	],
	declarations: [
		Selector,
		SelectorGroup
	],
	exports: [
		SelectorGroup,
		Selector
	]
})
export class SelectorGroupModule { }
