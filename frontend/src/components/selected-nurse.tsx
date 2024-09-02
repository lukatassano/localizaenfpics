import { Close, MapSharp, Phone, WhatsApp } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAtom } from "jotai";
import { selectedNurseAtom } from "../atoms/nurse";
import { formatAddress } from "../utils/format-address";
import { openWhatsApp } from "../utils/whatsapp";
import { call } from "../utils/phone";
import { openMaps } from "../utils/maps";
import { SelectedNurseBox } from "./styles";
import { isValidURL } from "../utils/is-valid-url";

export function SelectedNurse() {
  const [selectedNurse, setSelectedNurse] = useAtom(selectedNurseAtom);

  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  const showExactLocation = !!selectedNurse?.address.exactLocation;
  const showSocialMedias =
    !!selectedNurse?.instagram || !!selectedNurse?.facebook;

  const address = `${
    selectedNurse?.address.type ? `${selectedNurse?.address.type} ` : ""
  }${selectedNurse?.address.street} ${
    showExactLocation ? selectedNurse?.address.number : ""
  }`;

  return (
    <Dialog
      open={!!selectedNurse}
      onClose={() => setSelectedNurse(undefined)}
      fullScreen={fullScreen}
    >
      <DialogTitle>
        {selectedNurse?.name}
        <IconButton
          aria-label="close"
          onClick={() => setSelectedNurse(undefined)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" gap={3} flexDirection="column">
          <Box display="grid" gap={1} gridTemplateColumns="1fr 1fr">
            <Typography color="GrayText">Endereço</Typography>
            <Typography noWrap>{address}</Typography>

            <Typography color="GrayText">Telefone</Typography>
            <Typography noWrap>{selectedNurse?.phone}</Typography>

            <Typography color="GrayText">Bairro</Typography>
            <Typography noWrap>{selectedNurse?.address.district}</Typography>

            <Typography color="GrayText">Cidade</Typography>
            <Typography noWrap>{selectedNurse?.address.city}</Typography>

            {selectedNurse?.coren && (
              <>
                <Typography color="GrayText">COREN</Typography>
                <Typography noWrap>{selectedNurse?.coren}</Typography>
              </>
            )}
            {(selectedNurse?.specialties || []).length ? (
              <>
                <Typography color="GrayText">Especialidades</Typography>
                <Box display="flex" gap={0.3} flexWrap="wrap">
                  {(selectedNurse?.specialties || []).map((specialty) => (
                    <Chip
                      key={specialty}
                      label={specialty}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </>
            ) : (
              <></>
            )}
          </Box>

          {showSocialMedias ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <Divider>
                <Typography variant="caption">Redes sociais</Typography>
              </Divider>

              <Box display="grid" gap={1} gridTemplateColumns="1fr 1fr">
                {selectedNurse?.email && (
                  <>
                    <Typography color="GrayText">Email</Typography>
                    <Typography noWrap>{selectedNurse?.email}</Typography>
                  </>
                )}
                {selectedNurse?.instagram && (
                  <>
                    <Typography color="GrayText">Instagram</Typography>
                    {isValidURL(selectedNurse.instagram) ? (
                      <Link
                        href={selectedNurse.instagram}
                        target="_blank"
                        rel="noopener"
                        noWrap
                      >
                        {selectedNurse.instagram}
                      </Link>
                    ) : (
                      <Typography noWrap>{selectedNurse?.instagram}</Typography>
                    )}
                  </>
                )}
                {selectedNurse?.facebook && (
                  <>
                    <Typography color="GrayText">Facebook</Typography>
                    {isValidURL(selectedNurse.facebook) ? (
                      <Link
                        href={selectedNurse.facebook}
                        target="_blank"
                        rel="noopener"
                        noWrap
                      >
                        {selectedNurse.facebook}
                      </Link>
                    ) : (
                      <Typography noWrap>{selectedNurse.facebook}</Typography>
                    )}
                  </>
                )}
              </Box>
            </Box>
          ) : (
            <></>
          )}

          <SelectedNurseBox display="flex" gap={1} flexDirection="column">
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
            {showExactLocation ? (
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
            ) : (
              <></>
            )}
          </SelectedNurseBox>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
