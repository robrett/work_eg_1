import { Routes } from '@angular/router';
import { MembershipTermsConditionsComponent } from './terms_conditions.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';

export const TermsConditionsRoutes: Routes = [
	{ path: 'terms_and_conditions', component: MembershipTermsConditionsComponent, resolve: { config: ConfigResolveGuard } },
	{ path: 'terms_and_conditions/:type',  component: MembershipTermsConditionsComponent, resolve: { config: ConfigResolveGuard } },
];
