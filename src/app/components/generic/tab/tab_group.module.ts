import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TabGroup } from './tab_group';
import { Tab } from './tab';
import { TabsDispatcher } from './tab_dispatcher';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
	],
	providers: [
		TabsDispatcher
	],
	declarations: [
		Tab,
		TabGroup
	],
	exports: [
		TabGroup,
		Tab
	]
})
export class TabGroupModule { }
