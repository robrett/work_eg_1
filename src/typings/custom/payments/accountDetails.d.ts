interface AccountDetails {
    accountName?: string;
    BIC?: string;
    IBAN?: string;
    accountNumber?: string;
    sortCode?: string;
    bankAddress?: string;
    bankName?: string;
    // On Validation Also Includes
    valid?: string;
    accepted?: string;
}