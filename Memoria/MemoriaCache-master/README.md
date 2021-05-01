# MemoriaCache
Trabalho da faculdade Cotemig - AOC & AED

Este trabalho tem como objetivo executar uma troca de blocos
utlizando a tecnica associativa por conjunto de N posições:

1) O simulador deverá receber como entrada os seguintes dados:
a. O tamanho da memória principal em bytes.
b. O tamanho do bloco em bytes.
c. A quantidade de linhas da memória cache.
d. O valor de N.
e. O algoritmo de substituição que será utilizado pela memória cache (LRU, LFU, FIFO).
f. A sequência de números de blocos que serão acessados pelo processador durante a
execução do programa.

2) A memória cache deverá estar inicialmente vazia.

3) O simulador deverá disponibilizar um botão para a carga de bloco passo a passo, a partir da
memória principal, para a memória cache.

4) O simulador deverá conter, no mínimo, uma interface para:
a. Entrada dos dados listados no item 1.
b. Visualização dos blocos na memória principal.
c. Visualização dos blocos carregados na memória cache, passo a passo.
d. Visualização da troca de blocos entre as memórias, utilizando o algoritmo de substituição
previamente selecionado.
