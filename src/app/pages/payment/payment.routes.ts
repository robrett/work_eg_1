import { Routes } from '@angular/router';
import { MembershipPaymentPageComponent } from './payment.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';

export const PaymentRoutes: Routes = [
	{ path: 'payment', component: MembershipPaymentPageComponent, resolve: { config: ConfigResolveGuard} }
];
