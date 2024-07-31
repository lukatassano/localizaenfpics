import { Box, Fade, LinearProgress, Typography } from "@mui/material";
import { useAtom } from "jotai";
import L, { LatLngExpression, LeafletMouseEvent } from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import useSWR from "swr";
import {
  filteredNursesAtom,
  selectedCoordsAtom,
  selectedNurseAtom,
  specialtiesFilterAtom,
} from "../atoms/nurse";
import { listNurses } from "../service/nurse";
import { DynamicMarkersFilter } from "./dynamic-markers-filter";
import "./map.css";

const createClusterCustomIcon = function (cluster: any) {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: L.point(33, 33, true),
  });
};

export function Map() {
  const { data: nurses, isLoading } = useSWR(["nurses"], listNurses, {
    refreshInterval: 120 * 1000,
  });
  const [, setSelectedCoords] = useAtom(selectedCoordsAtom);
  const [specialtiesFilter] = useAtom(specialtiesFilterAtom);
  const [, setSelectedNurse] = useAtom(selectedNurseAtom);
  const [filteredNurses] = useAtom(filteredNursesAtom);

  return (
    <Box
      flex={1}
      flexDirection="column"
      display="flex"
      height="100vh"
      justifyContent="flex-end"
      gap={2}
      p={4}
    >
      <Typography variant="h4" sx={{ fontFamily: "Raleway" }}>
        Localiza Enfermeiros PICS
      </Typography>
      <MapContainer
        center={[-17.582692, -54.751349]}
        zoom={4}
        className="leaflet-container"
        style={{
          flex: 1,
          borderRadius: 8,
        }}
      >
        <Fade in={isLoading}>
          <LinearProgress sx={{ width: "100%", zIndex: 2000 }} />
        </Fade>
        <DynamicMarkersFilter />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          singleMarkerMode
          iconCreateFunction={createClusterCustomIcon}
          removeOutsideVisibleBounds
          onClick={(e: LeafletMouseEvent) => setSelectedCoords(e.latlng)}
          showCoverageOnHover={true}
        >
          {(specialtiesFilter.length ? filteredNurses : nurses || []).map(
            (nurse) => (
              <Box key={nurse.uuid}>
                <Marker
                  position={nurse.address.coordinates as LatLngExpression}
                  eventHandlers={{
                    click: () => setSelectedNurse(nurse),
                  }}
                >
                  <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                    {nurse.name}
                  </Tooltip>
                </Marker>
              </Box>
            )
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </Box>
  );
}
