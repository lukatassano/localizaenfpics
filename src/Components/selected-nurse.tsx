import { MapSharp, Phone, WhatsApp } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { selectedNurseAtom } from "../atoms/nurse";
import { formatAddress } from "../utils/format-address";
import { openWhatsApp } from "../utils/whatsapp";
import { call } from "../utils/phone";
import { openMaps } from "../utils/maps";

export function SelectedNurse() {
  const [selectedNurse, setSelectedNurse] = useAtom(selectedNurseAtom);

  function handleCall(): void {
    if (!selectedNurse) {
      return;
    }

    call(selectedNurse.phone);
  }

  function handleWhatsApp() {
    if (!selectedNurse) {
      return;
    }

    const number = `+55 ${selectedNurse.phone}`;
    openWhatsApp(number);
  }

  function handleOpenMaps(): void {
    if (!selectedNurse) {
      return;
    }

    const formattedAddress = formatAddress(selectedNurse.address);
    openMaps(formattedAddress);
  }

  return (
    <Dialog
      open={!!selectedNurse}
      onClose={() => setSelectedNurse(undefined)}
      maxWidth="xl"
    >
      <DialogTitle>{selectedNurse?.name}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={4}>
          <Box display="flex" gap={8}>
            <Box>
              <Typography color="GrayText">Endereço</Typography>
              <Typography color="GrayText">Telefone</Typography>
              <Typography color="GrayText">Bairro</Typography>
              <Typography color="GrayText">Cidade</Typography>
            </Box>
            <Box>
              <Typography noWrap>
                {`${selectedNurse?.address.street} ${selectedNurse?.address.number}`}
              </Typography>
              <Typography noWrap>{selectedNurse?.phone}</Typography>
              <Typography noWrap>{selectedNurse?.address.district}</Typography>
              <Typography noWrap>{selectedNurse?.address.city}</Typography>
            </Box>
          </Box>

          <Box display="flex" gap={1}>
            <Tooltip title="Ligar para o enfermeiro" arrow>
              <Button
                sx={{ px: 3 }}
                variant="outlined"
                size="small"
                startIcon={<Phone />}
                fullWidth
                onClick={handleCall}
              >
                Ligar
              </Button>
            </Tooltip>
            <Tooltip title="Chamar enfermeiro no Whatsapp" arrow>
              <Button
                sx={{ px: 3 }}
                variant="outlined"
                size="small"
                startIcon={<WhatsApp />}
                fullWidth
                onClick={handleWhatsApp}
              >
                Whatsapp
              </Button>
            </Tooltip>
            <Tooltip title="Abrir endereço no Maps" arrow>
              <Button
                sx={{ px: 3 }}
                variant="outlined"
                size="small"
                startIcon={<MapSharp />}
                fullWidth
                onClick={handleOpenMaps}
              >
                Maps
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
