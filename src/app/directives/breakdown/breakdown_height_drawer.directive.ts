import { Directive, Input, OnChanges, HostBinding} from '@angular/core';
@Directive({
	selector: '[breakdownHeightDrawer]',
})

export class BreakdownDrawerItemDirective implements OnChanges {
	@Input('breakdownHeightDrawer') breakdownHeightDrawer: any;
	@HostBinding('style.transform') get transformVal() { return this.transformValue; };
	@Input() isVisible: boolean;
	private transformValue: string;

	ngOnChanges() {
		if (this.isVisible) {
			this.transformValue = `translate3d(0,-${this.breakdownHeightDrawer}px,0)`;
		} else {
			this.transformValue = `translate3d(0,0,0)`;
		}
	}


}
