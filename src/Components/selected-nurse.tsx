import { MapSharp, WhatsApp } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { selectedNurseAtom } from "../atoms/nurse";

export function SelectedNurse() {
  const [selectedNurse, setSelectedNurse] = useAtom(selectedNurseAtom);

  return (
    <Dialog open={!!selectedNurse} onClose={() => setSelectedNurse(undefined)}>
      <DialogTitle>{selectedNurse?.name}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            {selectedNurse?.address.exactLocation ? (
              <Typography>
                Endereço:{" "}
                {`${selectedNurse?.address.street} ${selectedNurse?.address.number}`}
              </Typography>
            ) : (
              <></>
            )}
            <Typography>Telefone: {selectedNurse?.phone}</Typography>
            {/* <Divider>Endereço</Divider> */}
            <Typography>Bairro: {selectedNurse?.address.district}</Typography>
            <Typography>Cidade: {selectedNurse?.address.city}</Typography>
          </Box>

          <Box display="flex" gap={2}>
            <Tooltip title="Chamar enfermeiro no whatsapp" arrow>
              <IconButton>
                <WhatsApp />
              </IconButton>
            </Tooltip>
            <Tooltip title="Abrir endereço no Maps" arrow>
              <IconButton>
                <MapSharp />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
