interface IBaobab {
    (object: any): void;
    (object: any, options: any): void;
    get(): any;
    select(string): any;
    set(): any;
    unset(): any;
    on(): any;
    monkey: any;

}

declare var Baobab: IBaobab;

declare module "Baobab" {
    export = Baobab;
}