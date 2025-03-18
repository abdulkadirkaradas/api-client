import { TestSetup } from './utils/testSetup';

describe('API Client Interceptor', () => {
  let setup: TestSetup;

  beforeEach(() => {
    setup = new TestSetup();
  });

  afterEach(() => {
    setup.mock.restore();
  });

  it('Is request interceptor headers set properly', () => {
    const authToken = 'auth_token';

    setup.instance.interceptor.request.setHeaders({
      "Authorization": `Bearer ${authToken}`
    });
    expect(setup.instance.interceptor.request.getHeaderValue("Authorization")).toBe(`Bearer ${authToken}`);
  });

  it('Is response interceptor headers set properly', () => {
    const cacheControl = 'no-store';

    setup.instance.interceptor.response.setHeaders({
      "Cache-Control": cacheControl
    });
    expect(setup.instance.interceptor.response.getHeaderValue("Cache-Control")).toBe(cacheControl);
  });
});