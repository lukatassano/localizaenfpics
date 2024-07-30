import { Box, Typography } from "@mui/material";
import { useAtom } from "jotai";
import L, { LatLngExpression, LeafletMouseEvent } from "leaflet";
import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  nursesAtom,
  selectedCoordsAtom,
  selectedNurseAtom,
} from "../atoms/nurse";
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
  const [, setSelectedCoords] = useAtom(selectedCoordsAtom);
  const [, setSelectedNurse] = useAtom(selectedNurseAtom);
  const [nurses] = useAtom(nursesAtom);

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
        Localiza Enfermeiros Pics
      </Typography>
      <MapContainer
        center={[-30.0387433, -51.2227375]}
        zoom={13}
        style={{
          flex: 1,
          borderRadius: 24,
        }}
      >
        <DynamicMarkersFilter />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup
          singleMarkerMode
          iconCreateFunction={createClusterCustomIcon}
          removeOutsideVisibleBounds
          maxClusterRadius={400}
          onClick={(e: LeafletMouseEvent) => setSelectedCoords(e.latlng)}
          showCoverageOnHover={true}
        >
          {nurses.map((nurse) => (
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
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </Box>
  );
}
