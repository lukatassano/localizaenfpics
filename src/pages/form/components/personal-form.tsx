import { Box, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { PersonalDataFormType } from "../../../types/form";
import { InputMaskCorrect } from "../../../Components/input-mask-correct";

export function PersonalForm() {
  const { control } = useFormContext<PersonalDataFormType>();

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      paddingTop={2}
      width={500}
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
          <InputMaskCorrect
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
          <InputMaskCorrect
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
          <InputMaskCorrect
            mask="99/99/9999"
            maskChar="_"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          >
            {() => (
              <TextField
                {...field}
                label="Data de nascimento"
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                size="small"
              />
            )}
          </InputMaskCorrect>
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
    </Box>
  );
}
