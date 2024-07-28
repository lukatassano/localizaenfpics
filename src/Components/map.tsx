import { Box } from "@mui/material";
import { useAtom } from "jotai";
import { LatLngExpression, LeafletMouseEvent } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import {
  nursesAtom,
  selectedCoordsAtom,
  selectedNurseAtom,
} from "../atoms/nurse";
import { DynamicMarkersFilter } from "./dynamic-markers-filter";
import "./map.css";

export function Map() {
  const [, setSelectedCoords] = useAtom(selectedCoordsAtom);
  const [, setSelectedNurse] = useAtom(selectedNurseAtom);
  const [nurses] = useAtom(nursesAtom);

  return (
    <MapContainer
      center={[-30.0387433, -51.2227375]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <DynamicMarkersFilter />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        singleMarkerMode
        removeOutsideVisibleBounds
        maxClusterRadius={400}
        onClick={(e: LeafletMouseEvent) => setSelectedCoords(e.latlng)}
      >
        {nurses.map((nurse) => (
          <Box>
            <Marker
              position={nurse.address.coordinates as LatLngExpression}
              eventHandlers={{
                click: () => setSelectedNurse(nurse),
              }}
            />
          </Box>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
