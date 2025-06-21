# 🤖 Jogo da Velha com Inteligência Artificial

Este projeto desenvolve uma Inteligência Artificial para jogar **Jogo da Velha**, usando:

- Uma **rede neural MLP (9-9-9)**
- Um **algoritmo genético** para otimizar os pesos da rede
- O algoritmo **Minimax** como adversário durante o aprendizado

---

## 🎯 Objetivo

Ensinar uma rede neural a jogar Jogo da Velha através de partidas contra o Minimax, usando **aprendizado por reforço indireto** e sem backpropagation. A rede evolui via **crossover, mutação e seleção por torneio**.

---

## 🧠 Tecnologias usadas

- Python 3
- NumPy
- Programação orientada a objetos
- Algoritmo Genético (elitismo, torneio, mutação real)
- IA adversária com Minimax (3 níveis de dificuldade)

---

## Run

Para executar o projeto, siga os passos abaixo:

1. Execute o melhor cromossomo com:
   ```bash
   python main.py
   ```
2. Inicie a API com:
   ```bash
   uvicorn api:app --reload
   ```
3. No diretório do frontend, rode:
   ```bash
   npm run dev
   ```
