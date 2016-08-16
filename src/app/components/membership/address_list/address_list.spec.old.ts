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
import {AddressList} from './address_list';
import {PLATFORM_PIPES, provide} from '@angular/core';
import {Validators} from '@angular/common';
import {COMMON_MODULES} from './../../../common/common_modules';
import {SHARED_PIPES} from './../../../pipes/pipe_modules';
import {By} from '@angular/platform-browser';
import {BaseRequestOptions, Response, ResponseOptions, Http} from '@angular/http';
import {dispatchEvent} from '@angular/platform-browser/testing';
import {ReferenceService} from './../../../services/reference_service';
import {MockBackend, MockConnection} from '@angular/http/testing';

import {NotificationService} from './../../../services/notifications_service';


import {APPLICATION_PROVIDERS,PROVIDERS} from './../../../../platform/browser/providers';

const addressRes = {
	"address1": "8 ravensdale road",
	"address2": "",
	"county": "Dublin 3",
	"area": "East Wall",
	"lookups": [
		{
			"id": 0,
			"address": "8 Ravensdale Road,East Wall,Dublin 3"
		}, {
			"id": 1,
			"address": "8 Ravensdale Road,East Wall,Dublin 3"
		}]
};

describe('The Address List', () => {
	let mockbackend, service, builder;

	beforeEachProviders(() => [
		APPLICATION_PROVIDERS,
		PROVIDERS,
		ReferenceService,
		MockBackend,
		NotificationService,
		BaseRequestOptions,
		provide(Http, {
			useFactory: (backend, options) => new Http(backend, options),
			deps: [MockBackend, BaseRequestOptions]
		})
	]);

	beforeEach(inject([MockBackend, ReferenceService, TestComponentBuilder], (_mockbackend, _service, _tcb) => {
		mockbackend = _mockbackend;
		service = _service;
		builder = _tcb;
	}));

	it('should detect changes to the visibility input and trigger callbacks to display address', (done: () => void) => {
		return builder.createAsync(AddressList)
			.then((fixture: ComponentFixture<AddressList>) => {
				mockbackend.connections.subscribe(connection => {
					connection.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(addressRes) })));
				});

				fixture.debugElement.componentInstance.onReadyValid.subscribe(next => {
					fixture.detectChanges();
					let item = fixture.debugElement.nativeElement.querySelector('button.o-slot');
					expect(item).toBeDefined();
					done();
				});
				fixture.debugElement.componentInstance.addressToValidate.next('test');
				done();
			});
	});

	it('should be able to get a list of addresses from the reference service', (done: () => void) => {
		return builder.createAsync(AddressList)
			.then((fixture: ComponentFixture<AddressList>) => {
				mockbackend.connections.subscribe(connection => {
					connection.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(addressRes) })));
				});

				fixture.debugElement.componentInstance.onReadyValid.subscribe(next => {
					expect(fixture.debugElement.componentInstance.addList.length).toEqual(2);
					done();
				});
				fixture.debugElement.componentInstance.addressToValidate.next('test');
			});
	});

	it('should be able to set an address', (done: () => void) => {
		return builder.createAsync(AddressList)
			.then((fixture: ComponentFixture<AddressList>) => {
				mockbackend.connections.subscribe(connection => {
					connection.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(true) })));
				});
				fixture.debugElement.componentInstance.onValid.subscribe(next => {
					expect(next).toBeTruthy();
					done();
				});
				fixture.debugElement.componentInstance.setAddress(0);

			});
	});

});

