import { FormType } from "../types/form";

export function formatAddress(address: FormType): string {
  return `${address.number} ${address.street}, ${address.district}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`;
}
