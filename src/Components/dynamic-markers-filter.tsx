import { atom, useAtom } from "jotai";
import { useMap, useMapEvents } from "react-leaflet";
import { filteredNursesAtom, nursesAtom } from "../atoms/nurse";

export const coordsAtom = atom({
  northEast: {
    lat: 0,
    lng: 0,
  },
  southWest: {
    lat: 0,
    lng: 0,
  },
});

export function DynamicMarkersFilter() {
  const [nurses] = useAtom(nursesAtom);
  const [, setFilteredNurses] = useAtom(filteredNursesAtom);
  const mMap = useMap();

  useMapEvents({
    moveend: () => {
      const bounds = mMap.getBounds();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      const filteredNurses = nurses.filter((nurse) => {
        const coords = nurse.address.coordinates;
        if (coords) {
          const lat = coords[0];
          const lng = coords[1];

          const inLat = northEast.lat > lat && lat > southWest.lat;
          const inLng = northEast.lng > lng && lng > southWest.lng;
          return inLat && inLng;
        }

        return false;
      });

      setFilteredNurses(filteredNurses);
    },
  });

  return <></>;
}
