import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { Controller, useFormContext } from "react-hook-form";
import ReactInputMask from "react-input-mask";
import {
  privacyPolicyOpenAtom,
  showPolicyAtom,
} from "../../../atoms/politica-privacidade";
import { streetTypes } from "../../../data/street-types";
import { FormType } from "../../../types/form";

export function AddressForm() {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<FormType>();

  const [, setOpen] = useAtom(privacyPolicyOpenAtom);
  const [, setShowPolicy] = useAtom(showPolicyAtom);

  const lgpd = watch("lgpd");

  function handleOpenPolicy() {
    if (lgpd) {
      return;
    }
    setOpen(true);
    setShowPolicy(true);
  }

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
        name="zipCode"
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
          name="type"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <Autocomplete
              {...field}
              sx={{ flex: 0.3 }}
              options={streetTypes}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Rua/Avenida"
                  variant="outlined"
                  error={!!fieldState?.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  size="small"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                    }
                  }}
                />
              )}
              onChange={(_, value) => field.onChange(value || "")}
            />
          )}
        />
        <Controller
          name="street"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Logradouro"
              variant="outlined"
              error={!!fieldState?.error}
              helperText={fieldState.error?.message}
              fullWidth
              size="small"
              sx={{ flex: 0.6 }}
            />
          )}
        />
        <Controller
          name="number"
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
              sx={{ flex: 0.2 }}
            />
          )}
        />
      </Box>

      <Controller
        name="district"
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
        name="complement"
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
          name="city"
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
          name="state"
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
        name="country"
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
          name="exactLocation"
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
        {errors?.exactLocation && (
          <Typography variant="caption" color="error">
            {errors.exactLocation.message}
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
              onClick={handleOpenPolicy}
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
