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

  it("should bind methods correctly", () => {
    expect(generatedMethods).toHaveProperty("fetchCategories");
    expect(generatedMethods).toHaveProperty("createUser");
    expect(generatedMethods).toHaveProperty("updateUser");
    expect(generatedMethods).toHaveProperty("deleteProduct");
  });

  it("should successfully fetch categories", () => {
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

  it("should successfully create a user", () => {
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

  it("should successfully update a user", () => {
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

  it("should successfully delete a product", () => {
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

  it("should throw an error when duplicate method names are bound", () => {
    setup.mock.onGet("/categories/1").reply(200, testMethodStubs.get);

    setup.methodGenerator.bind([
      { methodName: "getPosts", method: "GET", url: "/posts/1" },
      { methodName: "getPosts", method: "GET", url: "/posts/2" },
    ]);

    expect(() => {
      setup.methodGenerator.getMethods().getPosts();
    }).toThrow('Method name "getPosts" is already exists');
  });

  it("should throw an error when HTTP method is missing", () => {
    setup.mock.onGet("/categories/1").reply(200, testMethodStubs.get);

    setup.methodGenerator.bind([
      { methodName: "getPosts", url: "/posts/1" },
    ]);

    expect(() => {
      setup.methodGenerator.getMethods().getPosts();
    }).toThrow('HTTP method for "getPosts" cannot be empty or null.');
  });
});
