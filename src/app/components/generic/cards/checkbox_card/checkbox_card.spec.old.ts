import {provide, ElementRef, DebugElement, PLATFORM_DIRECTIVES} from 'angular2/core';
import {
    fakeAsync,
    inject,
    async,
    tick,
    ComponentFixture,
    TestComponentBuilder,
    beforeEachProviders
} from 'angular2/testing';

import {dispatchEvent} from 'angular2/testing_internal';
import {Collapse} from './../../../../directives/generic/collapse';

import {
    it,
    describe,
    expect,
    beforeEach,
} from 'angular2/testing';

import {By} from 'angular2/platform/browser';

import {CheckboxCard} from './checkbox_card';


describe('Checbox Card', () => {
    var builder: TestComponentBuilder;

    beforeEachProviders(() => [
       provide(PLATFORM_DIRECTIVES, { useValue: Collapse, multi: true }) 
    ])    

    beforeEach(inject([TestComponentBuilder], function(tcb: TestComponentBuilder) {
        builder = tcb;
    }));

    it('should have a header', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(checkboxContainer).then(
            (fixture: ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.debugElement.query(By.css('.c-checkbox-card__header div h1')).nativeElement).toHaveText('Hello I am a title');
            }
        )
    })));
    it('should have content', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(checkboxContainer).then(
            (fixture: ComponentFixture) => {
                fixture.detectChanges();
                expect(fixture.debugElement.query(By.css('.c-checkbox-card__content h1')).nativeElement).toHaveText('Hello I am Content');
            }
        )
    })));

})


import {Component} from 'angular2/core';
@Component({
    template: `<c-checkbox-card (onSelect)="selectAddon($event)" [selected]="option.active" [disabled]="option.disabled">
        <div title>
            <h1>Hello I am a title</h1>
       </div>
        <div content>
            <h1>Hello I am Content</h1>
        </div>
    </c-checkbox-card>`,
    directives: [CheckboxCard, Collapse]
})
class checkboxContainer {
    option: any;
    ind: number = 0;
    constructor() {
        this.option = {
            active: false,
            disabled: false,
            name: 'testCheckbox'
            
        }
    }
}