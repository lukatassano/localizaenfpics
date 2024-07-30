import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import ReactInputMask from "react-input-mask";
import { CompleteFormType } from "../../../types/form";

export function AddressForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CompleteFormType>();

  // const zipCode = watch("address.zipCode");

  // async function setAddressByZipCode() {
  //   const result = await searchLocationByZipCode(zipCode);
  //   setValue("address.country", result.address?.country);
  //   setValue("address.city", result.address?.city || "");

  //   console.log(result);
  // }

  // useEffect(() => {
  //   if (zipCode?.length === 9) {
  //     setAddressByZipCode();
  //   }
  // }, [zipCode]);

  return (
    <Box display="flex" flexDirection="column" paddingTop={2} gap={2}>
      <Controller
        name="address.zipCode"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <ReactInputMask
            mask="99999-999"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          >
            <TextField
              {...field}
              placeholder="99999-999"
              label="CEP"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
              size="small"
            />
          </ReactInputMask>
        )}
      />

      <Box display="flex" gap={1}>
        <Controller
          name="address.street"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Rua"
              variant="outlined"
              error={!!fieldState?.error}
              helperText={fieldState.error?.message}
              fullWidth
              size="small"
              sx={{ flex: 0.7 }}
            />
          )}
        />
        <Controller
          name="address.number"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Numero"
              variant="outlined"
              error={!!fieldState?.error}
              helperText={fieldState.error?.message}
              size="small"
              sx={{ flex: 0.3 }}
            />
          )}
        />
      </Box>

      <Controller
        name="address.district"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Bairro"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
            size="small"
          />
        )}
      />
      <Controller
        name="address.complement"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Complemento"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
            size="small"
          />
        )}
      />

      <Box display="flex" gap={1}>
        <Controller
          name="address.city"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Cidade"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              size="small"
              sx={{ flex: 0.8 }}
            />
          )}
        />
        <Controller
          name="address.state"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Estado"
              variant="outlined"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              size="small"
              sx={{ flex: 0.2 }}
            />
          )}
        />
      </Box>
      <Controller
        name="address.country"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="País"
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
            size="small"
          />
        )}
      />
      <Box pl={1} display="flex" flexDirection="column" maxWidth={500}>
        <Controller
          name="address.exactLocation"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Tooltip
              title="Ativar essa opção habilita um botão de rotas para o seu endereço"
              arrow
            >
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Compartilhar localização exata"
              />
            </Tooltip>
          )}
        />
        {errors.address?.exactLocation && (
          <Typography variant="caption" color="error">
            {errors.address.exactLocation.message}
          </Typography>
        )}
        <Controller
          name="lgpd"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
              control={<Checkbox {...field} checked={field.value} />}
              label="Concordo em compartilhar meus dados pessoais e informações fornecidas para fins de divulgação e exposição do meu perfil neste projeto, conforme descrito na política de privacidade"
            />
          )}
        />
        {errors.lgpd && (
          <Typography variant="caption" color="error">
            {errors.lgpd.message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
