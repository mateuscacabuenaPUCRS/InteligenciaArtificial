import numpy as np

# Função de ativação sigmoide
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

# Classe da rede neural
class NeuralNetwork:
    def __init__(self, input_size=9, hidden_size=9, output_size=9):
        # Pesos entre entrada e camada oculta
        self.W1 = np.random.uniform(-1, 1, (hidden_size, input_size))  # 9x9
        self.b1 = np.random.uniform(-1, 1, (hidden_size, 1))           # 9x1

        # Pesos entre camada oculta e saída
        self.W2 = np.random.uniform(-1, 1, (output_size, hidden_size))  # 9x9
        self.b2 = np.random.uniform(-1, 1, (output_size, 1))            # 9x1

    def forward(self, x):
        """
        Propagação direta da rede.
        Parâmetro:
          - x: vetor de entrada 9x1 (estado atual do tabuleiro)
        Retorna:
          - saída da rede 9x1 (valores de ativação para cada célula)
        """
        z1 = np.dot(self.W1, x) + self.b1
        a1 = sigmoid(z1)

        z2 = np.dot(self.W2, a1) + self.b2
        a2 = sigmoid(z2)

        return a2
