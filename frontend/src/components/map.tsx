import { Box, Typography } from "@mui/material";
import { MapContainer } from "react-leaflet";
import "./map.css";
import { Markers } from "./markers";

export function Map() {
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
        <Markers />
      </MapContainer>
    </Box>
  );
}
