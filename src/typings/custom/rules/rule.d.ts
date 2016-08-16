interface Rule {
    id: number;
    name: string;
    group?: string[];
    when: {
        age?: number[]
        max?: number;
        min?: number;
        gender?: string;
        county?: string;
        town?: string;
    }
    isTrue?: boolean;
    isReject?: boolean;
}
