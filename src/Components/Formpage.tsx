import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";

const schema = z.object({
  Company: z.string().min(1, "Nome da empresa é obrigatório"),
  UniqueID: z
    .string()
    .min(17, "CNPJ é obrigatório")
    .max(18, "Máximo de 18 caracteres")
    .regex(
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
      "CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX"
    ),
  FantasyName: z.string(),
  address: z.object({
    ZipCode: z
      .string()
      .min(7, "CEP é obrigatório")
      .max(8, "Máximo de 8 caracteres"),
    Street: z.string(),
    District: z.string(),
    Complement: z.string(),
    City: z.string(),
    State: z.string(),
    Country: z.string(),
    Number: z.string(),
  }),
});

//////
//Define o props do forms como a tipagem do schema
/////

type FormProps = z.infer<typeof schema>;

function Form() {
  // Devolve o formstate de errors, e o useform utiliza a tipagem do schema
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormProps>({
    resolver: zodResolver(schema),
  });
  const [, setCoordinates] = useState<[number, number] | null>(null);

  const handleFormSubmit = async (data: FormProps) => {
    try {
      const empresa = {
        Company: data.Company,
        UniqueID: data.UniqueID,
        FantasyName: data.FantasyName,
        address: {
          ZipCode: data.address.ZipCode,
          Street: data.address.Street,
          Number: data.address.Number,
          District: data.address.District,
          Complement: data.address.Complement,
          City: data.address.City,
          State: data.address.State,
          Country: data.address.Country,
        },
        coordinates: [0, 0],
      };
      // Obter empresas existentes do localStorage
      const empresas = JSON.parse(localStorage.getItem("empresas") || "[]");
      // Verificar se a empresa já existe na lista
      const empresaExiste = empresas.some(
        (company: FormProps) => company.UniqueID === empresa.UniqueID
      );
      if (empresaExiste) {
        alert("Empresa com este CNPJ já está cadastrada.");
        return;
      }
      const companyAddress = data.address.ZipCode;
      // Envia requisição
      try {
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: companyAddress,
              format: "json",
              addressdetails: 1,
            },
          }
        );
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
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
          console.warn(
            "Nenhuma coordenada encontrada para o endereço fornecido"
          );
        }
      } catch (error) {
        console.error("Erro ao processar o formulário:", error);
      }
    } catch (error) {
      console.error("Erro ao processar o formulário:", error);
    }
  };
  return (
    <div>
      <Typography variant="h6" component="div" gutterBottom>
        Olá, bem vindo
      </Typography>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Controller
          name="Company"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Nome da empresa"
              variant="outlined"
              error={!!errors.Company}
              helperText={errors?.Company?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="UniqueID"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="CNPJ"
              variant="outlined"
              error={!!errors.UniqueID}
              helperText={errors?.UniqueID?.message}
              fullWidth
              inputProps={{ maxLength: 18 }}
              margin="normal"
            />
          )}
        />
        <Controller
          name="FantasyName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Nome fantasia"
              variant="outlined"
              error={!!errors.FantasyName}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="address.ZipCode"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="CEP"
              variant="outlined"
              error={!!errors.address?.ZipCode}
              helperText={errors?.address?.ZipCode?.message}
              fullWidth
              margin="normal"
              inputProps={{ maxLength: 8 }}
            />
          )}
        />
        <Controller
          name="address.Street"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Rua"
              variant="outlined"
              error={!!errors.address?.Street}
              helperText={errors?.address?.Street?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="address.Number"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Numero"
              variant="outlined"
              error={!!errors.address?.Number}
              helperText={errors?.address?.Number?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="address.District"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Bairro"
              variant="outlined"
              error={!!errors.address?.District}
              helperText={errors?.address?.District?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="address.Complement"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Complemento"
              variant="outlined"
              error={!!errors.address?.Complement}
              helperText={errors?.address?.Complement?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="address.City"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Cidade"
              variant="outlined"
              error={!!errors.address?.City}
              helperText={errors?.address?.City?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="address.State"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Estado"
              variant="outlined"
              error={!!errors.address?.State}
              helperText={errors?.address?.State?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="address.Country"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="País"
              variant="outlined"
              error={!!errors.address?.Country}
              helperText={errors?.address?.Country?.message}
              fullWidth
              margin="normal"
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary">
          Enviar
        </Button>
      </form>
    </div>
  );
}

export default Form;
