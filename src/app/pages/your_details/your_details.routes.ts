import { Routes } from '@angular/router';
import { MembershipYourDetailsPageComponent } from './your_details.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';
import { CanDeactivateGuard } from './../../shared/directives/guards/canDeactivateYourDetails';
export const YourDetailsRoutes: Routes = [
	{
		path: 'your_details',
		component: MembershipYourDetailsPageComponent,
		resolve: { config: ConfigResolveGuard },
		canDeactivate: [CanDeactivateGuard]
	}
];
