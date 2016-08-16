import {
	beforeEach,
	beforeEachProviders,
	describe,
	fakeAsync,
	it,
expect,
	tick,
	async,
	inject
} from '@angular/core/testing';

import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {DebitForm} from './debit_form';
import {PLATFORM_PIPES, provide} from '@angular/core';
import {Validators} from '@angular/common';
import {STORES_MODULES} from './../../../stores/stores_modules';
import {COMMON_MODULES} from './../../../common/common_modules';
import {SHARED_PIPES} from './../../../pipes/pipe_modules';
import {By} from '@angular/platform-browser';
import {ProductService} from './../../../services/product_service';
import {MockProductService} from './../../../services/product_service.spec';
import {dispatchEvent} from '@angular/platform-browser/testing';

import {TEST_PROVIDERS} from './../../../../platform/browser/testing';


describe('The Debit Form', () => {
	beforeEachProviders(() => [
		TEST_PROVIDERS
	])
	it('should generate a form',
		inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
			tcb.createAsync(DebitForm)
				.then((fixture: ComponentFixture<DebitForm>) => {
					fixture.detectChanges();
					let formItems = fixture.debugElement.nativeElement.querySelectorAll('form-component');
					expect(formItems.length).toEqual(3);
					expect(fixture.debugElement.componentInstance.ccFields.length).toEqual(3);
				});
		}));

	
})

