import {provide, ElementRef, EventEmitter, ViewQuery, QueryList, Component} from 'angular2/core';
import { Validators, ControlGroup, Control, NgControl, FormBuilder, FORM_DIRECTIVES, FORM_PROVIDERS } from 'angular2/common';
import {
    beforeEach,
    beforeEachProviders,
    describe,
    expect,
    it,
    inject,
    ComponentFixture,
    TestComponentBuilder,

} from 'angular2/testing';


import {ErrorButton} from './error_button';


@Component({
    selector: 'ErrorButtonTest',
    template: `<form [ngFormModel]="form" #f="ngForm" autocomplete="off"></form>
               <c-error-button [form]="form"></c-error-button>
    `,
    directives: [ErrorButton]
})
export class ErrorButtonTest {

    constructor(

    ) {

    }
}


describe('The Error Button Component', () => {


    let tcb,
        fb: FormBuilder;


    beforeEachProviders(() => [
        TestComponentBuilder,
        FormBuilder,
        ErrorButton
    ]);

    beforeEach(inject([TestComponentBuilder, FormBuilder], (_tcb, _fb) => {
        tcb = _tcb
        fb = _fb;
    }));

    it('should show an error', (done) => {
        var ctrl = new Control("", Validators.required);
        ctrl['field'] = {
            display: 'name'
        };
        var form = fb.group([ctrl]);

        tcb.createAsync(ErrorButton).then(fixture => {
            let errorButton: ErrorButton = fixture.componentInstance,
                element = fixture.nativeElement;
            errorButton.form = form;
            errorButton.form.controls[0].updateValueAndValidity('');
            errorButton.form.controls[0].markAsTouched();

            console.log(errorButton.form.controls[0]);
            var error: any = errorButton.errorMessage
            expect(error.message).toEqual('You must complete all fields')
            console.log(errorButton.errorMessage);
            done();
        }).catch(e => done.fail(e));

    })


    it('should return null, if no error message matches to a code', (done) => {
        var ctrl = new Control("", Validators.required);
        var form = fb.group([ctrl]);
        ctrl.field = {
            display: 'name'
        };
        tcb.createAsync(ErrorButton).then(fixture => {
            let errorButton: ErrorButton = fixture.componentInstance,
                element = fixture.nativeElement;
            var error = errorButton._errorMessage('invalidBIC', ctrl);
            expect(error).toEqual(null);
            done();
        }).catch(e => done.fail(e));
    })

    it('should return an error from an error code', (done) => {
        var ctrl = new Control("", Validators.required);
        var form = fb.group([ctrl]);
        ctrl.field = {
            display: 'name'
        };
        tcb.createAsync(ErrorButton).then(fixture => {
            let errorButton: ErrorButton = fixture.componentInstance,
                element = fixture.nativeElement;
            var error = errorButton._errorMessage('required', ctrl);
            expect(error).toEqual({ message: 'You must complete all fields', image: '' })
            done();
        }).catch(e => done.fail(e));
    })

    it('should emit an onContinue event on click', (done) => {
        tcb.createAsync(ErrorButton).then(fixture => {
            let errorButton: ErrorButton = fixture.componentInstance,
                element = fixture.nativeElement.querySelector('button');
            errorButton.onContinue.subscribe((e) => {
                expect(e).toBeTruthy();
                done();
            })
            element.click();
            
        }).catch(e => done.fail(e));
    })




});