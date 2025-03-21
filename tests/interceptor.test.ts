import { TestSetup } from './utils/testSetup';

describe('API Client Interceptor', () => {
  let setup: TestSetup;

  beforeEach(() => {
    setup = new TestSetup();
  });

  afterEach(() => {
    setup.mock.restore();
  });

  it('should set request interceptor headers properly', () => {
    const authToken = 'auth_token';

    setup.instance.interceptor.request.setHeaders({
      "Authorization": `Bearer ${authToken}`
    });
    expect(setup.instance.interceptor.request.getHeaderValue("Authorization")).toBe(`Bearer ${authToken}`);
  });
});