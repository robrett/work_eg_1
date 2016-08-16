interface Outcome {
    id: number,
    details?: any;
    description?: string;
    img?: string;
    author?: string;
    include: number[];
    reject?: number[];
    rules?: number[];
    similarity?: number;
}
