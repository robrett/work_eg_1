interface Quote {
    breakdown: QuoteBreakdownItem[];
    premium: {
        annual: Price;
        monthly: Price;
    }
    reference: string;
    total: {
        annual: QuoteDepositInstallment;
        monthly: QuoteDepositInstallment;
    }
}