import {provide, ElementRef, ComponentRef, EventEmitter, ViewQuery, QueryList, Component} from 'angular2/core';
import { Validators, ControlGroup, Control, NgControl, FormBuilder, NgFormModel, FORM_DIRECTIVES, FORM_PROVIDERS } from 'angular2/common';
import {
    beforeEach,
    beforeEachProviders,
    describe,
    expect,
    it,
    inject,
    ComponentFixture,
    async,
    TestComponentBuilder,

} from 'angular2/testing';


import {PLATFORM_PIPES} from 'angular2/core';
import {FormComponent} from './form_component';
import {FilterPipe} from './../../../pipes/filter_pipe';
import {By} from 'angular2/platform/browser';


import {Selector, SelectorGroup, SelectorDispatcher} from './../selector/selector_modules';
import {AutoComplete} from './../auto_complete/auto_complete_modules';
import {AASignIn} from './../aa_signin/aa_signin';
import {EmailInput} from './../inputs/email/email_input';

@Component({
    selector: 'FormComponentTest',
    template: `
        <form [ngFormModel]="form" #f="ngForm">
            <form-component type="text" [control]="'firstName'" [field]="fieldEntry" [placeholder]="placeholder"></form-component>
        </form>
        `,
    directives: [FormComponent, FORM_DIRECTIVES]
})
export class FormComponentTest {
    fieldEntry: any;
    form: ControlGroup;
    ctrls: any = [];
    placeholder: any;
    type: any;

    constructor(
        fb: FormBuilder,
        @ViewQuery(FormComponent) public formComponent: QueryList<any>
    ) {
        this.placeholder = 'First Name'
        this.fieldEntry = {
            display: 'First Name'
        }
        this.ctrls['firstName'] = ["", Validators.required];
        this.form = fb.group(this.ctrls);
    }
}

describe('The Form Component', () => {

    describe('integration tests', () => {


        let tcb: TestComponentBuilder;

        beforeEachProviders(() => [
            provide(PLATFORM_PIPES, { useValue: FilterPipe, multi: true }),
            FORM_DIRECTIVES,
            NgFormModel,
            EmailInput,
            Selector,
            SelectorGroup,
            SelectorDispatcher,
            TestComponentBuilder,
            FormComponent
        ]);

        beforeEach(inject([TestComponentBuilder], _tcb => {
            tcb = _tcb
        }));

        it('should add a class to the element', (done) => {
            let t = `
                <form [ngFormModel]="form"  #f="ngForm">
                    <form-component [control]="'firstName'" [field]="fieldEntry" [placeholder]="placeholder" [type]="type"></form-component>
                </form>
        `
            tcb.overrideTemplate(FormComponentTest, t).createAsync(FormComponentTest).then((fixture: ComponentFixture) => {
                let formComponent: FormComponentTest = fixture.componentInstance,
                    element = fixture.nativeElement;

                formComponent.type = 'text';
                fixture.detectChanges();

                let input = fixture.debugElement.query(By.css('form-component'));
                expect(input.nativeElement).toHaveCssClass('fc--firstName')

                done()
            }).catch(e => done.fail(e));
        })

        it('should be able to create a text input', (done) => {
            let t = `
        <form [ngFormModel]="form"  #f="ngForm">
            <form-component [control]="'firstName'" [field]="fieldEntry" [placeholder]="placeholder" [type]="type"></form-component>
        </form>
        `
            tcb.overrideTemplate(FormComponentTest, t).createAsync(FormComponentTest).then((fixture: ComponentFixture) => {

                let formComponent: FormComponentTest = fixture.componentInstance,
                    element = fixture.nativeElement;
                formComponent.type = 'text';
                fixture.detectChanges();

                let input = fixture.debugElement.query(By.css('input'));
                expect(input.attributes.get('type')).toEqual('text');
                expect(input.properties.get('placeholder')).toEqual('First Name')

                done()
            }).catch(e => done.fail(e));

        })

        it('should be able to create a date input', (done) => {
            let t = `
        <form [ngFormModel]="form"  #f="ngForm">
            <form-component [control]="'firstName'" [field]="fieldEntry" [placeholder]="placeholder" [type]="type"></form-component>
        </form>
        `
            tcb.overrideTemplate(FormComponentTest, t).createAsync(FormComponentTest).then((fixture: ComponentFixture) => {
                let formComponent: FormComponentTest = fixture.componentInstance,
                    element = fixture.nativeElement;

                formComponent.type = 'date';
                fixture.detectChanges();

                let input = fixture.debugElement.query(By.css('input'));
                expect(input.attributes.get('type')).toEqual('tel');

                done()
            }).catch(e => done.fail(e));

        })

        it('should be able to create a number input', (done) => {
            let t = `
        <form [ngFormModel]="form"  #f="ngForm">
            <form-component [control]="'firstName'" [field]="fieldEntry" [placeholder]="placeholder" [type]="type"></form-component>
        </form>
        `
            tcb.overrideTemplate(FormComponentTest, t).createAsync(FormComponentTest).then((fixture: ComponentFixture) => {

                let formComponent: FormComponentTest = fixture.componentInstance,
                    element = fixture.nativeElement;

                formComponent.placeholder = 'Date of Birth'
                formComponent.type = 'number';
                fixture.detectChanges();

                let input = fixture.debugElement.query(By.css('input'));
                expect(input.attributes.get('type')).toEqual('tel');
                expect(input.properties.get('placeholder')).toEqual('Date of Birth');

                done()
            }).catch(e => done.fail(e));

        })

    })
    describe('unit tests', () => {

        
        let tcb: TestComponentBuilder;
        let component: FormComponent;
        var formModel: ControlGroup;

        beforeEachProviders(() => [
            provide(PLATFORM_PIPES, { useValue: FilterPipe, multi: true }),
            ElementRef,
            TestComponentBuilder,
            NgFormModel
        ]);



        beforeEach(async(inject([TestComponentBuilder, ElementRef, NgFormModel], (
            _tcb, el, form: NgFormModel
        ) => {
            return _tcb.createAsync(FormComponentTest).then(fixture => {

                formModel = new ControlGroup({
                    "test": new Control("")
                });
                form.form = formModel;
                fixture.detectChanges();
                component = new FormComponent(fixture, form);
            })


        })));

        it('should have be able to link to a control', () => {

            component.controlPath = "test";
            component.field = { value: 'test' };
            expect(component.control).toBeUndefined();

            component.ngOnInit();

            expect(component.control).toBeDefined();
            expect(component.field).toEqual({ value: 'test' });
        })

    })




});