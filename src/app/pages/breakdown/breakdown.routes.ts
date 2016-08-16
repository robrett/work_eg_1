import { Routes, CanActivate } from '@angular/router';
import { MembershipPriceBreakdownPageComponent } from './breakdown.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';
import { CanActivateQuote} from './../../shared/directives/guards/canActivateQuote';
export const BreakdownRoutes: Routes = [
	{
		path: 'breakdown',
		component: MembershipPriceBreakdownPageComponent,
		resolve: { config: ConfigResolveGuard},
		canActivate: [CanActivateQuote]
	}
];
