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
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface DadoEvolucao {
  geracao: number;
  melhor: number;
  media: number;
}

export default function GraficoEvolucao() {
  const [dados, setDados] = useState<DadoEvolucao[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/static/evolucao.json")
      .then((res) => res.json())
      .then((json) => setDados(json))
      .catch((err) => console.error("Erro ao buscar evolucao.json:", err));
  }, []);

  return (
    <Box width="100%" padding="24px">
      <Typography variant="h5" gutterBottom>
        Evolução da Aptidão por Geração
      </Typography>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dados}>
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