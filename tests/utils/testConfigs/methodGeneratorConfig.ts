export const userMethodsConfig = [
  {
    methodName: "fetchCategories",
    method: "GET",
    url: "/categories/1",
  },
  {
    methodName: "createUser",
    method: "POST",
    url: "/users/",
    data: {
      name: "Nicolas",
      email: "nico@gmail.com",
      password: "1234",
      avatar: "https://picsum.photos/800",
    },
  },
  {
    methodName: "updateUser",
    method: "PUT",
    url: "/users/1",
    data: {
      email: "john@mail.com",
      name: "Change name",
    },
  },
  {
    methodName: "deleteProduct",
    method: "DELETE",
    url: "/products/1",
  },
];

export const testMethodStubs = {
  get: {
    id: 1,
    name: "string",
    slug: "string",
    image: "string",
  },
  post: {
    id: 1,
    email: "string",
    password: "string",
    name: "string",
    avatar: "string",
    role: "string",
  },
  put: {
    id: 1,
    email: "string",
    password: "string",
    name: "string",
    avatar: "string",
    role: "string",
  },
};
