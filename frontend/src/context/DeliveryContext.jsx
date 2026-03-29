import { createContext, useContext, useEffect, useState } from "react";

const DeliveryContext = createContext(null);

const DELIVERY_STORAGE_KEY = "ecommerce_delivery_zone";

export function DeliveryProvider({ children }) {
  const [deliveryZone, setDeliveryZone] = useState(() => {
    return localStorage.getItem(DELIVERY_STORAGE_KEY) || "Lagos";
  });

  useEffect(() => {
    localStorage.setItem(DELIVERY_STORAGE_KEY, deliveryZone);
  }, [deliveryZone]);

  return (
    <DeliveryContext.Provider value={{ deliveryZone, setDeliveryZone }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  return useContext(DeliveryContext);
}
