import { Routes } from '@angular/router';
import { MembershipFriendsAndFamilyPageComponent } from './friends_family.component';
import { ConfigResolveGuard } from './../../shared/directives/guards/resolve_config_guard';

export const FriendsFamilyRoutes: Routes = [
	{ path: 'friends_and_family', component: MembershipFriendsAndFamilyPageComponent, resolve: { config: ConfigResolveGuard} }
];
