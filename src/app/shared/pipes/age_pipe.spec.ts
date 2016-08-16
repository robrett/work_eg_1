import {AgePipe} from './age_pipe';

describe(`Age Pipe`, () => {
    let pipe: AgePipe;

    beforeEach(() => {
        pipe = new AgePipe();
    });
    it('should return null if no value', () => {
        expect(pipe.transform("")).toEqual(null);
    });

    it("should not transform invalid dates", () => {
        expect(() => pipe.transform("45/14/2150")).toThrowError();
    });

    it("should not transform completely invalid dates", () => {
        expect(() => pipe.transform("5454545454")).toThrowError();
    });

    it('should transform a date into years old', () => {
        expect(pipe.transform("29/12/1987")).toEqual(28);
    });
});




