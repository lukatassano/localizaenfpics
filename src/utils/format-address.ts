import { AddressFormType } from "../types/form";

export function formatAddress(address: AddressFormType): string {
  return `${address.number} ${address.street}, ${address.district}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`;
}
