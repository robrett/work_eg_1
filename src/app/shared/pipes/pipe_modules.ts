import {FilterPipe} from './filter_pipe'
import {CurrencyPipe} from './currency_pipe';
import {AgePipe} from './age_pipe';
import {BenefitsFilter} from './benefits_filter';
import {PriceFrequencyPipe} from './pricing_frequency';

export * from './filter_pipe'
export * from './currency_pipe';
export * from './age_pipe';
export * from './benefits_filter';
export * from './pricing_frequency';

export var SHARED_PIPES: Array<any> = [
	CurrencyPipe,
	AgePipe,
	BenefitsFilter,
	PriceFrequencyPipe
];
