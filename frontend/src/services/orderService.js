import { request } from "./api";

export function createOrder(order) {
  return request("/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
}

export function getOrders(token) {
  return request("/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getMyOrders(token) {
  return request("/orders/my-orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateOrderStatus(orderId, status, token) {
  return request(`/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
}

export function getOrdersByEmail(email) {
  const params = new URLSearchParams({ email });
  return request(`/orders/lookup?${params.toString()}`);
}
