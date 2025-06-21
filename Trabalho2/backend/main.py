import numpy as np
from GeneticAlgorithm.populacao import Populacao
from GeneticAlgorithm.fitness import funcao_aptidao_rede
from evaluate_accuracy import avaliar_acuracia
import json

# Configurações
TAMANHO_POPULACAO = 20
NUM_GERACOES = 15
PARTIDAS_POR_REDE = 5

# Criação da população inicial
pop = Populacao(tamanho=TAMANHO_POPULACAO)
evolucao = []

# Ciclo do algoritmo genético
for geracao in range(NUM_GERACOES):
    # Alterna o modo do Minimax de 5 em 5 gerações
    if geracao < 5:
        modo_minimax = "facil"
    elif geracao < 10:
        modo_minimax = "medio"
    else:
        modo_minimax = "dificil"

    print(f"\nGeração {geracao + 1} (Minimax: {modo_minimax})")

    # Avaliação da geração
    pop.avaliar(lambda c: funcao_aptidao_rede(
        c, n_partidas=PARTIDAS_POR_REDE, modo_minimax=modo_minimax))

    melhor = pop.melhor
    media = np.mean([ind.aptidao for ind in pop.individuos])

    print(f"Melhor aptidão: {melhor.aptidao:.2f}")
    print(f"Aptidão média: {media:.2f}")

    evolucao.append({
        "geracao": geracao + 1,
        "melhor": melhor.aptidao,
        "media": media
    })

    pop.nova_geracao()

# Reavaliar a última população com a dificuldade mais alta
pop.avaliar(lambda c: funcao_aptidao_rede(
    c, n_partidas=PARTIDAS_POR_REDE, modo_minimax="dificil"))

# Salvar o melhor cromossomo treinado
np.save("melhor_cromossomo.npy", pop.melhor.cromossomo)
print("\nMelhor rede treinada salva como 'melhor_cromossomo.npy'.")

# Avaliação final
print("\nAvaliando acurácia final da rede treinada contra o Minimax (medio)...")
vitorias, empates, derrotas, acuracia = avaliar_acuracia(
    pop.melhor.cromossomo, n_partidas=100, modo_minimax="medio")

print(f"\nResultados em 100 partidas:")
print(f"Vitórias: {vitorias} | Empates: {empates} | Derrotas: {derrotas}")
print(f"Acurácia final: {acuracia:.2%}")

# Salvar a evolução da aptidão
with open("evolucao.json", "w") as f:
    json.dump(evolucao, f, indent=2)
print("\nEvolução da aptidão salva em evolucao.json.")
