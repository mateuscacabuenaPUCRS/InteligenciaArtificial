import { useState } from "react";
import "./../App.css";
import { Box, Paper, styled } from "@mui/material";

type Square = {
  value: "X" | "O" | null;
};

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

const initialSquares: Square[] = Array(9)
  .fill(null)
  .map(() => ({ value: null }));

export function ResponsiveGrid() {
  const [squares, setSquares] = useState<Square[]>(initialSquares);
  const [gameOver, setGameOver] = useState(false);

  const verificarEstadoReal = (tab: Square[]): string => {
    const linhas = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const linha of linhas) {
      const [a, b, c] = linha;
      if (
        tab[a].value &&
        tab[a].value === tab[b].value &&
        tab[a].value === tab[c].value
      ) {
        return tab[a].value === "X" ? "win" : "lose";
      }
    }
    if (tab.every((s) => s.value !== null)) return "tie";
    return "hasgame";
  };

  const handleClick = async (index: number) => {
    if (squares[index].value || gameOver) return;

    const newSquares = squares.map((square, i) => ({
      value: i === index ? "X" : square.value,
    }));
    setSquares(newSquares);

    const estadoReal = verificarEstadoReal(newSquares);
    if (estadoReal !== "hasgame") {
      setGameOver(true);
      return;
    }

    const tabuleiroNumerico = newSquares.map((sq) => {
      if (sq.value === "X") return 1;
      if (sq.value === "O") return -1;
      return 0;
    });

    try {
      const resposta = await fetch("http://localhost:8000/jogada-rede", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabuleiro: tabuleiroNumerico }),
      });

      const data = await resposta.json();
      const jogadaIA = data.jogada;

      if (newSquares[jogadaIA].value !== null) {
        console.error("Jogada inválida da IA:", jogadaIA);
        return;
      }

      const respostaSquares = newSquares.map((square, i) => ({
        value: i === jogadaIA ? "O" : square.value,
      }));
      setSquares(respostaSquares);

      const novoEstado = verificarEstadoReal(respostaSquares);
      if (novoEstado !== "hasgame") {
        setGameOver(true);
      }
    } catch (erro) {
      console.error("Erro ao comunicar com a IA:", erro);
    }
  };

  return (
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
  );
}

export default ResponsiveGrid;
