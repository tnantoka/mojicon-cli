import { main } from './index';

describe('main', () => {
  it('should print "Hello World"', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    main();
    expect(consoleSpy).toHaveBeenCalledWith('Hello World');
  });
});
