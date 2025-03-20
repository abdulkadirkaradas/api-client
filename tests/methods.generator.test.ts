import { AuthorizationServiceConfig } from "../src/interfaces/auth";
import {
  testMethodStubs,
  userMethodsConfig,
} from "./utils/testConfigs/methodGeneratorConfig";
import { TestSetup } from "./utils/testSetup";

describe("API Client Method Generator", () => {
  let setup: TestSetup;
  let generatedMethods: any;

  beforeEach(() => {
    setup = new TestSetup();

    setup.methodGenerator.bind(userMethodsConfig);
    generatedMethods = setup.methodGenerator.getMethods();
  });

  afterEach(() => {
    setup.mock.restore();
  });

  it("Is BIND method works", () => {
    expect(generatedMethods).toHaveProperty("fetchCategories");
    expect(generatedMethods).toHaveProperty("createUser");
    expect(generatedMethods).toHaveProperty("updateUser");
    expect(generatedMethods).toHaveProperty("deleteProduct");
  });

  it("Is fetchCategories method works", () => {
    setup.mock.onGet("/categories/1").reply(200, testMethodStubs.get);

    generatedMethods
      .fetchCategories()
      .then(function (result: any) {
        expect(result.data.id).toBe(1);
        expect(result.data.name).toBe("string");
        expect(result.data.slug).toBe("string");
        expect(result.data.image).toBe("string");
      })
      .catch(function (result: any) {
        console.error(result);
      });
  });

  it("Is createUser method works", () => {
    setup.mock.onPost("/users/").reply(200, testMethodStubs.post);

    generatedMethods
      .createUser()
      .then(function (result: any) {
        expect(result.data.id).toBe(1);
        expect(result.data.name).toBe("string");
        expect(result.data.email).toBe("string");
        expect(result.data.password).toBe("string");
        expect(result.data.avatar).toBe("string");
        expect(result.data.role).toBe("string");
      })
      .catch(function (result: any) {
        console.error(result);
      });
  });

  it("Is updateUser method works", () => {
    setup.mock.onPut("/users/1").reply(200, testMethodStubs.put);

    generatedMethods
      .updateUser()
      .then(function (result: any) {
        expect(result.data.id).toBe(1);
        expect(result.data.name).toBe("string");
        expect(result.data.email).toBe("string");
        expect(result.data.password).toBe("string");
        expect(result.data.avatar).toBe("string");
        expect(result.data.role).toBe("string");
      })
      .catch(function (result: any) {
        console.error(result);
      });
  });

  it("Is deleteProduct method works", () => {
    setup.mock.onDelete("/products/1").reply(200, {});

    generatedMethods
      .deleteProduct()
      .then(function (result: any) {
        expect(result.data).toEqual({});
      })
      .catch(function (result: any) {
        console.error(result);
      });
  });
});
