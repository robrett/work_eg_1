interface JourneyPricing {
    paymentDetails: {
        type: string;
    }
    indicative: {}
    frequency: string;
    estimate: {
        calculatedTotal: number;
        calculatedPrice: number;
    }
}
