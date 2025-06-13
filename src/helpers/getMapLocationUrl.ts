import { Address } from "@/types";

export default function getMapLocationUrl(address: Address) {
  const fullAddressString = `${address.street} ${address.houseNumber}, ${address.neighborhood}, ${address.city}, ${address.cep}`;

  const encodedMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressString)}`;
  return encodedMapUrl;
}
