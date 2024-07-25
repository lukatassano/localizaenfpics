import { useAtom } from "jotai";
import { LatLngExpression } from "leaflet";
import { Circle, MapContainer, TileLayer } from "react-leaflet";
import { nursesAtom } from "../atoms/nurse";
import { DynamicMarkersFilter } from "./dynamic-markers-filter";
import "./map.css";

export function Map() {
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
      {nurses.map((nurse) => (
        <Circle
          center={nurse.address.coordinates as LatLngExpression}
          radius={400}
        />
      ))}
    </MapContainer>
  );
}
