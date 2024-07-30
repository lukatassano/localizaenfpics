import { Add } from "@mui/icons-material";
import { Box, Fab, Tooltip } from "@mui/material";
import { useAtom } from "jotai";
import { formOpenAtom } from "../atoms/form";
import { Map } from "../Components/map";
import { SelectedNurse } from "../Components/selected-nurse";
import { SelectedNurses } from "../Components/selected-nurses";
import { Form } from "./form/form";

export function Home() {
  const [, setFormOpen] = useAtom(formOpenAtom);

  return (
    <Box display="flex" maxHeight="100vh" overflow="hidden">
      <Map />
      <SelectedNurses />

      <SelectedNurse />
      <Tooltip title="Cadastrar" arrow>
        <Fab
          color="primary"
          onClick={() => setFormOpen(true)}
          sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 2000 }}
        >
          <Add />
        </Fab>
      </Tooltip>

      <Form />
    </Box>
  );
}
