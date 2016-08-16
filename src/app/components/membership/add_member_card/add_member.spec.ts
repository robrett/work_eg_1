import {
	beforeEach,
	beforeEachProviders,
	describe,
	expect,
	fakeAsync,
	it,
	tick,
	async,
	inject,
	addProviders
} from '@angular/core/testing';

import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {AdditionalMemberCard} from './add_member_card';
import {PLATFORM_PIPES} from '@angular/core';
import {Validators} from '@angular/common';
import {ProductService} from './../../../services/services_modules';
import {SHARED_PIPES} from './../../../pipes/pipe_modules';
import {APP_SERVICES} from './../../../services/services_modules';
import {STORES_MODULES} from './../../../stores/stores_modules';
import {COMMON_MODULES} from './../../../common/common_modules';
import {MockProductService} from './../../../services/product_service.spec';
import {By} from '@angular/platform-browser';
import {SHARED_MODULES} from './../../shared/shared_modules';
import {TestUtils} from './../../../../../test/test-helpers/testUtils';

import {APPLICATION_PROVIDERS, PROVIDERS} from './../../../../platform/browser/providers';
import {TEST_PROVIDERS} from './../../../../platform/browser/testing';
const defaultMemberJson = {
    index: 2,
	type: "adults",
	typeDisplay: "Adult",
	minAge: 17,
	maxAge: 200,
	price: {
		amount: 425,
		str: "4.25",
		symbol: "€",
		currency: "EUR",
		pretty: "€4.25"
	},
    fields: [
        {
			"name": "firstName",
			"label": "First Name",
			"placeholder": "Joe",
			"type": "text",
			"validation": ["required"]
		},
        {
			"name": "surname",
			"label": "Last Name",
			"placeholder": "Bloggs",
			"type": "text",
			"validation": ["required"]
		},
        {
			"name": "dateOfBirth",
			"label": "Date of Birth",
			"placeholder": "dd/mm/yyyy",
			"type": "date",
			"validation": ["required"]
		}]
}

describe("The Add Member Card", () => {
	addProviders(TEST_PROVIDERS);	

	it('should have an initial state',
		inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
			tcb
				.createAsync(AdditionalMemberCard)
				.then((fixture) => {
					expect(fixture.debugElement.componentInstance.state).toEqual({
						placeholder: false,
						valid: false
					});
				});
		}));
	it('should have a placeholder state',
		inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
			tcb.createAsync(AdditionalMemberCard)
				.then((fixture: ComponentFixture<AdditionalMemberCard>) => {
					fixture.debugElement.componentInstance.data = defaultMemberJson;
					fixture.detectChanges();
					expect(fixture.debugElement.componentInstance.state).toEqual({
						placeholder: true,
						valid: false
					});
					expect(fixture.debugElement.nativeElement).toHaveCssClass('isPlaceholder');
				});
		}));
	it('should have a form with three controls',
		inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
			tcb.createAsync(AdditionalMemberCard)
				.then((fixture: ComponentFixture<AdditionalMemberCard>) => {
					fixture.debugElement.componentInstance.data = defaultMemberJson;
					fixture.detectChanges();
					expect(fixture.debugElement.componentInstance.form.contains('firstName')).toBeTruthy();
					expect(fixture.debugElement.componentInstance.form.contains('surname')).toBeTruthy();
					expect(fixture.debugElement.componentInstance.form.contains('dateOfBirth')).toBeTruthy();
					fixture.debugElement.componentInstance.setEditable();
					fixture.detectChanges();
					let fNameInput = fixture.debugElement.query(By.css('.fc--firstName input')).nativeElement;
					expect(fNameInput).toBeDefined();
					let lNameInput = fixture.debugElement.query(By.css('.fc--surname input')).nativeElement;
					expect(lNameInput).toBeDefined();
					let dateOfBirthInput = fixture.debugElement.query(By.css('.fc--dateOfBirth input')).nativeElement;
					expect(dateOfBirthInput).toBeDefined();

				});
		}));
	it('should be able to enter an editing state',
		inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
			tcb.createAsync(AdditionalMemberCard)
				.then((fixture: ComponentFixture<AdditionalMemberCard>) => {
					fixture.debugElement.componentInstance.data = defaultMemberJson;
					fixture.detectChanges();
					fixture.debugElement.componentInstance.setEditable();
					fixture.detectChanges();
					expect(fixture.debugElement.componentInstance.state).toEqual({
						placeholder: false,
						valid: false
					});
					expect(fixture.nativeElement).toHaveCssClass('isEditing');

				});
		}));


	it('should refuse to save if the form is invalid',
		inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
			tcb.createAsync(AdditionalMemberCard)
				.then((fixture: ComponentFixture<AdditionalMemberCard>) => {

				});
		}));

	it('should be able to save a valid member',
		inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
			tcb.createAsync(AdditionalMemberCard)
				.then((fixture: ComponentFixture<AdditionalMemberCard>) => {
					fixture.debugElement.componentInstance.data = defaultMemberJson;
					fixture.detectChanges();
					fixture.debugElement.componentInstance.setEditable();
					fixture.detectChanges();
					// Input User Details
					let fNameInput = fixture.debugElement.query(By.css('.fc--firstName input')).nativeElement;
					fNameInput.value = 'Ronan';
					TestUtils.fireEvent(fNameInput, 'input');
					let lNameInput = fixture.debugElement.query(By.css('.fc--surname input')).nativeElement;
					lNameInput.value = 'Brett';
					TestUtils.fireEvent(lNameInput, 'input');
					let dateOfBirthInput = fixture.debugElement.query(By.css('.fc--dateOfBirth input')).nativeElement;
					dateOfBirthInput.value = '29/12/1987';
					TestUtils.fireEvent(dateOfBirthInput, 'input');
					fixture.debugElement.query(By.css('c-error-button button')).nativeElement.click();
					// Normally Called from Event Fired from OnSave
					fixture.componentInstance.saveMember();
					fixture.detectChanges();
					expect(fixture.debugElement.nativeElement).toHaveCssClass('isValid');
				});
		}));

	describe('async tests', () => {
		let builder: TestComponentBuilder;

		beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
			builder = tcb;
		}));

		it('should not be able to save an invalid member', (done: () => void) => {
			return builder.createAsync(AdditionalMemberCard).then(fixture => {
				fixture.debugElement.componentInstance.data = defaultMemberJson;
				fixture.detectChanges();
				fixture.debugElement.componentInstance.setEditable();
				fixture.detectChanges();
				let fNameInput = fixture.debugElement.query(By.css('.fc--firstName input')).nativeElement;
				fNameInput.value = 'Ronan';
				TestUtils.fireEvent(fNameInput, 'input');
				
				fixture.debugElement.query(By.css('c-error-button')).componentInstance.onContinue.subscribe((next) => {
					expect(fixture.nativeElement).toHaveCssClass('isEditing');
					expect(fixture.debugElement.query(By.css('.fc--surname input')).nativeElement)
						.toHaveCssClass('ng-invalid');
					expect(fixture.debugElement.query(By.css('.fc--dateOfBirth input')).nativeElement)
						.toHaveCssClass('ng-invalid');
					done();
				});
				TestUtils.click(fixture.debugElement.query(By.css('c-error-button button')), fixture);
				fixture.detectChanges();

			});
		});
	});

});

