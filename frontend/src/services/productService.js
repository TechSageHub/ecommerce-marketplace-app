import { request } from "./api";

export function getProducts(options = {}) {
  const params = new URLSearchParams();

  if (options.category && options.category !== "All") {
    params.set("category", options.category);
  }

  if (options.search) {
    params.set("search", options.search);
  }

  if (options.page) {
    params.set("page", options.page);
  }

  if (options.limit) {
    params.set("limit", options.limit);
  }

  const query = params.toString() ? `?${params.toString()}` : "";
  return request(`/products${query}`);
}

export function getProductById(id) {
  return request(`/products/${id}`);
}

export function createProduct(product, token) {
  return request("/products", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: product,
  });
}

export function updateProduct(id, product, token) {
  return request(`/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: product,
  });
}

export function deleteProduct(id, token) {
  return request(`/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
