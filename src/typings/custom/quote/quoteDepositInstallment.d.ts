interface QuoteDepositInstallment {
    deposit: Price;
    instalment: {
        charge: Price;
        number: Number;
    }
}