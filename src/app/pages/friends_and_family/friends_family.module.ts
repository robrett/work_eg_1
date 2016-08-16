import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../../shared/shared.module';
import { QuoteService } from './../../services/quote.service';
import { AddMemberCardModule } from './../../components/membership/add_member_card/';
import { MembershipFriendsAndFamilyPageComponent } from './friends_family.component';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		AddMemberCardModule
	],
	providers: [
		QuoteService
	],
	declarations: [
		MembershipFriendsAndFamilyPageComponent

	],
	exports: [
		MembershipFriendsAndFamilyPageComponent
	]
})
export class FriendsFamilyModule { };
