import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAtom } from "jotai";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { nursesAtom } from "../../atoms/nurse";
import {
  activeStepAtom,
  handleBackAtom,
  handleNextAtom,
} from "../../atoms/stepper";
import { CompleteFormType, completeSchema } from "../../types/form";
import { searchLocationByAddress } from "../../utils/search-location";
import { AddressForm } from "./components/address-form";
import { PersonalForm } from "./components/personal-form";

const steps = ["Dados pessoais", "Endereço"];

export const Form = () => {
  const navigate = useNavigate();
  const [activeStep] = useAtom(activeStepAtom);
  const [, handleBack] = useAtom(handleBackAtom);
  const [, handleNext] = useAtom(handleNextAtom);
  const [, setNurses] = useAtom(nursesAtom);

  const methods = useForm<CompleteFormType>({
    resolver: zodResolver(completeSchema),
  });

  const { handleSubmit, trigger } = methods;

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
    const result = await searchLocationByAddress(form.address);
    if (!result) {
      return;
    }

    const { lat, lon } = result;
    const newNurse: CompleteFormType = {
      ...form,
      address: {
        ...form.address,
        coordinates: [parseFloat(lat), parseFloat(lon)],
      },
    };

    setNurses((state) => {
      return [...state, newNurse];
    });

    handleBack();
    navigate("/");
  }

  return (
    <FormProvider {...methods}>
      <Dialog open maxWidth="xl" onClose={() => navigate("/")}>
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
                >
                  Voltar
                </Button>
                <Button
                  type={activeStep === 1 ? "submit" : "button"}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={nextStep}
                >
                  {activeStep === 0 ? "Próximo" : "Enviar"}
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
