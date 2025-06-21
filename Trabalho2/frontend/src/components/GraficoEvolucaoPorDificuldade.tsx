import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, Button, ButtonGroup } from "@mui/material";

interface DadoEvolucao {
  geracao: number;
  melhor: number;
  media: number;
}

export default function GraficoEvolucaoPorDificuldade() {
  const [dados, setDados] = useState<Record<string, DadoEvolucao[]>>({});
  const [modoSelecionado, setModoSelecionado] = useState("facil");

  const dificuldades = ["facil", "medio", "dificil"];

  useEffect(() => {
    dificuldades.forEach((dif) => {
      fetch(`http://localhost:8000/static/evolucao_${dif}.json`)
        .then((res) => res.json())
        .then((json) =>
          setDados((prev) => ({
            ...prev,
            [dif]: json,
          }))
        )
        .catch((err) => console.error("Erro ao buscar evolução:", err));
    });
  }, []);

  return (
    <Box padding="24px" width="100%">
      <Typography variant="h5" gutterBottom>
        Evolução da Aptidão por Dificuldade
      </Typography>

      <ButtonGroup sx={{ mb: 2 }}>
        {dificuldades.map((dif) => (
          <Button
            key={dif}
            variant={modoSelecionado === dif ? "contained" : "outlined"}
            onClick={() => setModoSelecionado(dif)}
          >
            {dif.toUpperCase()}
          </Button>
        ))}
      </ButtonGroup>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dados[modoSelecionado] || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="geracao" label={{ value: "Geração", position: "insideBottomRight", offset: -5 }} />
          <YAxis label={{ value: "Aptidão", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="melhor" stroke="#f44336" name="Melhor Aptidão" />
          <Line type="monotone" dataKey="media" stroke="#2196f3" name="Média da Geração" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
