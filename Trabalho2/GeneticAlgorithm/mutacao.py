import numpy as np

def mutacao_real(cromossomo: np.ndarray, taxa_mutacao: float = 0.05, intensidade: float = 0.1):
    """
    Aplica mutação em cada gene do cromossomo com uma pequena perturbação.
    
    :param cromossomo: vetor de pesos
    :param taxa_mutacao: probabilidade de cada gene sofrer mutação
    :param intensidade: desvio padrão da perturbação gaussiana
    :return: novo cromossomo mutado
    """
    cromossomo_mutado = cromossomo.copy()
    
    for i in range(len(cromossomo)):
        if np.random.rand() < taxa_mutacao:
            perturbacao = np.random.normal(0, intensidade)
            cromossomo_mutado[i] += perturbacao

    return cromossomo_mutado
