import {
	NgModule,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ShowErrorComponent } from './show_error/show_error';
import { ErrorButtonComponent } from './error_button/error_button';
import { TabGroupModule } from './tab/tab_group.module';
import { SelectorGroupModule } from './selector/selector_group.module';
import { AccordianModule } from './accordian/accordian.module';

@NgModule({
	imports: [
		CommonModule,
		TabGroupModule,
		SelectorGroupModule,
		AccordianModule
	],
	declarations: [
		ShowErrorComponent,
		ErrorButtonComponent,

	],
	exports: [
		ShowErrorComponent,
		ErrorButtonComponent,
		TabGroupModule,
		SelectorGroupModule,
		AccordianModule
	]
})
export class AtomicComponentsModule {}
