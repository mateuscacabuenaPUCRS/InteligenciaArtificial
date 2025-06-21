import numpy as np
from GeneticAlgorithm.individuo import Individuo

class Populacao:
    def __init__(self, tamanho: int, elitismo: bool = True, taxa_mutacao: float = 0.05, intensidade_mutacao: float = 0.1):
        self.tamanho = tamanho
        self.elitismo = elitismo
        self.taxa_mutacao = taxa_mutacao
        self.intensidade_mutacao = intensidade_mutacao
        self.individuos = [Individuo() for _ in range(tamanho)]
        self.melhor = None

    def avaliar(self, funcao_aptidao):
        """
        Avalia todos os indivíduos com a função de aptidão fornecida.
        """
        for ind in self.individuos:
            ind.avaliar(funcao_aptidao)
        self.individuos.sort(key=lambda i: i.aptidao, reverse=True)
        self.melhor = self.individuos[0]

    def selecionar_torneio(self, k=3):
        """
        Seleciona um indivíduo por torneio (entre k indivíduos aleatórios).
        """
        competidores = np.random.choice(self.individuos, k)
        return max(competidores, key=lambda i: i.aptidao)

    def nova_geracao(self):
        """
        Cria uma nova população aplicando elitismo, crossover e mutação.
        """
        nova = []

        if self.elitismo:
            nova.append(self.melhor)

        while len(nova) < self.tamanho:
            pai1 = self.selecionar_torneio()
            pai2 = self.selecionar_torneio()

            filho1, filho2 = pai1.cruzar_com(pai2)

            filho1.mutar(self.taxa_mutacao, self.intensidade_mutacao)
            filho2.mutar(self.taxa_mutacao, self.intensidade_mutacao)

            nova.append(filho1)
            if len(nova) < self.tamanho:
                nova.append(filho2)

        nova_populacao = Populacao(self.tamanho, self.elitismo, self.taxa_mutacao, self.intensidade_mutacao)
        nova_populacao.individuos = nova
        return nova_populacao
