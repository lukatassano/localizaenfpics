import { Close, InfoOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Fade,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useAtom } from "jotai";
import {
  privacyPolicyOpenAtom,
  showPolicyAtom,
} from "../atoms/politica-privacidade";
import { formOpenAtom } from "../atoms/form";

export const PrivacyPolicyDialog = () => {
  const [formOpen] = useAtom(formOpenAtom);

  const [open, setOpen] = useAtom(privacyPolicyOpenAtom);
  const [showPolicy, setShowPolicy] = useAtom(showPolicyAtom);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
    setShowPolicy(false);
  };

  const handleClose = () => {
    setOpen(false);
    setShowPolicy(false);
  };

  const handleShowPolicy = () => {
    setShowPolicy((state) => !state);
  };

  return (
    <div>
      <Fade in={!formOpen && !open}>
        <Tooltip title="Informações" arrow>
          <Fab
            color="warning"
            onClick={handleClickOpen}
            sx={{ position: "fixed", bottom: 20, left: 20, zIndex: 2000 }}
          >
            <InfoOutlined />
          </Fab>
        </Tooltip>
      </Fade>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth="md"
      >
        <DialogTitle>
          {showPolicy
            ? "Política de Privacidade"
            : "Bem vindo ao 'Localiza Enfermeiros PICS'!"}
          <IconButton
            aria-label="close"
            onClick={handleClose}
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
          <Box pb={8}>
            {!showPolicy ? (
              <Typography variant="body1" paragraph>
                Para atualizar seu cadastro já existente, basta refazer o
                cadastro utilizando o mesmo CPF!
              </Typography>
            ) : null}
            {showPolicy ? (
              <>
                <Typography variant="body1" paragraph>
                  <strong>1. Introdução:</strong> Bem-vindo ao projeto "Localiza
                  Enfermeiros PICS". A sua privacidade é importante para nós.
                  Esta política de privacidade descreve como coletamos, usamos e
                  protegemos suas informações pessoais.
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>2. Coleta de Informações:</strong> Coletamos
                  informações pessoais que você nos fornece diretamente, como
                  nome, e-mail e número de telefone, endereços, bem como dados
                  de uso do site.
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>3. Uso das Informações:</strong> Usamos suas
                  informações para divulgar o perfil em nossa aplicação, além de
                  fornecer e melhorar nossos serviços, comunicar atualizações e
                  responder às suas solicitações.
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>4. Compartilhamento de Informações:</strong> Não
                  compartilhamos suas informações pessoais com terceiros, exceto
                  conforme necessário para cumprir a lei ou proteger nossos
                  direitos.
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>5. Segurança das Informações:</strong> Implementamos
                  medidas de segurança para proteger suas informações contra
                  acesso não autorizado, alteração ou destruição.
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>6. Seus Direitos:</strong> Você tem o direito de
                  acessar, corrigir ou excluir suas informações pessoais. Para
                  exercer esses direitos, entre em contato conosco.
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>7. Alterações na Política:</strong> Podemos atualizar
                  esta política de privacidade periodicamente. Notificaremos
                  você sobre quaisquer alterações significativas.
                </Typography>
                <Typography variant="body1" paragraph>
                  <strong>8. Contato:</strong> Se tiver dúvidas sobre esta
                  política de privacidade, entre em contato conosco via
                  daniela.dallegrave@ufrgs.br.
                </Typography>
              </>
            ) : null}
            {!showPolicy ? (
              <Button onClick={handleShowPolicy} color="primary">
                Política de privacidade
              </Button>
            ) : (
              <></>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};
