import { Box, Fade, LinearProgress } from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import L, { LatLngExpression, LeafletMouseEvent } from "leaflet";
import { useEffect, useMemo, useState } from "react";
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
  specialtiesFilterAtom,
} from "../atoms/nurse";
import { useNurses } from "../hooks/nurse";
import { filterBySpecialties } from "../utils/nurse-filters";

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

  const [nurses, setNurses] = useAtom(nursesAtom);
  const [selectedCoords, setSelectedCoords] = useAtom(selectedCoordsAtom);
  const [specialtiesFilter] = useAtom(specialtiesFilterAtom);

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

  const { data: nursesResponse, isLoading } = useNurses({
    coordinates,
    refreshInterval: TWO_MINUTES,
  });

  useEffect(() => {
    setNurses(nursesResponse || []);
  }, [nursesResponse]);

  const filteredNurses = useMemo(() => {
    return nurses.filter(filterBySpecialties(specialtiesFilter));
  }, [selectedCoords, specialtiesFilter, nurses]);

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
        {filteredNurses.map((nurse) => (
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
