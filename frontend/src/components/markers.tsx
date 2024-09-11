import { Box, Fade, LinearProgress } from "@mui/material";
import { useSetAtom } from "jotai";
import L, { LatLngExpression, LeafletMouseEvent } from "leaflet";
import { useEffect, useState } from "react";
import {
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  nursesAtom,
  selectedCoordsAtom,
  selectedNurseAtom,
} from "../atoms/nurse";
import { useNurses } from "../hooks/nurse";

const TWO_MINUTES = 2 * (60 * 1000);

const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: L.point(33, 33, true),
  });
};

export function Markers() {
  const map = useMap();

  const setNurses = useSetAtom(nursesAtom);
  const setSelectedCoords = useSetAtom(selectedCoordsAtom);
  const setSelectedNurse = useSetAtom(selectedNurseAtom);

  const [northEastLat, setNorthEastLat] = useState<number | undefined>(
    undefined
  );
  const [northEastLng, setNorthEastLng] = useState<number | undefined>(
    undefined
  );
  const [southWestLat, setSouthWestLat] = useState<number | undefined>(
    undefined
  );
  const [southWestLng, setSouthWestLng] = useState<number | undefined>(
    undefined
  );

  function updateFilteredNurses() {
    setSelectedCoords(undefined);
    const bounds = map.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    setNorthEastLat(northEast.lat);
    setNorthEastLng(northEast.lng);
    setSouthWestLat(southWest.lat);
    setSouthWestLng(southWest.lng);
  }

  useMapEvents({
    moveend: updateFilteredNurses,
    click: () => setSelectedCoords(undefined),
  });

  useEffect(() => {
    updateFilteredNurses();
  }, [map]);

  const coordinates = {
    northEastLat,
    northEastLng,
    southWestLat,
    southWestLng,
  };

  const { data: nurses, isLoading } = useNurses({
    coordinates,
    refreshInterval: TWO_MINUTES,
  });

  useEffect(() => {
    setNurses(nurses || []);
  }, [nurses]);

  return (
    <>
      <Fade in={isLoading}>
        <LinearProgress sx={{ width: "100%", zIndex: 2000 }} />
      </Fade>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup
        singleMarkerMode
        iconCreateFunction={createClusterCustomIcon}
        removeOutsideVisibleBounds
        onClick={(e: LeafletMouseEvent) => {
          setSelectedCoords(e.latlng);
        }}
        showCoverageOnHover={true}
      >
        {(nurses || []).map((nurse) => (
          <Box key={nurse.id}>
            <Marker
              position={
                [
                  Number(nurse.latitude),
                  Number(nurse.longitude),
                ] as LatLngExpression
              }
              eventHandlers={{
                click: () => setSelectedNurse(nurse),
              }}
            >
              <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                {nurse.name}
              </Tooltip>
            </Marker>
          </Box>
        ))}
      </MarkerClusterGroup>
    </>
  );
}
