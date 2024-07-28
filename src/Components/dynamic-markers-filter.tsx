import { atom, useAtom } from "jotai";
import { useMap, useMapEvents } from "react-leaflet";
import {
  filteredNursesAtom,
  nursesAtom,
  selectedCoordsAtom,
} from "../atoms/nurse";
import { useEffect } from "react";
import { LatLng, LatLngExpression } from "leaflet";

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
  const [selectedCoords, setSelectedCoords] = useAtom(selectedCoordsAtom);
  const mMap = useMap();

  const updateFilteredNurses = () => {
    if (selectedCoords !== undefined) {
      const filteredNurses = nurses.filter((nurse) => {
        const { lat, lng } = selectedCoords;
        const [nurseLat, nurseLng] = nurse.address.coordinates || [-1, -1];

        return (
          lat.toPrecision(4) === nurseLat.toPrecision(4) &&
          lng.toPrecision(4) === nurseLng.toPrecision(4)
        );
      });

      setFilteredNurses(filteredNurses);
    } else {
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
    }
  };

  useEffect(() => {
    updateFilteredNurses();
  }, [selectedCoords]);

  useMapEvents({
    moveend: updateFilteredNurses,
    click: () => setSelectedCoords(undefined),
  });

  return <></>;
}
