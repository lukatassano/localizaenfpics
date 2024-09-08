import { Box, Chip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { specialties } from "../../../data/specialties";
import { FormType } from "../../../types/form";

export function SpecialtiesForm() {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    control,
    formState: { errors },
  } = useFormContext<FormType>();

  return (
    <Box
      display="flex"
      gap={2}
      flexDirection="column"
      flex={1}
      pt={2}
      maxWidth={500}
    >
      <Typography>Selecione suas especialidades</Typography>
      <Controller
        name="specialties"
        control={control}
        render={({ field }) => (
          <Box display="flex" flexWrap="wrap" gap={0.5}>
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
                  size={small ? "small" : "medium"}
                  sx={{ fontSize: small ? 12 : 14 }}
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
