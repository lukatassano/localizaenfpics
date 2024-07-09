import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "./map.css";
import { Componente } from "./teste";

interface Company {
  Company: string;
  UniqueID: string;
  FantasyName: string;
  address: {
    ZipCode: string;
    Street: string;
    Number: string;
    District: string;
    Complement?: string;
    City: string;
    State: string;
    Country: string;
  };
  coordinates: [number, number];
}

function Map() {
  const [companies, setCompanies] = useState<Company[]>([]);

  const loadCompanies = () => {
    try {
      const storedCompanies: Company[] = JSON.parse(
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
    <div className="map-container">
      <MapContainer
        center={[-30.0387433, -51.2227375]}
        zoom={15}
        style={{ height: "400px", width: "100%" }}
      >
        <Componente />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {companies.map((company, index) => (
          <Marker key={index} position={company.coordinates} />
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
