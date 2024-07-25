import axios from "axios";
import { AddressFormType } from "../types/form";
import { Location } from "../types/address";

export async function searchLocationByAddress(address: AddressFormType) {
  const query = `${address.street} ${address.number} - ${address.district}, ${address.city} - ${address.state}`;
  const { data } = await axios.get<Location[]>(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
      },
    }
  );

  return data[0]
}

export async function searchLocationByZipCode(zipCode: string) {
  const query = `${zipCode}`
  const { data } = await axios.get<Location[]>(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: query,
        format: "json",
        addressdetails: 1,
      },
    }
  );

  return data[0]
}