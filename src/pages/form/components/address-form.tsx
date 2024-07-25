import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Fade, TextField } from "@mui/material";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import { personalDataFormAtom } from "../../../atoms/form";
import { handleBackAtom } from "../../../atoms/stepper";
import { CompleteFormType, completeSchema } from "../../../types/form";
import axios from "axios";
import { Location } from "../../../types/address";

export function AddressForm() {
  const handleBack = useSetAtom(handleBackAtom);
  const personalDataForm = useAtomValue(personalDataFormAtom);

  const { handleSubmit, control, watch, setValue } = useForm<CompleteFormType>({
    resolver: zodResolver(completeSchema),
    defaultValues: {
      ...personalDataForm,
    },
  });

  const navigate = useNavigate();

  const [, setCoordinates] = useState<[number, number] | null>(null);

  const address = watch("address");

  const handleFormSubmit = async (form: CompleteFormType) => {
    console.log(form);

    const query = `${address.street} ${address.number} - ${address.district}, ${address.city} - ${address.state}, ${address.zipCode}`;
    const { data } = await axios.get<Location[]>(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "json",
          addressdetails: 1,
        },
      }
    );

    if (data.length > 0) {
      const { lat, lon } = data[0];
      const coords: [number, number] = [parseFloat(lat), parseFloat(lon)];
      setCoordinates(coords);
      if (coords[0] === 0 && coords[1] === 0) {
        console.warn("Coordenadas inválidas recebidas: [0, 0]");
      } else {
        setCoordinates(coords);
        const newCompany = {
          ...data,
          coordinates: coords,
        };
        const storedCompanies = JSON.parse(
          localStorage.getItem("empresas") || "[]"
        );
        storedCompanies.push(newCompany);
        localStorage.setItem("empresas", JSON.stringify(storedCompanies));
      }
    } else {
      setCoordinates(null);
      console.warn("Nenhuma coordenada encontrada para o endereço fornecido");
    }

    console.log(data);
  };

  // const zipCode = watch("address.zipCode");

  // async function setAddressByZipCode() {
  //   const { data } = await axios.get<Location>(
  //     "https://nominatim.openstreetmap.org/search",
  //     {
  //       params: {
  //         q: zipCode,
  //         format: "json",
  //         addressdetails: 1,
  //       },
  //     }
  //   );

  //   setValue("address.country", data.address?.country);
  //   setValue("address.city", data.address?.city || "");

  //   console.log(data);
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
      onSubmit={handleSubmit(handleFormSubmit)}
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

      <Box display="flex" flex={1} gap={1}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleBack}
          fullWidth
        >
          Voltar
        </Button>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Enviar
        </Button>
      </Box>
    </Box>
  );
}
