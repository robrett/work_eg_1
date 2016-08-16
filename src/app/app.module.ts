import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef, APP_INITIALIZER } from '@angular/core';
import { IncludedModule } from './pages/included/index';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { appRoutingProviders, routing } from './app.routes';
import { FriendsFamilyModule } from './pages/friends_and_family/';
import { YourDetailsModule } from './pages/your_details/your_details.module';
import { BreakdownModule } from './pages/breakdown/';
import { PaymentModule } from './pages/payment/';
import { TermsConditionsModule } from './pages/terms_conditions/';
import { InitService } from './services/init.service';
import { SharedModule } from './shared/shared.module';
import { ConfirmationModule } from './pages/confirmation/';
import { Dispatcher } from './shared/common/index';

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		CommonModule,
		SharedModule.forRoot(),
		IncludedModule,
		FriendsFamilyModule,
		YourDetailsModule,
		BreakdownModule,
		TermsConditionsModule,
		PaymentModule,
		ConfirmationModule,
		routing
	],
	providers: [
		Dispatcher,
		InitService,
		appRoutingProviders,
	],
	entryComponents: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {

}
