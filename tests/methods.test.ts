import { AuthorizationServiceConfig } from '../src/interfaces/auth';
import { TestSetup } from './utils/testSetup';

describe('API Client Methods', () => {
  let setup: TestSetup;

  beforeEach(() => {
    setup = new TestSetup();
  });

  afterEach(() => {
    setup.mock.restore();
  });

  it('should handle GET requests correctly', () => {
    let getMethodStub: Object = {
      id: 1,
      name: 'string',
      slub: 'string',
      image: 'string',
    };

    let config: AuthorizationServiceConfig = {
      url: '/categories/',
    };

    setup.mock.onGet(config.url).reply(200, getMethodStub);

    setup.instance.methods
      .get(config.url, config.config)
      .then(function (result) {
        expect(result.data.id).toBe(1);
        expect(result.data.name).toBe('string');
        expect(result.data.slub).toBe('string');
        expect(result.data.image).toBe('string');
      });
  });

  it('should handle POST requests correctly', () => {
    let postMethodStub: Object = {
      id: 1,
      name: 'string',
      slub: 'string',
      image: 'string',
    };

    let config: AuthorizationServiceConfig = {
      url: '/categories/',
      data: {
        name: 'New Category',
        image: 'https://placeimg.com/640/480/any',
      },
    };

    setup.mock.onPost(config.url).reply(200, postMethodStub);

    setup.instance.methods
      .post(config.url, config.data, config.config)
      .then(function (result) {
        expect(result.data.id).toBe(1);
        expect(result.data.name).toBe('string');
        expect(result.data.slub).toBe('string');
        expect(result.data.image).toBe('string');
      });
  });

  it('should handle PUT requests correctly', () => {
    let putMethodStub: Object = {
      id: 1,
      name: 'string',
      slub: 'string',
      image: 'string',
    };

    let config: AuthorizationServiceConfig = {
      url: '/categories/1',
      data: {
        name: 'Updated Category Name',
        image: 'https://placeimg.com/640/480/any',
      },
    };

    setup.mock.onPut(config.url).reply(200, putMethodStub);

    setup.instance.methods
      .put(config.url, config.data, config.config)
      .then(function (result) {
        expect(result.data.id).toBe(1);
        expect(result.data.name).toBe('string');
        expect(result.data.slub).toBe('string');
        expect(result.data.image).toBe('string');
      });
  });

  it('should handle DELETE requests correctly', () => {
    let config: AuthorizationServiceConfig = {
      url: '/products/1',
    };

    setup.mock.onDelete(config.url).reply(200, true);

    setup.instance.methods
      .delete(config.url, config.config)
      .then(function (result) {
        expect(result.data).toBe(true);
      });
  });
});