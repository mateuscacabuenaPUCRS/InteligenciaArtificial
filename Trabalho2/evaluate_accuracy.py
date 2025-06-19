import numpy as np
from NeuralNetwork.weights_utils import cromossomo_para_pesos
from NeuralNetwork.neural_network import NeuralNetwork
from Jogo.minimax import jogada_minimax_modo, checar_vencedor, VAZIO, X, O

def avaliar_acuracia(cromossomo, n_partidas=100, modo_minimax="medio"):
    W1, b1, W2, b2 = cromossomo_para_pesos(cromossomo)
    rede = NeuralNetwork()
    rede.W1 = W1
    rede.b1 = b1
    rede.W2 = W2
    rede.b2 = b2

    vitorias = empates = derrotas = 0

    for _ in range(n_partidas):
        tabuleiro = np.zeros(9, dtype=int)
        turno = 0  # rede começa

        while True:
            vencedor = checar_vencedor(tabuleiro)
            if vencedor is not None:
                if vencedor == X:
                    vitorias += 1
                elif vencedor == 0:
                    empates += 1
                elif vencedor == O:
                    derrotas += 1
                break

            if turno == 0:
                entrada = tabuleiro.reshape((9, 1))
                saida = rede.forward(entrada).flatten()
                for i in range(9):
                    if tabuleiro[i] != VAZIO:
                        saida[i] = -np.inf
                jogada = int(np.argmax(saida))

                if tabuleiro[jogada] != VAZIO:
                    derrotas += 1  # jogada inválida = derrota imediata
                    break

                tabuleiro[jogada] = X
            else:
                jogada = jogada_minimax_modo(tabuleiro.copy(), modo_minimax)
                tabuleiro[jogada] = O

            turno = 1 - turno

    acuracia = (vitorias + 0.5 * empates) / n_partidas
    return vitorias, empates, derrotas, acuracia
