import useSWR from "swr";
import { fetcher } from "../api/api";
import { Nurse } from "../types/form";
import { isNumber } from "../utils/number";

type Props = {
  coordinates: {
    northEastLat?: number
    northEastLng?: number
    southWestLat?: number
    southWestLng?: number
  };
  refreshInterval?: number;
}

export function useNurses({ refreshInterval, coordinates }: Props) {
  
  const { northEastLat, northEastLng, southWestLat, southWestLng } = coordinates;

  const doRequest = isNumber(northEastLat) && isNumber(northEastLng) && isNumber(southWestLat) && isNumber(southWestLng);
  
  const searchParams = new URLSearchParams();

  if (doRequest) {
    searchParams.append("northEastLat", northEastLat.toString());
    searchParams.append("northEastLng", northEastLng.toString());
    searchParams.append("southWestLat", southWestLat.toString());
    searchParams.append("southWestLng", southWestLng.toString());
  }

  return useSWR<Nurse[]>(
    doRequest ? `/nurse?${searchParams.toString()}` : undefined, fetcher, {
    refreshInterval: refreshInterval || 0,
    keepPreviousData: true,
  });
}
