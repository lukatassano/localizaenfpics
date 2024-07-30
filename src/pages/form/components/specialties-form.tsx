import { Box, Chip, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { CompleteFormType } from "../../../types/form";
import { specialties } from "../../../data/specialties";

export function SpecialtiesForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CompleteFormType>();

  return (
    <Box display="flex" gap={2} flexDirection="column">
      <Typography>Selecione suas especialidades</Typography>
      <Controller
        name="specialties"
        control={control}
        render={({ field }) => (
          <Box display="flex" flexWrap="wrap" gap={0.5} maxWidth={500}>
            {specialties.map((specialty) => (
              <Box
                key={specialty}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  const currentValue = (field.value as string[]) || [];
                  if (currentValue.includes(specialty)) {
                    field.onChange(
                      currentValue.filter((item) => item !== specialty)
                    );
                  } else {
                    field.onChange([...currentValue, specialty]);
                  }
                }}
              >
                <Chip
                  label={specialty}
                  color={
                    ((field.value as string[]) || []).includes(specialty)
                      ? "primary"
                      : "default"
                  }
                />
              </Box>
            ))}
          </Box>
        )}
      />
      {errors.specialties && (
        <Typography variant="caption" color="error">
          {errors.specialties.message}
        </Typography>
      )}
    </Box>
  );
}
