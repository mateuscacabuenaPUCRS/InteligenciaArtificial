import numpy as np
from NeuralNetwork.weights_utils import cromossomo_para_pesos
from NeuralNetwork.neural_network import NeuralNetwork
from Jogo.minimax import jogada_minimax_modo, checar_vencedor, VAZIO, X, O

def imprimir_tabuleiro(tab):
    simbolos = {X: 'X', O: 'O', VAZIO: ' '}
    print()
    for i in range(3):
        linha = [simbolos[tab[j]] for j in range(i*3, i*3+3)]
        print(f"{linha[0]} | {linha[1]} | {linha[2]}")
        if i < 2:
            print("--+---+--")
    print()

def jogar_vs_agente(cromossomo=None, contra='minimax', modo_minimax="medio"):
    tabuleiro = np.zeros(9, dtype=int)

    # Carrega rede se for jogar contra a IA treinada
    if contra == 'rede':
        W1, b1, W2, b2 = cromossomo_para_pesos(cromossomo)
        rede = NeuralNetwork()
        rede.W1 = W1
        rede.b1 = b1
        rede.W2 = W2
        rede.b2 = b2

    print("Você é o jogador O (número -1). A IA joga como X (número 1).")
    imprimir_tabuleiro(tabuleiro)

    turno = 0  # IA começa

    while True:
        vencedor = checar_vencedor(tabuleiro)
        if vencedor is not None:
            if vencedor == X:
                print("IA venceu!")
            elif vencedor == O:
                print("Você venceu!")
            else:
                print("Empate!")
            imprimir_tabuleiro(tabuleiro)
            break

        if turno == 0:
            # IA joga
            if contra == 'minimax':
                jogada = jogada_minimax_modo(tabuleiro.copy(), modo_minimax)
            elif contra == 'rede':
                entrada = tabuleiro.reshape((9, 1))
                saida = rede.forward(entrada).flatten()
                for i in range(9):
                    if tabuleiro[i] != VAZIO:
                        saida[i] = -np.inf
                jogada = int(np.argmax(saida))

            print(f"IA joga na posição {jogada}")
            tabuleiro[jogada] = X

        else:
            try:
                jogada = int(input("Sua jogada (0 a 8): "))
                if jogada not in range(9) or tabuleiro[jogada] != VAZIO:
                    print("Jogada inválida. Tente novamente.")
                    continue
                tabuleiro[jogada] = O
            except ValueError:
                print("Entrada inválida. Use números de 0 a 8.")
                continue

        imprimir_tabuleiro(tabuleiro)
        turno = 1 - turno  # alterna turno

# Para jogar contra o Minimax
# if __name__ == "__main__":
#     jogar_vs_agente(contra='minimax', modo_minimax='dificil')

# Para jogar contra a rede treinada
# if __name__ == "__main__":
#     cromossomo = np.load('melhor_cromossomo.npy')
#     jogar_vs_agente(cromossomo=cromossomo, contra='rede')