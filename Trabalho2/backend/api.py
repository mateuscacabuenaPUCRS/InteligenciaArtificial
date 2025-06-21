
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from NeuralNetwork.neural_network import NeuralNetwork
from NeuralNetwork.weights_utils import cromossomo_para_pesos

from Jogo.minimax import jogada_minimax_modo
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/", StaticFiles(directory=".", html=True), name="static")

# CORS para o frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos
class TabuleiroEntrada(BaseModel):
    tabuleiro: list[int]  # 9 valores: 0=vazio, 1=X, -1=O

@app.post("/jogada-rede")
def jogada_rede(dados: TabuleiroEntrada):
    cromossomo = np.load("melhor_cromossomo.npy")
    W1, b1, W2, b2 = cromossomo_para_pesos(cromossomo)
    rede = NeuralNetwork()
    rede.W1, rede.b1, rede.W2, rede.b2 = W1, b1, W2, b2

    entrada = np.array(dados.tabuleiro).reshape((9, 1))
    saida = rede.forward(entrada).flatten()
    for i, val in enumerate(dados.tabuleiro):
        if val != 0:
            saida[i] = -np.inf
    jogada = int(np.argmax(saida))
    return { "jogada": jogada }

@app.post("/jogada-minimax")
def jogada_minimax(dados: TabuleiroEntrada):
    jogada = jogada_minimax_modo(dados.tabuleiro, "dificil")
    return { "jogada": jogada }
