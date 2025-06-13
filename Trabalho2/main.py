from NeuralNetwork.neural_network import NeuralNetwork
from NeuralNetwork.weights_utils import pesos_para_cromossomo, cromossomo_para_pesos
from GeneticAlgorithm.operadores import crossover_aritmetico
import numpy as np

# Criar uma rede com pesos aleatórios
rede = NeuralNetwork()
cromossomo = pesos_para_cromossomo(rede.W1, rede.b1, rede.W2, rede.b2)

# Simular cruzamento do cromossomo consigo mesmo
f1, f2 = crossover_aritmetico(cromossomo, cromossomo)

# Reconstruir pesos
W1, b1, W2, b2 = cromossomo_para_pesos(f1)

# Criar nova rede com os pesos do filho
rede_nova = NeuralNetwork()
rede_nova.W1 = W1
rede_nova.b1 = b1
rede_nova.W2 = W2
rede_nova.b2 = b2

# Testar propagação
entrada = np.zeros((9, 1))
saida = rede_nova.forward(entrada)
print("Saída da nova rede:", saida)
