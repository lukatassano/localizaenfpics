import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Fade, TextField } from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import { Controller, useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { personalDataFormAtom } from "../../../atoms/form";
import { handleNextAtom } from "../../../atoms/stepper";
import { PersonalDataFormType, personalDataSchema } from "../../../types/form";

export function PersonalForm() {
  const handleNext = useSetAtom(handleNextAtom);
  const [personalDataForm, setPersonalDataForm] = useAtom(personalDataFormAtom);

  const { handleSubmit, control } = useForm<PersonalDataFormType>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      ...personalDataForm,
    },
  });

  function handleFormSubmit(data: PersonalDataFormType) {
    setPersonalDataForm(data);
    handleNext();
  }

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap={2}
      paddingTop={2}
      width={500}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Nome"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState?.error?.message}
            size="small"
          />
        )}
      />

      <Controller
        name="cpf"
        control={control}
        rules={{
          required: "CPF é obrigatório",
          pattern: {
            value: /^\d{3}\.\d{3}\.\d{3}\.-\d{2}$/,
            message: "CPF invalido",
          },
        }}
        render={({ field, fieldState }) => (
          <InputMask
            mask="999.999.999-99"
            maskChar=""
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            children={() => (
              <TextField
                {...field}
                placeholder="999.999.999-99"
                label="CPF"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                size="small"
              />
            )}
          />
        )}
      />

      <Controller
        name="phone"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <InputMask
            mask="(99) 99999-9999"
            maskChar=""
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            children={() => (
              <TextField
                {...field}
                label="Telefone"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                size="small"
              />
            )}
          />
        )}
      />
      <Controller
        name="birthday"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            type="date"
            label="Data de nascimento"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
            size="small"
          />
        )}
      />
      <Controller
        name="gender"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            // type="date"
            label="Genero"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
            size="small"
          />
        )}
      />
      <Controller
        name="coren"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Numero do COREN"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
            size="small"
          />
        )}
      />

      <Controller
        name="facebook"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Facebook"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
            size="small"
          />
        )}
      />
      <Controller
        name="instagram"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Instagram"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
            size="small"
          />
        )}
      />

      <Box display="flex" flex={1} gap={1}>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Próximo
        </Button>
      </Box>
    </Box>
  );
}
