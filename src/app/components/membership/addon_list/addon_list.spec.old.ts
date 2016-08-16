import {
	beforeEach,
	beforeEachProviders,
	describe,
	expect,
	fakeAsync,
	it,
	tick,
	async,
	inject
} from '@angular/core/testing';

import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {AddonList} from './addon_list';
import {PLATFORM_PIPES} from '@angular/core';
import {Validators} from '@angular/common';
import {COMMON_MODULES} from './../../../common/common_modules';
import {SHARED_PIPES} from './../../../pipes/pipe_modules';
import {By} from '@angular/platform-browser';
import {dispatchEvent} from '@angular/platform-browser/testing';
import {TEST_PROVIDERS} from './../../../../platform/browser/testing';

const BROWSER_SUPPORTS_EVENT_CONSTRUCTORS: boolean = (function () {
    // See: https://github.com/rauschma/event_constructors_check/blob/gh-pages/index.html#L39
    try {
        return new Event('submit', { bubbles: false }).bubbles === false &&
            new Event('submit', { bubbles: true }).bubbles === true;
    } catch (e) {
        return false;
    }
})();


const defaultBenefitList = [
	{
		"name": "ROADSIDERESCUE",
		"icon": "images/benefits/ROADSIDERESCUE.svg",
		"pkg": "default",
		"description": "Roadside Rescue"
	},
	{
		"name": "24-7EMERGENCYCOVER",
		"icon": "images/benefits/24-7EMERGENCYCOVER.svg",
		"pkg": "default",
		"description": "24/7 Emergency Cover"
	},
	{
		"name": "ANYVEHICLECOVER",
		"icon": "images/benefits/ANYVEHICLECOVER.svg",
		"pkg": "default",
		"description": "Any vehicle cover"
	},
	{
		"name": "UKCOVER",
		"icon": "images/benefits/UKCOVER.svg",
		"pkg": "default",
		"description": "UK Cover"
	},
	{
		"name": "FUELSAVERCARD",
		"icon": "images/benefits/FUELSAVERCARD.svg",
		"pkg": "default",
		"description": "Fuel Saver Card"
	},
	{
		"name": "AAREWARDS",
		"icon": "images/benefits/AAREWARDS.svg",
		"pkg": "default",
		"description": "AA Rewards"
	},
	{
		"name": "DUMMY",
		"icon": "images/benefits/DUMMY.svg",
		"pkg": "default",
		"description": "Shouldn't show, is a dummy"
	}
];


describe('The Addon List', () => {

	beforeEachProviders(() => [
		TEST_PROVIDERS
	]);

	it('should be able to generate a list of addons',
		inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
			tcb.createAsync(AddonList)
				.then((fixture: ComponentFixture<AddonList>) => {
					fixture.debugElement.componentInstance.data = defaultBenefitList;
					fixture.detectChanges();
					let benefits = fixture.debugElement.nativeElement.querySelectorAll('.m-addon-list__benefits li');
					expect(benefits.length).toEqual(6);

				});
		}));
})