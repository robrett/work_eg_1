import {FilterPipe} from './filter_pipe';

describe(`Filter Pipe`, () => {
    let pipe: FilterPipe;

    beforeEach(() => {
        pipe = new FilterPipe();
    });

    it('should return null if blank', () => {
        expect(pipe.transform("", { arg: 0 })).toBe(null);
    });

    it('should return everything if arg = *', () => {
        let list = [1, 2, 3, 4, 5, 6, 7, 8];
        expect(pipe.transform(list, { 'description': '*' })).toEqual(list);
    });

    it('should be able to filter', () => {
        let list = [{ name: 'Ronan' }, { name: 'Ana' }, { name: 'Sophie' }]
        expect(pipe.transform(list, { 'name': 'Ro' })).toEqual([{ name: 'Ronan' }]);
    });

    it('should be able to filter values with spaces', () => {
        let list = [{ name: 'Ronan Cufon', age: 41 }, { name: 'Ronan Brett', age: 41 }];
        expect(pipe.transform(list, { 'name': 'Ronan Cufon' })).toEqual([{ name: 'Ronan Cufon', age: 41 }]);

    });

});
