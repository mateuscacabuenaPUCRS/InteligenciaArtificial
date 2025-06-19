import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useState } from "react";

interface SquareState {
	value: "X" | "O" | null;
}

interface GameMetrics {
	totalPredictions: number;
	correctPredictions: number;
	incorrectPredictions: number;
	accuracy: number;
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
	const [estadoPrevisto, setEstadoPrevisto] = useState<string | null>(null);
	const [isXNext, setIsXNext] = useState(true);
	const [iaErrouUltima, setIaErrouUltima] = useState<boolean | null>(null);
	const [squares, setSquares] = useState<SquareState[]>(
		Array(9)
			.fill(null)
			.map(() => ({ value: null }))
	);
	const [algoritmo, setAlgoritmo] = useState<string>("arvore");
	const [gameMetrics, setGameMetrics] = useState<GameMetrics>({
		totalPredictions: 0,
		correctPredictions: 0,
		incorrectPredictions: 0,
		accuracy: 0,
	});
	const [gameOver, setGameOver] = useState<boolean>(false);

	console.log("Estado do jogo previsto:", estadoPrevisto);
	const formatTabuleiro = (squares: SquareState[]) => {
		return squares.map((sq) => {
			if (sq.value === "X") return 1;
			if (sq.value === "O") return 0;
			return -1;
		});
	};

	const verificarVitoria = (squares: SquareState[]): "X" | "O" | null => {
		const linhas = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8], // horizontais
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8], // verticais
			[0, 4, 8],
			[2, 4, 6], // diagonais
		];

		for (const linha of linhas) {
			const [a, b, c] = linha;
			if (
				squares[a].value &&
				squares[a].value === squares[b].value &&
				squares[a].value === squares[c].value
			) {
				return squares[a].value;
			}
		}
		return null;
	};

	const verificarEmpate = (squares: SquareState[]): boolean => {
		return squares.every((square) => square.value !== null);
	};

	const verificarEstadoReal = (squares: SquareState[]): string => {
		const vencedor = verificarVitoria(squares);
		if (vencedor === "X") return "xwin";
		if (vencedor === "O") return "owin";
		if (verificarEmpate(squares)) return "tie";
		return "hasgame";
	};

	const verificarEstadoDoJogo = async (estado: number[], estadoReal: string) => {
		const resposta = await fetch("http://127.0.0.1:8000/prever/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ estado, algoritmo }),
		});
		const dados = await resposta.json();

		const novoTotal = gameMetrics.totalPredictions + 1;
		const isCorrect = dados.estado_previsto === estadoReal;

		const novasMetricas = {
			totalPredictions: novoTotal,
			correctPredictions: isCorrect
				? gameMetrics.correctPredictions + 1
				: gameMetrics.correctPredictions,
			incorrectPredictions: !isCorrect
				? gameMetrics.incorrectPredictions + 1
				: gameMetrics.incorrectPredictions,
			accuracy:
				((isCorrect
					? gameMetrics.correctPredictions + 1
					: gameMetrics.correctPredictions) /
					novoTotal) *
				100,
		};

		setGameMetrics(novasMetricas);
		return dados.estado_previsto;
	};

	const handleClick = (index: number) => {
		if (squares[index].value || gameOver) return;

		const newSquares = squares.map((square, i) => ({
			value: i === index ? (isXNext ? "X" : "O") : square.value,
		}));

		const estadoNumerico = formatTabuleiro(newSquares);
		const estadoReal = verificarEstadoReal(newSquares);

		verificarEstadoDoJogo(estadoNumerico, estadoReal).then((resultado) => {
			setEstadoPrevisto(resultado);

			if (estadoReal !== "hasgame") {
				setGameOver(true);
				setIaErrouUltima(resultado !== estadoReal); // true se errou, false se acertou
			}
		});

		setSquares(newSquares);
		setIsXNext(!isXNext);
	};

	const handleRestart = () => {
		setSquares(
			Array(9)
				.fill(null)
				.map(() => ({ value: null }))
		);
		setIsXNext(true);
		setGameOver(false);
		setEstadoPrevisto(null);
		setIaErrouUltima(null);
		setGameMetrics({
			totalPredictions: 0,
			correctPredictions: 0,
			incorrectPredictions: 0,
			accuracy: 0,
		});
	};

	return (
		<Box display="flex" flexDirection="column" alignItems="center" gap="16px">
			<Box display="flex" gap="16px" alignItems="center">
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel id="algoritmo-select-label">Algoritmo</InputLabel>
					<Select
						labelId="algoritmo-select-label"
						value={algoritmo}
						label="Algoritmo"
						onChange={(e) => setAlgoritmo(e.target.value)}
					>
						<MenuItem value="arvore">Árvore de Decisão</MenuItem>
						<MenuItem value="mlp">MLP</MenuItem>
						<MenuItem value="knn">KNN</MenuItem>
						<MenuItem value="svm">SVM</MenuItem>
					</Select>
				</FormControl>
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
			</Box>

			<Box display="flex" flexDirection="column" alignItems="center" gap="8px">
				{estadoPrevisto && (
					<Typography variant="h6" fontWeight="bold">
						Estado do jogo: {estadoPrevisto.toUpperCase()}
					</Typography>
				)}

				<Typography variant="body1">
					Total de Previsões: {gameMetrics.totalPredictions}
				</Typography>
				<Typography variant="body1">
					Previsões Corretas: {gameMetrics.correctPredictions}
				</Typography>
				<Typography variant="body1">
					Previsões Incorretas: {gameMetrics.incorrectPredictions}
				</Typography>
				<Typography variant="body1" fontWeight="bold">
					Acurácia: {gameMetrics.accuracy.toFixed(2)}%
				</Typography>
			</Box>

			{gameOver && iaErrouUltima !== null && (
				<Typography variant="h6" color={iaErrouUltima ? "error" : "success"}>
					{iaErrouUltima
						? "Jogo encerrado: A IA não detectou o fim do jogo corretamente!"
						: "Jogo encerrado: A IA previu corretamente o fim do jogo!"}
				</Typography>
			)}

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
					<Item key={index} onClick={() => handleClick(index)} player={square.value}>
						{square.value}
					</Item>
				))}
			</Box>
		</Box>
	);
}
