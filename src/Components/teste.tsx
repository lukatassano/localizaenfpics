import { atom, useSetAtom } from "jotai";
import { useMap, useMapEvents } from "react-leaflet";

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

export function Componente() {
  const setCoords = useSetAtom(coordsAtom);
  const mMap = useMap();

  useMapEvents({
    moveend: () => {
      const bounds = mMap.getBounds();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      setCoords({
        northEast: {
          lat: northEast.lat,
          lng: northEast.lng,
        },
        southWest: {
          lat: southWest.lat,
          lng: southWest.lng,
        },
      });
    },
  });

  return <></>;
}
