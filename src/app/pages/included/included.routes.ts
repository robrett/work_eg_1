import { Routes } from '@angular/router';
import { MembershipIncludedPageComponent } from './included.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';

export const IncludedRoutes: Routes = [
	{ path: '', component: MembershipIncludedPageComponent, resolve: { config: ConfigResolveGuard} }
];
