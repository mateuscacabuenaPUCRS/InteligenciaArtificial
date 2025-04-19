import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";

interface SquareState {
  value: "X" | "O" | null;
}

const Item = styled(Paper)<{ player: "X" | "O" | null }>(({ player }) => ({
  width: "150px",
  height: "150px",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "none",
  border: "none",
  fontSize: "64px",
  fontWeight: "bold",
  backgroundColor: "#dadada",
  transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
  ...(player === "X" && {
    backgroundColor: "#e3f2fd",
    color: "#2196f3",
  }),
  ...(player === "O" && {
    backgroundColor: "#ffebee",
    color: "#f44336",
  }),
  ...(player === null && {
    color: "transparent",
    "&:hover": {
      backgroundColor: "#f8f8f8e3",
    },
  }),
}));

export default function ResponsiveGrid() {
  const [squares, setSquares] = useState<SquareState[]>(
    Array(9)
      .fill(null)
      .map(() => ({ value: null }))
  );
  const [isXNext, setIsXNext] = useState(true);

  const handleClick = (index: number) => {
    if (squares[index].value) return; // Se já foi clicado, não faz nada

    const newSquares = squares.map((square, i) => ({
      value: i === index ? (isXNext ? "X" : "O") : square.value,
    }));

    setSquares(newSquares);
    setIsXNext(!isXNext);
    console.log(`Clicked square ${index + 1}, placed ${isXNext ? "X" : "O"}`);
  };

  const handleRestart = () => {
    setSquares(
      Array(9)
        .fill(null)
        .map(() => ({ value: null }))
    );
    setIsXNext(true);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="16px">
      <Button
        variant="contained"
        onClick={handleRestart}
        sx={{
          backgroundColor: "#aaaf4c",
          "&:hover": {
            backgroundColor: "#aaaf4c",
          },
        }}
      >
        Start New Game
      </Button>

      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 150px)"
        margin="auto"
        padding="32px"
        width="fit-content"
        gap="8px"
        borderRadius="8px"
      >
        {squares.map((square, index) => (
          <Item
            key={index}
            onClick={() => handleClick(index)}
            player={square.value}
          >
            {square.value}
          </Item>
        ))}
      </Box>
    </Box>
  );
}
