import { environment } from './environments/environment';

export class CONSTS {
	static PRICING_UPDATE = 'price_update';
	static BANK_UPDATE = 'bank_update';
	static MEMBER_UPDATE = 'member_update';
	static ADDONS_UPDATE = 'addons_update';
	static QUOTE_UPDATE = 'quote_update';
	static LOGIN_UPDATE = 'login_update';
	static TITLE_OPTION = 'title_update';
	static HALT_REQUESTS = 'halt_requests_update';
	static BASE_URL = 'http://developie.theaa.local/';
	static LOCAL_CONTEXT = 'membership/';
	static UAT_CONTEXT = 'membership-uat/';

	static getBaseUrlWithContext() {
		if (environment.production) {
			return this.BASE_URL + this.UAT_CONTEXT;
		} else {
			return this.BASE_URL + this.LOCAL_CONTEXT;
		}
	}
}


export class COLORS {
	static brand: string = '#ffcc00';
	static dark: string = '#1B1918';
	static darkGrey: string = '#3d3e3c';
	static medDarkGrey: string = '#9a9c9a';
	static medLightGrey: string = '#c7c8c7';
	static lightGrey: string = '#e1e3e1';
	static light: string = '#f7f7f7';
	static yellowWarning: string = '#ffe602';
	static orangeWarning: string = '#f29922';
	static redWarning: string = '#e84236';
	static primary: string = '#44b491';
	static primaryShadow: string = '#009a77';
	static secondary: string = '#ec6355';
	static secondaryShadow: string = '#c04a3c';
	static tertiary: string = '#eb7e15';
	static tertiaryShadow: string = '#dc6a20';
}

export const TestimonialRules: Rule[] = [{
	id: 0,
	name: 'Primary Users between 25-40',
	group: ['primaryUser'],
	when: {
		age: [25, 40],
		gender: 'male'
	},
	isTrue: false
}, {
	id: 1,
	name: 'Primary Users between 40-50',
	group: ['primaryUser'],
	when: {
		age: [40, 50],
		gender: 'male'
	},
	isTrue: false
}, {
	id: 2,
	name: 'Primary Users between 30-40',
	group: ['primaryUser'],
	when: {
		age: [30, 40],
		gender: 'female'
	},
	isTrue: false
}, {
	id: 3,
	name: 'Primary Users between 20-30',
	group: ['primaryUser'],
	when: {
		age: [20, 30],
		gender: 'male'
	},
	isTrue: false
}, {
	id: 4,
	name: 'Primary Users between 50-60',
	group: ['primaryUser'],
	when: {
		age: [50, 60],
		gender: 'female'
	},
	isTrue: false
}]

export const TestimonialOutcomes: Outcome[] = [{
		id: 0,
		include: [0],
		author: 'Patrick Cornally',
		description: `Had a blow out on the Naas road very early this morning and used the app to get a rescue. Was amazed to be called back straight away and the driver was with me 10 minutes later and had me back on the road in no time at all. Hugely impressed with such great service. Thanks a million :)`,
		img: 'https://scontent-lhr3-1.xx.fbcdn.net/hprofile-xfa1/v/t1.0-1/p160x160/11745566_10203165414375453_3561423872133037704_n.jpg?oh=fca20f54ed8b6babc43c83cff97c92f8&oe=57778759'
	}, {
		id: 1,
		include: [1],
		author: 'Phil O’Kelly',
		description: `So my wife Jean is out doing all that last minute Christmas stuff that needs to be done - and without which Christmas would be ruined... when the car breaks down.
Forty minutes later the AA Rescue man has waved his magic wand and turned a Christmas disaster into a Christmas fairy tale and it's all go once again for a happy Crimbo.
I don't call on my AA membership often, but when I do - like today - it is amazing how that little yellow membership card has near-magical properties.
So, If you're wondering what gift to get that person who has everything, consider an AA membership... because even the most fortunate of us need to ask for help sometime.`,
		img: `https://scontent-lhr3-1.xx.fbcdn.net/hprofile-xft1/v/t1.0-1/p160x160/12400669_10153520095330886_1875640312156105071_n.jpg?oh=107c7c1af42661ea6f2cc103c8c42152&oe=5778CAED`
	}, {
		id: 2,
		include: [2],
		author: 'Nynke Fitzpatrick',
		description: ` Just a note to say thank you to your team in Galway for the impeccable service they provided when my car broke down on the way to the cliffs of Moher on Saturday. The AA truck was there within the hour. Pat, the mechanic , was very friendly and knowledgeable and found the issue almost immediately. The AA team organized for the car to be towed back to Dublin by Mick who kept me updated on when he would be with us and for a taxi (driver Michael, absolute gentleman) to take us to Enterprise Car Rental in Galway where Nigel and Murella took excellent care of us and had a lovely car was waiting for us to drive home. Not once was I left wondering what was going to happen next as everyone kept in contact via telephone to keep me updated. Absolutely flawless service! THANK YOU!`,
		img: `https://scontent-lhr3-1.xx.fbcdn.net/hprofile-xft1/v/t1.0-1/p160x160/12400669_10153520095330886_1875640312156105071_n.jpg?oh=107c7c1af42661ea6f2cc103c8c42152&oe=5778CAED`
	}, {
		id: 3,
		include: [3],
		author: 'Eoin Ó Ruairc',
		description: `HI, I would like to say a Big Thank you for the help your guys gave this evening when my car was broken down. Brilliant Service could not fault it :D`,
		img: `https://scontent-lhr3-1.xx.fbcdn.net/hprofile-xfp1/v/t1.0-1/p50x50/12417533_10154119419059600_4499986992480432635_n.jpg?oh=9ff27b8c4362847897c15293bcb55590&oe=57796DD3`
	}, {
		id: 4,
		include: [4],
		author: 'Regina Molloy Hetherington',
		description: `A BIG Thank You to your agent who came to the rescue of a dog stuck in our van on Tuesday in Ballycarney. Above & beyond the call of duty. Well done AA.`,
		img: `https://scontent-lhr3-1.xx.fbcdn.net/hprofile-xft1/v/t1.0-1/p50x50/12002186_10153088716816806_269839380999733142_n.jpg?oh=de12ea96cf188491f09281ed67fcf5b0&oe=5774AE37`
	}

];