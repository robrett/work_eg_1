import {Component} from '@angular/core';
import {AccordianPanelComponent} from './accordian_panel';

let template = require('./accordian.html');

/**
 *  Accordian Component
 *
 *  Creates an Accordian with an array of Child AccordianPanel Components
 *
 *  ### Example of an accordian
 *  ````
 *  <c-accordian>
 *      <c-accordian-panel>
 *          <header>Panel Header</header>
 *          <content>Panel Content</content>
 *      </c-accordian-panel>
 *  </c-accordian>
 *  ````
 *
 *  
 */


@Component({
	selector: 'c-accordian',
	template: template
})

export class AccordianComponent {
	// Array of Child Accordian Panels
	panels: any;
	// Currently Selected Panel
	selected: Number = 0;

	constructor() {
		this.panels = [];
	}

	/**
	 *  Function called from within the child component that adds the panel
	 *  to the array of panels
	 */
	addPanel(panel: AccordianPanelComponent) {
		this.panels.push(panel);
	}

}
