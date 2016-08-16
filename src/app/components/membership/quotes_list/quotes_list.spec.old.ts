import {
	beforeEach,
	beforeEachProviders,
	describe,
	fakeAsync,
	it,
	tick,
	async,
	inject
} from '@angular/core/testing';

import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {QuotesList} from './quotes_list';
import {PLATFORM_PIPES, provide} from '@angular/core';
import {DIRECTIVES_MODULES} from './../../../directives/directives_modules';
import {Validators} from '@angular/common';
import {STORES_MODULES} from './../../../stores/stores_modules';
import {SHARED_MODULES} from './../../shared/shared_modules';
import {COMMON_MODULES} from './../../../common/common_modules';
import {SHARED_PIPES} from './../../../pipes/pipe_modules';
import {By} from '@angular/platform-browser';
import {dispatchEvent} from '@angular/platform-browser/testing';

describe('The Quotes List', () => {
	beforeEachProviders(() => [
		COMMON_MODULES,
		DIRECTIVES_MODULES,
		provide(PLATFORM_PIPES, { multi: true, useValue: SHARED_PIPES })
	]);
	// TODO: Create Tests When API is Implemented for Retrieve Quotes
	
});