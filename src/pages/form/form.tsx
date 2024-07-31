import { zodResolver } from "@hookform/resolvers/zod";
import { Add, ArrowBack, ArrowForward, Close, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Fade,
  IconButton,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ref, set } from "firebase/database";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { v4 } from "uuid";
import { formOpenAtom } from "../../atoms/form";
import { nursesAtom } from "../../atoms/nurse";
import {
  activeStepAtom,
  handleBackAtom,
  handleNextAtom,
  handleResetAtom,
} from "../../atoms/stepper";
import { db } from "../../firebase.config";
import { CompleteFormType, completeSchema } from "../../types/form";
import { searchLocationByAddress } from "../../utils/search-location";
import { AddressForm } from "./components/address-form";
import { PersonalForm } from "./components/personal-form";
import { SpecialtiesForm } from "./components/specialties-form";
import { privacyPolicyOpenAtom } from "../../atoms/politica-privacidade";
import { mutate } from "swr";

const steps = ["Dados pessoais", "Especialidade", "Endereço"];

export const Form = () => {
  const theme = useTheme();

  const [formOpen, setFormOpen] = useAtom(formOpenAtom);
  const [privacyPolicyOpen] = useAtom(privacyPolicyOpenAtom);

  const [activeStep] = useAtom(activeStepAtom);
  const [, handleReset] = useAtom(handleResetAtom);
  const [, handleBack] = useAtom(handleBackAtom);
  const [, handleNext] = useAtom(handleNextAtom);
  const [, setNurses] = useAtom(nursesAtom);

  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogMessageOpen, setDialogMessageOpen] = useState(false);

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const methods = useForm<CompleteFormType>({
    resolver: zodResolver(completeSchema),
  });

  const { handleSubmit, trigger, reset } = methods;

  const showNextButton = activeStep < 2;

  const nextStep = async () => {
    switch (activeStep) {
      case 0:
        if (!(await trigger(["name", "cpf", "phone"]))) return;
        break;
      case 1:
        if (!(await trigger(["specialties"]))) return;
        break;
      default:
        return;
    }

    handleNext();
  };

  function handleCloseSnackbar() {
    setSnackbarOpen(false);
  }

  function handleCloseDialogMessage() {
    setDialogMessageOpen(false);
  }

  async function searchCoords(form: CompleteFormType) {
    const result = await searchLocationByAddress(form.address);

    if (!result) {
      setSnackbarOpen(true);
      setDialogMessageOpen(true);
      setIsLoading(false);
      throw new Error("Endereço não encontrado");
    }

    return result;
  }

  async function handleSubmitForm(form: CompleteFormType) {
    setIsLoading(true);

    const result = dialogMessageOpen
      ? { lat: "-1", lon: "-1" }
      : await searchCoords(form);

    const { lat, lon } = result;
    const newNurse: CompleteFormType = {
      ...form,
      uuid: v4(),
      address: {
        ...form.address,
        coordinates: [parseFloat(lat), parseFloat(lon)],
      },
    };

    set(ref(db, `nurses/${newNurse.uuid}`), newNurse);
    setNurses((state) => {
      return [...state, newNurse];
    });

    handleReset();
    setFormOpen(false);
    handleCloseDialogMessage();
    reset({});
    setIsLoading(false);
    mutate(["nurses"]);
  }

  useEffect(() => {
    handleReset();
  }, []);

  return (
    <Box>
      <Fade in={!formOpen && !privacyPolicyOpen}>
        <Tooltip title="Cadastrar" arrow>
          <Fab
            color="primary"
            onClick={() => setFormOpen(true)}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 2000,
            }}
          >
            <Add />
          </Fab>
        </Tooltip>
      </Fade>

      <FormProvider {...methods}>
        <Dialog
          open={formOpen}
          maxWidth="lg"
          fullScreen={fullScreen}
          onClose={() => setFormOpen(false)}
        >
          <DialogTitle>
            Cadastro
            <IconButton
              aria-label="close"
              onClick={() => setFormOpen(false)}
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
            <Box component="form" onSubmit={handleSubmit(handleSubmitForm)}>
              <Box padding={0}>
                <Stepper activeStep={activeStep}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <Box display="flex" gap={2} flexDirection="column">
                <Box overflow="hidden" display="flex" minHeight={470}>
                  <Fade in={activeStep === 0} timeout={300} unmountOnExit>
                    <Box flex={1}>
                      <PersonalForm />
                    </Box>
                  </Fade>
                  <Fade in={activeStep === 1} unmountOnExit>
                    <Box flex={1}>
                      <SpecialtiesForm />
                    </Box>
                  </Fade>
                  <Fade in={activeStep === 2} unmountOnExit>
                    <Box flex={1}>
                      <AddressForm />
                    </Box>
                  </Fade>
                </Box>

                <Box display="flex" flex={1} gap={1}>
                  <Button
                    onClick={handleBack}
                    fullWidth
                    variant="outlined"
                    disabled={activeStep === 0}
                    startIcon={<ArrowBack />}
                  >
                    Voltar
                  </Button>

                  <LoadingButton
                    loading={isLoading}
                    type={showNextButton ? "button" : "submit"}
                    variant="contained"
                    loadingPosition="end"
                    color="primary"
                    endIcon={showNextButton ? <ArrowForward /> : <Save />}
                    onClick={nextStep}
                    fullWidth
                  >
                    {showNextButton ? "Próximo" : "Enviar"}
                  </LoadingButton>
                </Box>
              </Box>

              <Dialog
                open={dialogMessageOpen}
                onClose={handleCloseDialogMessage}
                component={"form"}
              >
                <DialogTitle>Ops...</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Parece que não conseguimos encontrar o endereço que você
                    forneceu. Por favor, escolha uma das opções abaixo:
                  </DialogContentText>
                  <DialogContentText>
                    1. <strong>Revisar Endereço:</strong> Verifique e corrija o
                    endereço informado. Pode haver um erro de digitação ou algum
                    dado faltando.
                  </DialogContentText>
                  <DialogContentText>
                    2. <strong>Enviar Mesmo Assim:</strong> Envie o endereço da
                    forma como está. Tentaremos localizar manualmente e
                    retornaremos com uma resposta em até 24 horas.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setDialogMessageOpen(false)}
                    color="primary"
                    variant="outlined"
                    startIcon={<ArrowBack />}
                  >
                    Revisar Endereço
                  </Button>

                  <LoadingButton
                    loading={isLoading}
                    type="submit"
                    variant="contained"
                    loadingPosition="end"
                    endIcon={<Save />}
                    color="primary"
                  >
                    Enviar Mesmo Assim
                  </LoadingButton>
                </DialogActions>
              </Dialog>
            </Box>
          </DialogContent>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={7000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            Endereço não encontrado
          </Alert>
        </Snackbar>
      </FormProvider>
    </Box>
  );
};
