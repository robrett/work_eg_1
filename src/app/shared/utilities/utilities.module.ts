import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Utils } from './utilities.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		Utils
	],
	exports: [
		Utils
	]
})
export class UtilitesModule { };
