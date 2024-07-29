import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowBack, ArrowForward, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Step,
  StepLabel,
  Stepper,
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

const steps = ["Dados pessoais", "Endereço"];

export const Form = () => {
  const [formOpen, setFormOpen] = useAtom(formOpenAtom);
  const [activeStep] = useAtom(activeStepAtom);
  const [, handleReset] = useAtom(handleResetAtom);
  const [, handleBack] = useAtom(handleBackAtom);
  const [, handleNext] = useAtom(handleNextAtom);
  const [, setNurses] = useAtom(nursesAtom);

  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<CompleteFormType>({
    resolver: zodResolver(completeSchema),
  });

  const { handleSubmit, trigger, reset } = methods;

  const nextStep = async () => {
    if (activeStep !== 0) {
      return;
    }

    const isStepValid = await trigger(["name", "cpf", "phone"]);
    if (isStepValid) {
      handleNext();
    }
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

    handleBack();
    setFormOpen(false);
    reset({});
    setIsLoading(false);
  }

  useEffect(() => {
    handleReset();
  }, []);

  return (
    <FormProvider {...methods}>
      <Dialog open={formOpen} maxWidth="xl" onClose={() => setFormOpen(false)}>
        <DialogTitle>Cadastro</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(handleSubmitForm)}>
            <Box padding={2}>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Box display="flex" gap={2} flexDirection="column">
              <Box width={500} overflow="hidden" display="flex">
                <Slide in={activeStep === 0} timeout={300} direction="right">
                  <Box
                    sx={{
                      display: [0, 0.4].includes(activeStep) ? "flex" : "none",
                    }}
                  >
                    <PersonalForm />
                  </Box>
                </Slide>
                <Slide
                  in={activeStep === 1}
                  mountOnEnter
                  timeout={300}
                  direction="left"
                >
                  <Box>
                    <AddressForm />
                  </Box>
                </Slide>
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
                  type={activeStep === 1 ? "submit" : "button"}
                  variant="contained"
                  loadingPosition="start"
                  color="primary"
                  endIcon={activeStep === 0 ? <ArrowForward /> : <Save />}
                  onClick={nextStep}
                  fullWidth
                >
                  {activeStep === 0 ? "Próximo" : "Enviar"}
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
