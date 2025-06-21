import numpy as np
from NeuralNetwork.weights_utils import cromossomo_para_pesos
from NeuralNetwork.neural_network import NeuralNetwork
from Jogo.minimax import jogada_minimax_modo, checar_vencedor, VAZIO, X, O

def funcao_aptidao_rede(cromossomo, n_partidas=5, modo_minimax="medio"):
    """
    Avalia um cromossomo fazendo a rede jogar contra o minimax.
    """
    W1, b1, W2, b2 = cromossomo_para_pesos(cromossomo)
    rede = NeuralNetwork()
    rede.W1 = W1
    rede.b1 = b1
    rede.W2 = W2
    rede.b2 = b2

    pontuacao_total = 0

    for _ in range(n_partidas):
        tabuleiro = np.zeros(9, dtype=int)  # vetor 1D com 9 posições
        turno_rede = True  # A rede sempre começa (como X)

        while True:
            vencedor = checar_vencedor(tabuleiro)
            if vencedor is not None:
                if vencedor == X:
                    pontuacao_total += 1
                elif vencedor == 0:
                    pontuacao_total += 0.5
                break

            if turno_rede:
                entrada = tabuleiro.reshape((9, 1))
                saida = rede.forward(entrada).flatten()
                jogadas_validas = [i for i in range(9) if tabuleiro[i] == VAZIO]

                if not jogadas_validas:
                    break  # empate forçado

                # Considera apenas as jogadas válidas (define -inf para inválidas)
                for i in range(9):
                    if i not in jogadas_validas:
                        saida[i] = -np.inf

                jogada = int(np.argmax(saida))

                if tabuleiro[jogada] != VAZIO:
                    pontuacao_total -= 1  # jogada inválida
                    break

                tabuleiro[jogada] = X
            else:
                jogada = jogada_minimax_modo(tabuleiro.copy(), modo_minimax)
                tabuleiro[jogada] = O

            turno_rede = not turno_rede

    return pontuacao_total / n_partidas
