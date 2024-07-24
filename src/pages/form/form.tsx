import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { FormComponent } from "../../Components/FormPage";
import { useNavigate } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import {
  activeStepAtom,
  handleBackAtom,
  handleNextAtom,
  handleResetAtom,
} from "../../atoms/stepper";
import { PersonalForm } from "./components/personal-form";
import { AddressForm } from "./components/address-form";

const steps = ["Dados pessoais", "Endereço"];

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <PersonalForm />;
    case 1:
      return <AddressForm />; // Substitua por seu componente de endereço quando estiver pronto
    default:
      return "Desconhecido";
  }
}

export const Form = () => {
  const navigate = useNavigate();
  const [activeStep] = useAtom(activeStepAtom);
  const handleNext = useSetAtom(handleNextAtom);
  const handleBack = useSetAtom(handleBackAtom);
  const handleReset = useSetAtom(handleResetAtom);

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
          <Box sx={{ mt: 2, mb: 2 }}>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography>Todos os passos foram concluídos</Typography>
                <Button onClick={handleReset}>Resetar</Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box display="flex" flexDirection="row" pt={2} width={"100%"}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Voltar
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleNext}>
                    {activeStep === steps.length - 1 ? "Finalizar" : "Próximo"}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
