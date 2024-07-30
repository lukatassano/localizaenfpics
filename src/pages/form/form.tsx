import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, ArrowForward, Close, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Step,
  StepLabel,
  Stepper,
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

const steps = ["Dados pessoais", "Especialidade", "Endereço"];

export const Form = () => {
  const [formOpen, setFormOpen] = useAtom(formOpenAtom);
  const [activeStep] = useAtom(activeStepAtom);
  const [, handleReset] = useAtom(handleResetAtom);
  const [, handleBack] = useAtom(handleBackAtom);
  const [, handleNext] = useAtom(handleNextAtom);
  const [, setNurses] = useAtom(nursesAtom);

  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

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

  async function handleSubmitForm(form: CompleteFormType) {
    setIsLoading(true);
    const result = await searchLocationByAddress(form.address);
    if (!result) {
      return;
    }

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
    reset({});
    setIsLoading(false);
  }

  useEffect(() => {
    handleReset();
  }, []);

  return (
    <FormProvider {...methods}>
      <Dialog
        open={formOpen}
        maxWidth="xl"
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
              <Box
                overflow="hidden"
                display="flex"
                minHeight={470}
                minWidth={510}
              >
                <Fade in={activeStep === 0} timeout={300} unmountOnExit>
                  <Box>
                    <PersonalForm />
                  </Box>
                </Fade>
                <Fade in={activeStep === 1} unmountOnExit>
                  <Box>
                    <SpecialtiesForm />
                  </Box>
                </Fade>
                <Fade in={activeStep === 2} unmountOnExit>
                  <Box>
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
          </Box>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
