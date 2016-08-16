import {CurrencyPipe} from './currency_pipe';

describe(`Currency pipe`, () => {
    let pipe: CurrencyPipe;

    beforeEach(() => {
        pipe = new CurrencyPipe();
    })
    
    it('should return null if blank', () => {
        expect(pipe.transform("")).toBe(null);
    })

    it('should transform a number into money with no digits', () => {
        expect(pipe.transform(9,{digits: 0})).toBe("€9")
    })

    it('should transform a number into money with digits', () => {
        expect(pipe.transform(9.65, { digits: 2 })).toBe("€9.65");
    })


    it('should transform a number into FREE', () => {
        expect(pipe.transform(0, { digits: 2, free: true })).toBe("FREE");
    })       
})


