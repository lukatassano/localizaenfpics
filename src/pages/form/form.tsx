import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { activeStepAtom } from "../../atoms/stepper";
import { AddressForm } from "./components/address-form";
import { PersonalForm } from "./components/personal-form";

const steps = ["Dados pessoais", "Endereço"];

export const Form = () => {
  const navigate = useNavigate();
  const [activeStep] = useAtom(activeStepAtom);

  return (
    <Dialog open maxWidth="xl" onClose={() => navigate("/")}>
      <DialogTitle>Cadastro</DialogTitle>
      <DialogContent>
        <Box>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box width={500} overflow="hidden" display="flex">
            <Slide
              in={activeStep === 0}
              timeout={300}
              unmountOnExit
              direction="right"
            >
              <Box>
                <PersonalForm />
              </Box>
            </Slide>
            <Slide in={activeStep === 1} timeout={300} direction="left">
              <Box>
                <AddressForm />
              </Box>
            </Slide>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
