import numpy as np

def crossover_aritmetico(pai1: np.ndarray, pai2: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """
    Crossover aritmético entre dois vetores de genes (pesos da rede).
    Gera dois filhos com mistura dos genes dos pais.

    :param pai1: vetor de pesos do pai 1
    :param pai2: vetor de pesos do pai 2
    :return: dois vetores filhos
    """
    alpha = np.random.rand()  # valor entre 0 e 1

    filho1 = alpha * pai1 + (1 - alpha) * pai2
    filho2 = (1 - alpha) * pai1 + alpha * pai2

    return filho1, filho2
