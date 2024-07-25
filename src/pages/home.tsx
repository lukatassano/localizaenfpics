import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { filteredNursesAtom } from "../atoms/nurse";
import { Map } from "../Components/map";
import { PersonalDataFormType } from "../types/form";

export function Home() {
  const navigate = useNavigate();

  const [filteredNurses] = useAtom(filteredNursesAtom);
  const [enfergay, setEnfergay] = useState<PersonalDataFormType | undefined>();

  return (
    <Box display="flex" height="100vh">
      <Map />

      <Box
        sx={{
          width: 300,
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 1000,
          border: "1px solid #999",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          p={2}
          overflow="auto"
        >
          {filteredNurses.map((nurse) => (
            <Card>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                  noWrap
                >
                  {nurse.name}
                </Typography>
                <Typography variant="body2" noWrap>
                  Rua: {nurse.address.street} {nurse.address.number}
                </Typography>
                <Typography variant="body2" noWrap>
                  Bairro: {nurse.address.district}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => setEnfergay(nurse)}>
                  Ver mais
                </Button>
              </CardActions>
            </Card>
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
