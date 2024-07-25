import { Box, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import InputMask from "react-input-mask";

export function AddressForm() {
  const { control } = useFormContext();

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
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      width={500}
      paddingTop={2}
      gap={2}
    >
      <Controller
        name="address.zipCode"
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <InputMask
            mask="99999-999"
            maskChar=""
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            children={() => (
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
            )}
          />
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
    </Box>
  );
}
