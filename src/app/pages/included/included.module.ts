import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipIncludedPageComponent } from './included.component';
import { CheckboxCardComponent } from './../../components/membership/checkbox_card/checkbox_card';
import { AddonList } from './../../components/membership/addon_list/addon_list';
import { SharedModule } from './../../shared/shared.module';
import { QuoteService } from './../../services/quote.service';
import { ConfirmationToggleButtonDirective } from './../../shared/directives/buttons/confirmation_toggle.button';
import { FixedNavComponent } from './../../components/membership/fixed_nav/fixed_nav';

@NgModule({
	imports: [
		CommonModule,
		SharedModule
	],
	providers: [
		QuoteService
	],
	declarations: [
		MembershipIncludedPageComponent,
		CheckboxCardComponent,
		AddonList,
		ConfirmationToggleButtonDirective,
	],
	exports: [
		MembershipIncludedPageComponent
	]
})
export class IncludedModule { };
