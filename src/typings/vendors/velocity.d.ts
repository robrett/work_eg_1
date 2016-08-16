interface VelocityStatic {
    (element: Element, animation: string, options: any): void;
    (element: Element, animation: {}, options: any): void;
    (element: Element, animation: string): void;
    RunSequence(sequenceArr: any[]): void;
    RegisterEffect(name: string, {}): void;
}

declare module 'velocity-animate' {
    export = Velocity;
}
declare var Velocity: VelocityStatic;