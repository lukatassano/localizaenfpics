import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Tooltip,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { Map } from "../Components/Map";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { coordsAtom } from "../Components/teste";
import { PersonalDataFormType } from "../types/form";
import { LatLngExpression } from "leaflet";

export function Home() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<PersonalDataFormType[]>([]);
  const [enfergay, setEnfergay] = useState<PersonalDataFormType | undefined>();
  const coords = useAtomValue(coordsAtom);

  const loadCompanies = () => {
    try {
      const storedCompanies: PersonalDataFormType[] = JSON.parse(
        localStorage.getItem("empresas") || "[]"
      );
      setCompanies(storedCompanies);
    } catch (error) {
      console.error("Erro ao carregar empresas do localStorage:", error);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);
  const clearStorage = () => {
    localStorage.removeItem("empresas");
    setCompanies([]);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      loadCompanies();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { northEast, southWest } = coords;

  const enfergays = companies.filter((gay) => {
    if (gay.coordinates) {
      const lat = gay.coordinates[0];
      const lng = gay.coordinates[1];

      const latt = northEast.lat > lat && lat > southWest.lat;
      const lngg = northEast.lng > lng && lng > southWest.lng;
      return latt && lngg;
    }

    return false;
  });

  return (
    <Box display="flex" height="100vh">
      <Map />

      <Box
        bgcolor="black"
        sx={{
          width: 300,
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 1000,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box display="flex" flexDirection="column" gap={1} p={2}>
          {enfergays.map((gay) => (
            <Card>
              <CardContent sx={{ width: "100%" }}>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {gay.name}
                </Typography>
                <Typography variant="body2">
                  Rua: {gay.address.street} {gay.address.number}
                </Typography>
                <Typography variant="body2">
                  Bairro: {gay.address.district}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => setEnfergay(gay)}>
                  Ver mais
                </Button>
              </CardActions>
            </Card>

            // <Box
            //   key={index}
            //   sx={{
            //     bgcolor: "background.paper",
            //     boxShadow: 3,
            //     borderRadius: 2,
            //     textAlign: "center",
            //     mt: 2,
            //   }}
            // >
            //   <div>
            //     <h3>{company.FantasyName}</h3>
            //     <p>CNPJ: {company.UniqueID}</p>
            //   </div>
            // </Box>
          ))}
        </Box>
      </Box>

      <Dialog open={!!enfergay} onClose={() => setEnfergay(undefined)}>
        <DialogTitle>{enfergay?.name}</DialogTitle>
        <DialogContent></DialogContent>
      </Dialog>

      <Tooltip title="Cadastrar" arrow>
        <Fab
          color="primary"
          onClick={() => navigate("/cadastro")}
          sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 2000 }}
        >
          <Add />
        </Fab>
      </Tooltip>
      <Outlet />
    </Box>
  );
}
