interface AANotification {
    id: string;
    sentAt?: Date;
    isSeen?: boolean;
    text?: string;
    type?: string;
    options?: {
        timer?: number;
        display?: string;
        myAAStatus?: boolean;
        promise?: any;
        btnText?: string;
        link?: string;
    }

}