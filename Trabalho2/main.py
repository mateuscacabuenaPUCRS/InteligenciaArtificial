import numpy as np
from GeneticAlgorithm.populacao import Populacao
from GeneticAlgorithm.fitness import funcao_aptidao_rede
from evaluate_accuracy import avaliar_acuracia

# Configurações
TAMANHO_POPULACAO = 20
NUM_GERACOES = 10
MODO_MINIMAX = "medio"  # usado durante o treino
PARTIDAS_POR_REDE = 5

# Criação da população inicial
pop = Populacao(tamanho=TAMANHO_POPULACAO)

# Ciclo do algoritmo genético
for geracao in range(NUM_GERACOES):
    print(f"\nGeração {geracao + 1}")

    # Avaliação com base no desempenho contra o Minimax
    pop.avaliar(lambda c: funcao_aptidao_rede(c, n_partidas=PARTIDAS_POR_REDE, modo_minimax=MODO_MINIMAX))
    print(f"Melhor aptidão: {pop.melhor.aptidao:.2f}")

    # Avança para próxima geração (sem avaliação ainda)
    pop = pop.nova_geracao()

# ✅ Reavaliar a última população antes de salvar
pop.avaliar(lambda c: funcao_aptidao_rede(c, n_partidas=PARTIDAS_POR_REDE, modo_minimax=MODO_MINIMAX))

# Salvar o melhor cromossomo após o treino
np.save("melhor_cromossomo.npy", pop.melhor.cromossomo)
print("\nMelhor rede treinada salva como 'melhor_cromossomo.npy'.")

# Avaliação final da rede treinada
print("\nAvaliando acurácia final da rede treinada contra o Minimax...")
vitorias, empates, derrotas, acuracia = avaliar_acuracia(pop.melhor.cromossomo, n_partidas=100, modo_minimax="medio")

print(f"\nResultados em 100 partidas:")
print(f"Vitórias: {vitorias} | Empates: {empates} | Derrotas: {derrotas}")
print(f"Acurácia final: {acuracia:.2%}")
