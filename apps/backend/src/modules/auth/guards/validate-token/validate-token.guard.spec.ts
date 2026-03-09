import { ValidateTokenGuard } from './validate-token.guard';

describe('ValidateTokenGuard', () => {
  it('should be defined', () => {
    expect(new ValidateTokenGuard()).toBeDefined();
  });
});
