import { Box } from "@mui/material";
import "./App.css";
import ResponsiveGrid from "./components/ResponsiveGrid";
import GraficoEvolucao from "./components/GraficoEvolucao";

function App() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <ResponsiveGrid />
      <GraficoEvolucao />
    </Box>
  );
}

export default App;
