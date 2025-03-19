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

  it('Is GET method works', () => {
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
        // console.log(result.data);
      })
      .catch(function (result) {
        console.error(result);
      });
  });

  it('Is POST method works', () => {
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
        // console.log(result.data);
      })
      .catch(function (result) {
        console.error(result);
      });
  });

  it('Is PUT method works', () => {
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
        // console.log(result);
      })
      .catch(function (result) {
        console.error(result);
      });
  });

  it('Is DELETE method works', () => {
    let config: AuthorizationServiceConfig = {
      url: '/products/1',
    };

    setup.mock.onDelete(config.url).reply(200, true);

    setup.instance.methods
      .delete(config.url, config.config)
      .then(function (result) {
        expect(result.data).toBe(true);
        // console.log(result);
      })
      .catch(function (result) {
        console.error(result);
      });
  });
});

//TODO These methods will be tested when proper mock apis founded
// it('Is PATCH method works', () => {});
// it('Is HEAD method works', () => {});