import { Box } from "@mui/material";
import "./App.css";
import ResponsiveGrid from "./components/ResponsiveGrid";

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
    </Box>
  );
}

export default App;
