interface Member {
    firstName?: string;
    surname?: string;
    dateOfBirth?: string;
    placeholder?: boolean;
    title?: string,
    email?: string;
    phoneNumber?: string;
    addressLine1?: string;
    addressLine2?: string;
    county?: any;
    area?: any;
    price?: {
        amount: number;
        str: string;
        symbol: string;
        currency: string;
        pretty: string;
    };
    typeDisplay?: string;
    type?: string;
    parentType?: string;
    index?: number;
    filter?: any[];

}