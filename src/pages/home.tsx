import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Fab,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { Outlet, useNavigate } from "react-router-dom";
import { filteredNursesAtom, selectedNurseAtom } from "../atoms/nurse";
import { Map } from "../Components/map";
import { SelectedNurse } from "../Components/selected-nurse";

export function Home() {
  const navigate = useNavigate();

  const [filteredNurses] = useAtom(filteredNursesAtom);
  const [, setSelectedNurse] = useAtom(selectedNurseAtom);

  return (
    <Box display="flex" height="100vh">
      <Map />

      <Box
        sx={{
          width: 300,
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 1000,
          border: "1px solid #999",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box display="flex" flexDirection="column" overflow="auto">
          <Box bgcolor="white" p={2} maxHeight={120}>
            <Typography variant="h6">
              {filteredNurses.length} Enfermeiros encontrados nessa região
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" padding={2} gap={1}>
            {filteredNurses.map((nurse) => (
              <Box flex={1}>
                <Card variant="outlined">
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
                    <Button
                      size="small"
                      onClick={() => setSelectedNurse(nurse)}
                    >
                      Ver mais
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <SelectedNurse />

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
