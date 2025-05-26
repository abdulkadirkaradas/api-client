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

  it("should successfully fetch categories", async () => {
    setup.mock.onGet("/categories/1").reply(200, testMethodStubs.get);

    const result = await generatedMethods.fetchCategories();
    expect(result.data.id).toBe(1);
    expect(result.data.name).toBe("string");
    expect(result.data.slug).toBe("string");
    expect(result.data.image).toBe("string");
  });

  it("should successfully create a user", async () => {
    setup.mock.onPost("/users/").reply(200, testMethodStubs.post);

    const result = await generatedMethods.createUser();
    expect(result.data.id).toBe(1);
    expect(result.data.name).toBe("string");
    expect(result.data.email).toBe("string");
    expect(result.data.password).toBe("string");
    expect(result.data.avatar).toBe("string");
    expect(result.data.role).toBe("string");
  });

  it("should successfully update a user", async () => {
    setup.mock.onPut("/users/1").reply(200, testMethodStubs.put);

    const result = await generatedMethods.updateUser();
    expect(result.data.id).toBe(1);
    expect(result.data.name).toBe("string");
    expect(result.data.email).toBe("string");
    expect(result.data.password).toBe("string");
    expect(result.data.avatar).toBe("string");
    expect(result.data.role).toBe("string");
  });

  it("should successfully delete a product", async () => {
    setup.mock.onDelete("/products/1").reply(200, {});

    const result = await generatedMethods.deleteProduct();
    expect(result.data).toEqual({});
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
