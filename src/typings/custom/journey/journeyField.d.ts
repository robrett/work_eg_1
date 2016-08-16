interface JourneyField {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    active?: boolean;
    validation: any[];
    validationAsync?: any[];
    filterBy?: string;
    data?: string;
}