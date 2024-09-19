import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useAtom } from "jotai";
import { useMemo } from "react";
import {
  nursesAtom,
  selectedCoordsAtom,
  selectedNurseAtom,
  specialtiesFilterAtom,
} from "../atoms/nurse";
import { specialties } from "../data/specialties";
import {
  filterBySelectedCoords,
  filterBySpecialties,
} from "../utils/nurse-filters";
import { SelectedNursesContainer } from "./styles";

export function SelectedNurses() {
  const [nurses] = useAtom(nursesAtom);
  const [selectedCoords] = useAtom(selectedCoordsAtom);
  const [, setSelectedNurse] = useAtom(selectedNurseAtom);
  const [specialtiesFilter, setSpecialtiesFilter] = useAtom(
    specialtiesFilterAtom
  );

  const filteredNurses = useMemo(() => {
    return nurses
      .filter(filterBySelectedCoords(selectedCoords))
      .filter(filterBySpecialties(specialtiesFilter));
  }, [selectedCoords, specialtiesFilter, nurses]);

  return (
    <SelectedNursesContainer
      display="flex"
      flexDirection="column"
      overflow="auto"
      minWidth={300}
    >
      <Box bgcolor="white" p={2} maxHeight={120}>
        <Typography variant="h6">
          {filteredNurses.length} Enfermeiros encontrados nessa região
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" padding={2} gap={1}>
        <Autocomplete
          multiple
          onChange={(_, values) => setSpecialtiesFilter(values)}
          limitTags={1}
          options={specialties}
          getOptionLabel={(option) => option}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Filtrar por especialidades"
              placeholder="Especialidade"
            />
          )}
        />
        {filteredNurses.map((nurse, index) => (
          <Box flex={1} key={Date.now() + index}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                  noWrap
                >
                  {nurse.name}
                </Typography>
                <Typography variant="body2">
                  {nurse.street}, {nurse.number} - {nurse.district}
                </Typography>
                <Typography variant="body2">
                  {nurse.city} - {nurse.state}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => setSelectedNurse(nurse)}>
                  Ver mais
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </SelectedNursesContainer>
  );
}
