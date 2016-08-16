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
import {TEST_PROVIDERS} from './../../../../platform/browser/testing';
import {By} from '@angular/platform-browser';
import {AutoComplete} from './auto_complete_modules';

describe('The Autocomplete component', () => {
	let builder: TestComponentBuilder;
	beforeEachProviders(() => [
		TEST_PROVIDERS
	]);
	beforeEach(inject([TestComponentBuilder], (_tcb) => {
		builder = _tcb;
	}));

	it('should be able to generate an autocomplete component', () => {
		return builder.createAsync(AutoCompleteTest)
			.then((fixture: ComponentFixture<AutoCompleteTest>) => {
				fixture.detectChanges();
				console.log(fixture);
			});
	});
		
});


/**
 * 	Autocomplete Test Component
 */

import {Component} from '@angular/core';
import {ControlGroup, FormBuilder, FORM_DIRECTIVES} from '@angular/common';
import {SHARED_MODULES} from './../shared_modules';
import {AutoCompleteService} from './../../../services/autocomplete_service';

@Component({
    selector: 'autocomplete-test',
    template: `<form [ngFormModel]="form" #f="ngForm" autocomplete="off">
        <form-component 
			class="c-form-component--default" 
			*ngFor="let e of fields" 
			[field]="e" 
			[control]="e.name" 
			[placeholder]="e.placeholder" 
			[type]="e.type">
		</form-component>
    </form>`,
	providers: [AutoCompleteService],
    directives: [FORM_DIRECTIVES, SHARED_MODULES]
})
export class AutoCompleteTest {
    form: ControlGroup;
    fields: any;
    ctrls: any = {};
    placeholder: string = 'Autocomplete Test';
    data: any = 'town';
    control: any;

    constructor(fb: FormBuilder) {
        this.fields = [{
            name: 'area',
            data: 'areas',
            label: 'Town',
            placeholder: '',
            type: 'autocomplete'
        }];
        _.forEach(this.fields, (e: JourneyField) => {
            this.ctrls[e.name] = ["", null, null];
		});
        this.form = fb.group(this.ctrls);
    }
}
