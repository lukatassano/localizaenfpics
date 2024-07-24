import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { FormType } from "../types/form";
import "./map.css";
import { Componente } from "./teste";

export function Map() {
  const [companies, setCompanies] = useState<FormType[]>([]);

  const loadCompanies = () => {
    try {
      const storedCompanies: FormType[] = JSON.parse(
        localStorage.getItem("empresas") || "[]"
      );
      setCompanies(storedCompanies);
    } catch (error) {
      console.warn("Erro ao carregar empresas do localStorage:", error);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadCompanies();
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <MapContainer
      center={[-30.0387433, -51.2227375]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <Componente />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {companies.map((company, index) => (
        <Marker
          key={index}
          position={company.coordinates as LatLngExpression}
        />
      ))}
    </MapContainer>
  );
}
