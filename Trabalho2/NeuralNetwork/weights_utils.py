import numpy as np

def pesos_para_cromossomo(W1, b1, W2, b2):
    """
    Concatena todos os pesos e bias da rede em um vetor (cromossomo).
    """
    return np.concatenate([
        W1.flatten(),
        b1.flatten(),
        W2.flatten(),
        b2.flatten()
    ])

def cromossomo_para_pesos(cromossomo):
    """
    Reconstrói os pesos da rede neural a partir do vetor (cromossomo).
    """
    idx = 0

    # W1 (9x9 = 81)
    W1 = cromossomo[idx:idx+81].reshape((9, 9))
    idx += 81

    # b1 (9)
    b1 = cromossomo[idx:idx+9].reshape((9, 1))
    idx += 9

    # W2 (9x9 = 81)
    W2 = cromossomo[idx:idx+81].reshape((9, 9))
    idx += 81

    # b2 (9)
    b2 = cromossomo[idx:idx+9].reshape((9, 1))

    return W1, b1, W2, b2

