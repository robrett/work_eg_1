interface MemberType {
    active: {};
    values?: Member;
    fields: JourneyField[];
    index: number;
    maxAge: number;
    minAge: number;
    placeholder?: boolean;
    price: {
        amount: number;
        str: string;
        symbol: string;
        currency: string;
        pretty: string;
    };
    title: string;
    type: string;
    typeDisplay: string;
}