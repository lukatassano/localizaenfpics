import { Box, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import ReactInputMask from "react-input-mask";
import { FormType } from "../../../types/form";

export function PersonalForm() {
  const { control } = useFormContext<FormType>();

  return (
    <Box display="flex" flexDirection="column" gap={2} paddingTop={2} flex={1}>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Nome *"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState?.error?.message}
            size="small"
            sx={{ flex: 1 }}
            fullWidth
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
          <ReactInputMask
            mask="999.999.999-99"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          >
            <TextField
              {...field}
              placeholder="999.999.999-99"
              label="CPF *"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              size="small"
            />
          </ReactInputMask>
        )}
      />

      <Controller
        name="phone"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <ReactInputMask
            mask="(99) 99999-9999"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          >
            <TextField
              {...field}
              label="Telefone *"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              size="small"
            />
          </ReactInputMask>
        )}
      />

      <Controller
        name="birthday"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <ReactInputMask
            mask="99/99/9999"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          >
            <TextField
              {...field}
              label="Data de nascimento"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              size="small"
            />
          </ReactInputMask>
        )}
      />

      <Controller
        name="gender"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <TextField
            {...field}
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
        name="email"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Email"
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
