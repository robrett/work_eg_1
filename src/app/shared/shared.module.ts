import {
	NgModule,
	ModuleWithProviders,
	provide
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpModule, BrowserXhr } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import {CORSBrowserXHR } from './common/cookieRequest';

import {
	Analytics,
	Config,
	ErrorService,
	InitService,
	MyAAService,
	NotificationService,
	PaymentService,
	QuoteService,
	ReferenceService,
} from './../services/index';

import { AUTH_PROVIDERS } from './common/authHttp';
import { DataStore, UIStore } from './../stores/stores.modules';
import { FixedNavComponent } from './../components/membership/fixed_nav/fixed_nav';
import { FormComponentModule } from './../components/membership/form_component/form_component.module';
import { FullscreenPopupComponent } from './../components/generic/fullscreen_popup/fullscreen_popup';
import { HeaderComponent } from './../components/membership/header_component/header_component';
import { NotificationsModule } from './../components/membership/notifications/notifications.module';
import { OverViewComponent } from './../components/membership/overview/overview';
import { QuotesListComponent } from './../components/membership/quotes_list/quotes_list';
import { SHARED_DIRECTIVES } from './directives/directives.module';
import { SHARED_PIPES } from './pipes/pipe_modules';
import { TestimonialPopupComponent } from './../components/membership/testimonials_popup/p-testimonials';

@NgModule({
	imports: [
		CommonModule,
		FormComponentModule,
		NotificationsModule
	],
	declarations: [
		...SHARED_PIPES,
		...SHARED_DIRECTIVES,
		FixedNavComponent,
		OverViewComponent,
		HeaderComponent,
		QuotesListComponent,
		FullscreenPopupComponent,
		TestimonialPopupComponent
	],
	exports: [
		...SHARED_DIRECTIVES,
		...SHARED_PIPES,
		CommonModule,
		FixedNavComponent,
		FormComponentModule,
		FullscreenPopupComponent,
		HeaderComponent,
		HttpModule,
		NotificationsModule,
		OverViewComponent,
		QuotesListComponent,
		ReactiveFormsModule,
		TestimonialPopupComponent

	]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: [
				Analytics,
				AUTH_PROVIDERS,
				Config,
				DataStore,
				ErrorService,
				InitService,
				MyAAService,
				NotificationService,
				PaymentService,
				QuoteService,
				ReferenceService,
				UIStore,
				// Adds Cookie to Allow Http Requests - Maybe Remove this?
				provide(BrowserXhr, { useClass: CORSBrowserXHR }),
			]
		};
	}
}
