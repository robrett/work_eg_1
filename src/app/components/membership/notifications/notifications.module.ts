import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification';
import { NotificationLoginComponent } from './notification_login/notification_login';
import { NotificationBarComponent } from './notifications_bar/notifications_bar';
import { ReactiveFormsModule } from '@angular/forms';
import {FormComponentModule } from './../form_component/form_component.module';
import { NotificationConfirmationComponent } from './notification_confirmation/notification_confirmation';
import {AtomicComponentsModule } from './../../generic/atomic_components.module';
// Needs Error Button
@NgModule({
	imports: [
		CommonModule,
		FormComponentModule,
		ReactiveFormsModule,
		AtomicComponentsModule
	],
	providers: [],
	declarations: [
		NotificationComponent,
		NotificationLoginComponent,
		NotificationBarComponent,
		NotificationConfirmationComponent
	],
	exports: [
		NotificationComponent,
		NotificationLoginComponent,
		NotificationBarComponent,
		NotificationConfirmationComponent
	]
})
export class NotificationsModule { };
