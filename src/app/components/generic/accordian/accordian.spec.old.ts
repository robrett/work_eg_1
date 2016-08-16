import {provide, ElementRef, Component, DebugElement} from 'angular2/core';
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

import {Router} from 'angular2/router';
import {DOM} from 'angular2/src/platform/dom/dom_adapter';
import {SHARED_PIPES} from './../../../pipes/pipe_modules'
import {Dispatcher} from './../../../common/common_modules';
import {MockRouter} from './../../../../../test/test-helpers/router';
import {UIStore, DataStore} from './../../../stores/stores_modules';
import {SHARED_MODULES} from './../shared_modules';
import {Transitions} from './../../animations/transitions';
import {Utils} from './../../../common/utilities';
import {Accordian, AccordianPanel} from './accordian_modules';
import {By} from 'angular2/platform/browser';

@Component({
    selector: 'accordian',
    template: `<c-accordian>
            <c-accordian-panel>
                <header>How can I change my details?</header>
                <content>Content</content>
            </c-accordian-panel>
        </c-accordian>`,
    directives: [Accordian, AccordianPanel]
})
export class AccordianTest { }



describe('The accordian component', () => {

    var fixture: ComponentFixture;

    beforeEachProviders(() => [
        SHARED_MODULES, Accordian, AccordianPanel
    ]);

    it('should be able to render the autocomplete', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(AccordianTest).then(
            (componentFixture: ComponentFixture) => {
                fixture = componentFixture;
                fixture.detectChanges();
                console.log(fixture.nativeElement);

            }
        )
    })))

    it('should select the panel on click', () => {
        let testComponent = fixture.debugElement;
        let header = fixture.debugElement.query(By.css(".c-accordian-panel__header"));
        let panel = fixture.debugElement.query(By.css('.c-accordian-panel__content'));        
        expect(panel.nativeElement).toHaveCssClass('isCollapsed');
        header.nativeElement.click();
        fixture.detectChanges();
        expect(panel.nativeElement).not.toHaveCssClass('isCollapsed');

    })

    // Todo: Write test to check that the panel contains the right header
    // Todo: Write test to check the panel contains the right content

    describe('the accordian', () => {

        let accordian;
        let panel;

        beforeEach(() => {
            accordian = new Accordian();
            panel = new AccordianPanel(accordian);
        })
        it('should contain the panel', () => {
            expect(accordian.panels.length).toBe(1);
        })

        it('should be able to add another panel', () => {
            accordian.addPanel(new AccordianPanel(accordian));
            expect(accordian.panels.length).toBe(3);
        })
        it('should start in a collapsed state', () => {
            expect(accordian.panels[0].isCollapsed).toBeTruthy();
        })
        it('should be able to toggle to a non collapsed state', () => {
            expect(accordian.panels[0].isCollapsed).toBeTruthy();
            accordian.panels[0].toggle();
            expect(accordian.panels[0].isCollapsed).toBeFalsy();
        })
    })
});