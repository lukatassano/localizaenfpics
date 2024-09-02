import axios from "axios";
import { FormType } from "../types/form";
import { Location } from "../types/address";

export async function searchLocationByAddress(address: FormType) {
  const street = `${address.type} ${address.street}${typeof address.number === "number" ? ` ${address.number}` : ""}` 
  const { data } = await axios.get<Location[]>(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        format: "json",
        addressdetails: 1,
        limit: 1,
        street,
        city: address.city,
        state: address.state,
        country: address.country,
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
