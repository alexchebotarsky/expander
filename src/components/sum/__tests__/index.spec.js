import {sum} from '../index';

describe('sum', () => {
  it('should return sum over all passed arguments', () => {
    expect(sum(1, 2, 3, 4)).toBe(10);
  });
});
