import { GetPollutantNamePipe } from './get-pollutant-name.pipe';

describe('GetPollutantNamePipe', () => {
  it('create an instance', () => {
    const pipe = new GetPollutantNamePipe();
    expect(pipe).toBeTruthy();
  });
});
