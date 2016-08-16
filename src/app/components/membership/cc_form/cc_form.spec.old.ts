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
import {CreditCardForm} from './cc_form';
import {PLATFORM_PIPES, provide} from '@angular/core';
import {Validators} from '@angular/common';
import {STORES_MODULES} from './../../../stores/stores_modules';
import {COMMON_MODULES} from './../../../common/common_modules';
import {SHARED_PIPES} from './../../../pipes/pipe_modules';
import {By} from '@angular/platform-browser';
import {ProductService} from './../../../services/product_service';
import {MockProductService} from './../../../services/product_service.spec';
import {dispatchEvent} from '@angular/platform-browser/testing';
import {APPLICATION_PROVIDERS,PROVIDERS} from './../../../../platform/browser/providers';
import {ReferenceService} from './../../../services/reference_service';
import {TEST_PROVIDERS} from './../../../../platform/browser/testing';

describe('The Credit Card Form', () => {
	beforeEachProviders(() => [
		TEST_PROVIDERS
	]);

	it('should generate a form',
		inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
			tcb.createAsync(CreditCardForm)
				.then((fixture: ComponentFixture<CreditCardForm>) => {
					fixture.detectChanges();
					expect(fixture.debugElement.componentInstance.ccFields.length).toEqual(4);
					let formItems = fixture.debugElement.queryAll(By.css('form-component'));
					expect(formItems.length).toEqual(4);

				}).catch(err => { console.log(err); });
		}));


});

