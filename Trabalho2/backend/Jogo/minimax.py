import numpy as np
import random

# Constantes para os jogadores
X = 1      # Rede Neural
O = -1     # Minimax
VAZIO = 0  # Célula vazia

# 1. Função auxiliar: retorna índices de jogadas possíveis
def jogadas_validas(tabuleiro):
    return [i for i in range(9) if tabuleiro[i] == VAZIO]

# 2. Função auxiliar: verifica se alguém venceu ou empatou
def checar_vencedor(tabuleiro):
    combinacoes = [
        (0, 1, 2), (3, 4, 5), (6, 7, 8),     # linhas
        (0, 3, 6), (1, 4, 7), (2, 5, 8),     # colunas
        (0, 4, 8), (2, 4, 6)                 # diagonais
    ]
    for i, j, k in combinacoes:
        soma = tabuleiro[i] + tabuleiro[j] + tabuleiro[k]
        if soma == 3 * X:
            return X
        elif soma == 3 * O:
            return O
    if VAZIO not in tabuleiro:
        return 0  # Empate
    return None  # Jogo em andamento

# 3. Função principal: algoritmo Minimax (modo difícil = sempre usa essa)
def minimax(tabuleiro, jogador):
    vencedor = checar_vencedor(tabuleiro)
    if vencedor is not None:
        return vencedor * jogador, None  # valor, jogada

    jogadas = jogadas_validas(tabuleiro)
    melhor_valor = -np.inf
    melhor_jogada = None

    for i in jogadas:
        novo_tab = tabuleiro.copy()
        novo_tab[i] = jogador
        valor, _ = minimax(novo_tab, -jogador)
        valor = -valor  # inverte porque é o adversário

        if valor > melhor_valor:
            melhor_valor = valor
            melhor_jogada = i

    return melhor_valor, melhor_jogada



# 4. Função adaptada ao modo (fácil, médio, difícil)
def jogada_minimax_modo(tabuleiro, modo: str):
    """
    Decide a jogada do minimax com base no modo:
    - facil: usa minimax 25% das vezes
    - medio: usa minimax 50% das vezes
    - dificil: sempre usa minimax
    """
    r = random.random()

    if modo == "facil":
        usar_minimax = r < 0.25
    elif modo == "medio":
        usar_minimax = r < 0.50
    elif modo == "dificil":
        usar_minimax = True
    else:
        raise ValueError("Modo inválido")

    if usar_minimax:
        _, jogada = minimax(tabuleiro, O)
        return jogada
    else:
        return random.choice(jogadas_validas(tabuleiro))