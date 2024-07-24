import Form from "./Components/FormPage";
import Map from "./Components/Map";
import CardComponent from "./Components/Cards";
import Container from "@mui/material/Container";
import { Box, CssBaseline } from "@mui/material";
import Grid from "@mui/material/Grid";

function App() {
  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="xl"
        sx={{
          bgcolor: "background.paper",
          boxShadow: 3,
          p: 3,
          borderRadius: 2,
          mt: 4,
          mb: 4,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                bgcolor: "background.paper",
                boxShadow: 3,
                p: 3,
                borderRadius: 2,
                mt: 4,
                mb: 4,
                textAlign: "center",
              }}
            >
              <Form />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={8}>
            <Box
              sx={{
                bgcolor: "background.paper",
                boxShadow: 3,
                p: 3,
                borderRadius: 2,
                mt: 4,
                textAlign: "center",
              }}
            >
              <Map />
            </Box>
            <Box
              sx={{
                bgcolor: "background.paper",
                boxShadow: 3,
                p: 3,
                borderRadius: 2,
                mt: 4,
                textAlign: "center",
              }}
            >
              <CardComponent />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default App;
