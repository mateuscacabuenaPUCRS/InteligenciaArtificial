import numpy as np
from NeuralNetwork.neural_network import NeuralNetwork
from NeuralNetwork.weights_utils import pesos_para_cromossomo, cromossomo_para_pesos
from GeneticAlgorithm.operadores import crossover_aritmetico
from GeneticAlgorithm.mutacao import mutacao_real
from typing import Optional

class Individuo:
    def __init__(self, cromossomo: Optional[np.ndarray] = None):
        if cromossomo is not None:
            self.cromossomo = cromossomo
        else:
            # Gera um novo cromossomo com pesos aleatórios de uma rede neural
            rede = NeuralNetwork()
            self.cromossomo = pesos_para_cromossomo(rede.W1, rede.b1, rede.W2, rede.b2)

        self.aptidao = None  # será calculada depois

    def avaliar(self, funcao_aptidao):
        """
        Define a aptidão do indivíduo com base na função fornecida.
        """
        self.aptidao = funcao_aptidao(self.cromossomo)

    def obter_rede(self):
        """
        Reconstrói a rede neural a partir do cromossomo do indivíduo.
        """
        W1, b1, W2, b2 = cromossomo_para_pesos(self.cromossomo)
        rede = NeuralNetwork()
        rede.W1 = W1
        rede.b1 = b1
        rede.W2 = W2
        rede.b2 = b2
        return rede

    def cruzar_com(self, outro):
        """
        Cruza este indivíduo com outro para gerar dois filhos.
        """
        f1, f2 = crossover_aritmetico(self.cromossomo, outro.cromossomo)
        return Individuo(f1), Individuo(f2)

    def mutar(self, taxa=0.05, intensidade=0.1):
        """
        Aplica mutação ao próprio cromossomo.
        """
        self.cromossomo = mutacao_real(self.cromossomo, taxa, intensidade)
