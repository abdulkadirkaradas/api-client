import { AxiosError } from 'axios';
import { TestSetup } from './utils/testSetup';

describe('API Client Interceptor', () => {
  let setup: TestSetup;

  jest.setTimeout(15000);

  beforeEach(() => {
    setup = new TestSetup();
  });

  afterEach(() => {
    setup.mock.restore();
  });

  it('should set request interceptor headers properly', () => {
    const authToken = 'auth_token';

    setup.instance.interceptorService.request.setHeaders({
      "Authorization": `Bearer ${authToken}`
    });
    expect(setup.instance.interceptorService.request.getHeaderValue("Authorization")).toBe(`Bearer ${authToken}`);
  });

  it("should retry on 500 error and succeed on second attempt", async () => {
    setup.mock
      .onGet("/retry-test")
      .replyOnce(500)
      .onGet("/retry-test")
      .replyOnce(500)
      .onGet("/retry-test")
      .replyOnce(500)
      .onGet("/retry-test")
      .reply(200, { success: true });

    const response = await setup.instance.methods.get("/retry-test");

    expect(response.data).toEqual({ success: true });
  });

  it("should throw error after max retries on 500 error", async () => {
    setup.mock.onGet("/retry-fail").reply(500);

    try {
      await setup.instance.methods.get("/retry-fail");
    } catch (error: AxiosError | any) {
      expect(error).toBeDefined();
      expect(error.message).toContain("Request failed with status code 500");
    }
  });
});