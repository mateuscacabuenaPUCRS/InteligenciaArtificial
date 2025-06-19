
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from NeuralNetwork.neural_network import NeuralNetwork
from NeuralNetwork.weights_utils import cromossomo_para_pesos
import os

app = FastAPI()

# Carrega os pesos treinados salvos em melhor_cromossomo.npy
CAMINHO_PESOS = "melhor_cromossomo.npy"
if not os.path.exists(CAMINHO_PESOS):
    raise FileNotFoundError("Arquivo melhor_cromossomo.npy não encontrado. Treine a rede antes de usar a API.")

cromossomo = np.load(CAMINHO_PESOS)
W1, b1, W2, b2 = cromossomo_para_pesos(cromossomo)
rede = NeuralNetwork()
rede.W1, rede.b1, rede.W2, rede.b2 = W1, b1, W2, b2

# Modelo da requisição
class TabuleiroEntrada(BaseModel):
    tabuleiro: list[int]  # Lista com 9 posições: 0 (vazio), 1 (X), -1 (O)

@app.post("/jogada-rede")
def jogada_rede(dados: TabuleiroEntrada):
    entrada = np.array(dados.tabuleiro).reshape((9, 1))
    saida = rede.forward(entrada).flatten()

    # Mascarar posições já ocupadas
    for i, val in enumerate(dados.tabuleiro):
        if val != 0:
            saida[i] = -np.inf

    jogada = int(np.argmax(saida))
    return { "jogada": jogada }
