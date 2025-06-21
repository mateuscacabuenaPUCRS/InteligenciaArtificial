
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

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
    '&:hover': {
      backgroundColor: "#f8f8f8e3",
    },
  }),
}));

export default function ResponsiveGrid() {
  const [squares, setSquares] = useState<SquareState[]>(Array(9).fill(null).map(() => ({ value: null })));
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [modo, setModo] = useState<"rede" | "minimax">("rede");
  const [resultado, setResultado] = useState<string | null>(null);
  const [placar, setPlacar] = useState({ jogador: 0, ia: 0, empate: 0 });

  const verificarVitoria = (squares: SquareState[]): "X" | "O" | null => {
    const linhas = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const linha of linhas) {
      const [a, b, c] = linha;
      if (squares[a].value && squares[a].value === squares[b].value && squares[a].value === squares[c].value) {
        return squares[a].value;
      }
    }
    return null;
  };

  const verificarEmpate = (squares: SquareState[]): boolean => {
    return squares.every((square) => square.value !== null);
  };

  const handleClick = async (index: number) => {
    if (squares[index].value || gameOver) return;

    const newSquares = squares.map((square, i) => ({
      value: i === index ? "X" : square.value,
    }));
    setSquares(newSquares);

    const vencedor = verificarVitoria(newSquares);
    if (vencedor || verificarEmpate(newSquares)) {
      finalizarJogo(vencedor);
      return;
    }

    const numerico = newSquares.map((sq) => {
      if (sq.value === "X") return 1;
      if (sq.value === "O") return -1;
      return 0;
    });

    const endpoint = modo === "rede" ? "jogada-rede" : "jogada-minimax";

    try {
      const resposta = await fetch(`http://localhost:8000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabuleiro: numerico }),
      });

      const data = await resposta.json();
      const jogadaIA = data.jogada;

      if (newSquares[jogadaIA].value !== null) {
        console.error("IA retornou jogada inválida:", jogadaIA);
        return;
      }

      const respostaSquares = newSquares.map((sq, i) => ({
        value: i === jogadaIA ? "O" : sq.value,
      }));
      setSquares(respostaSquares);

      const novoVencedor = verificarVitoria(respostaSquares);
      if (novoVencedor || verificarEmpate(respostaSquares)) {
        finalizarJogo(novoVencedor);
      }
    } catch (error) {
      console.error("Erro ao comunicar com a IA:", error);
    }
  };

  const finalizarJogo = (vencedor: "X" | "O" | null) => {
    setGameOver(true);
    if (vencedor === "X") {
      setResultado("Você venceu!");
      setPlacar((p) => ({ ...p, jogador: p.jogador + 1 }));
    } else if (vencedor === "O") {
      setResultado("A IA venceu!");
      setPlacar((p) => ({ ...p, ia: p.ia + 1 }));
    } else {
      setResultado("Empate!");
      setPlacar((p) => ({ ...p, empate: p.empate + 1 }));
    }
  };

  const handleRestart = () => {
    setSquares(Array(9).fill(null).map(() => ({ value: null })));
    setGameOver(false);
    setResultado(null);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="16px">
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="modo-select-label">Modo de Jogo</InputLabel>
        <Select
          labelId="modo-select-label"
          value={modo}
          label="Modo de Jogo"
          onChange={(e) => setModo(e.target.value as "rede" | "minimax")}
        >
          <MenuItem value="rede">Rede Neural</MenuItem>
          <MenuItem value="minimax">Minimax</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" onClick={handleRestart}>
        Reiniciar Jogo
      </Button>

      {resultado && (
        <Typography variant="h6" fontWeight="bold">
          {resultado}
        </Typography>
      )}

      <Typography variant="body1">Vitórias do Jogador: {placar.jogador}</Typography>
      <Typography variant="body1">Vitórias da IA: {placar.ia}</Typography>
      <Typography variant="body1">Empates: {placar.empate}</Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 150px)"
        gap="8px"
        padding="32px"
        width="fit-content"
        borderRadius="8px"
      >
        {squares.map((square, index) => (
          <Item key={index} onClick={() => handleClick(index)} player={square.value}>
            {square.value}
          </Item>
        ))}
      </Box>
    </Box>
  );
}
