//Variaveis hit e miss
var hit = 0;
var miss = 0;

//Arrays  do projeto
var vetGlobal = []; // vetor Global
var vetFila = []; // vetor Fila
var vetLRU = []; // vetor LRU
var vetCountLRU = []; // vetor CountLRU
var vetLFU = []; // vetor LFU
var vetCountLFU = []; // vetor CountLFU

//Função ao carregar a página
window.onload = function () {
	document.getElementById('processo').style.display = 'none';
};

// Esconde o form de inserção de valores
function hideForm() {
	document.getElementById('mainForm').style.display = 'none';
	document.getElementById("insertValTitle").innerHTML = "<b>MEMÓRIA CACHE</b>";
}

//Revela o form de inserção para carregamento de bloco
function showCache() {
	document.getElementById('processo').style.display = 'block';
}

//Msg de Hit e Miss
function hitOrMiss() {
	document.getElementById("Hit").innerHTML = "Hit: " + hit;
	document.getElementById("Miss").innerHTML = "Miss: " + miss;
}

//Msg de MOD
function exibeMod(bloco, mod) {
	document.getElementById("ModTotal").innerHTML = bloco + " % " + buildConjunto() + " = " + mod;
}

// Criação dos valores de entrada e saída para display ao usuário 
function showRemove(valorIni, valorFim) {
	var s = document.getElementById("valorQueSai");
	var e = document.getElementById("valorQueEntra");

	s.style.display = "block";
	e.style.display = "block";

	s.innerHTML = '<b>Bloco que sai: </b>' + valorIni;
	e.innerHTML = '<b>Bloco que entra: </b>' + valorFim;
}

//Get valor da memoria principal indicada pelo usuario
function memoriaPrincipal() {
	return parseInt(document.getElementById("tamanhoMemoria").value);
}

//Get valor do tamanho Do Bloco indicado pelo usuario
function tamanhoDoBloco() {
	return parseInt(document.getElementById("tamanhoBloco").value);
}

//Get valor da quantidade De Linha indicada pelo usuario
function quantidadeDeLinha() {
	return parseInt(document.getElementById("quantidadeLinha").value);
}

//Get valor De N indicado pelo usuario
function valorDeN() {
	return parseInt(document.getElementById("valorDeN").value);
}

//Get valor do bloco indicado pelo usuario
function getBloco() {
	return parseInt(document.getElementById("tamBloco").value);
}

// Desabilita o campo de seleção de algoritmo
function disableSelect() {
	document.getElementById("selectAlg").setAttribute('disabled', 'disabled');
}

//Get qt Conjunto
function buildConjunto() {
	return Math.round(quantidadeDeLinha() / valorDeN()) == 0 ? 1 : Math.round(quantidadeDeLinha() / valorDeN());
}

// Adiciona um valor no fim do vetor
function push(array, valor) {
	array.push(valor); 
}

//Função de criação da tabela
function createTable() {

	//Variáveis recebem os valores estipulados pelo usuário:
	var mPrincipal = memoriaPrincipal();
	var tamBloco = tamanhoDoBloco();
	var qtLinhas = quantidadeDeLinha();
	var valorN = valorDeN();

	//Verifica se existe algum valor vazio nos imputs e dispara um alerta caso tenha.
	if (mPrincipal == '' || tamBloco == ''
		|| qtLinhas == '' || valorN == '') {

		alert("Preencha todos os campos fazeno o favor.");
	} else {
		//Variaveis que criam a  tabela
		var tabela = document.getElementById("tabela");
		var tbody = document.createElement("tbody");
		var numeroConjunto = 0; // Numero do conjunto apontado pelo usuário

		//Linhas
		for (var linha = 0; linha < qtLinhas; linha++) {
			var trRow = document.createElement("tr");
			var tdData = document.createElement("td");

			// Conjuntos
			if (linha % valorN == 0) {
				tdData.innerHTML = "Conjunto " + numeroConjunto++;
				tdData.colSpan = 2;
				tdData.classList.add("tableTitle");
				trRow.appendChild(tdData).colSpan = 2;
				tbody.appendChild(trRow);
			}
			var tr = document.createElement("tr");

			//Colunas
			for (var col = 0; col < 3; col++) {
				var td = document.createElement("td");

				//blocos
				if (col == 0) {
					td.id = "array" + linha;
					td.innerHTML = "Vazio";
					tr.appendChild(td);
				}
				else if (col == 1) {
					td.innerHTML = "Linha " + linha;
					tr.appendChild(td);
				}
			}
			tbody.appendChild(tr);
		}
		tabela.appendChild(tbody);

		hideForm(); //Esconde o form de inserção de valores
		showCache(); //Revela o form de inserção para carregamento de bloco

		hitOrMiss(); //Mensagem de hit e miss
	}
}

// Checa se o conjunto está vazio 
function isEmpty(op) {
	for (var i = 0; i < valorDeN(); i++) {
		if (vetGlobal[op] == null)
			return i;
		op++;
	}

	return -1;
}

// Checa se o valor existe
function existe(bloco, op) {
	for (var i = op; i < (op + valorDeN()); i++)
		if (vetGlobal[i] == bloco)
			return true;
	return false;
}

//Dispara o algoritmo de substituição selecionado
function algSubs() {
	var aux = Number.MAX_VALUE;
	var aux2 = Number.MAX_VALUE;

	var indexF = 0;
	var j = 0;

	var alg = document.getElementById("selectAlg").value;
	var mod = getBloco() % buildConjunto();
	var con = (mod * valorDeN()) + valorDeN();

	switch (alg) {
		case 'FIFO':
			for (var i = (mod * valorDeN()); i < con; i++) {
				var indice = vetFila.indexOf(vetGlobal[i]);
				if (indice < aux) { // Se indice é menor que o auxiliar troca valores e incrementa
					aux = indice;
					indexF = (mod * valorDeN()) + j++;
				}
				else if (indice > aux) {
					j++;
				}
			}
			var changeBlock = document.getElementById("array" + indexF); // Gera uma var para conseguir mudar o bloco
	
			showRemove(vetFila[aux], getBloco()); //Chama func que mostra a remoção
	
			//Splice no valor que está na fila, inserindo um novo valor no fim da fila:
			vetFila.splice(aux, 1);
			push(vetFila, getBloco());
			vetGlobal[indexF] = getBloco();
	
			changeBlock.innerHTML = "Bloco " + getBloco(); //Muda o bloco
			break;
		case 'LFU':
			for (var i = (mod * valorDeN()); i < con; i++) {

				var indiceArrayLFU = vetLFU.indexOf(vetGlobal[i]);
				//Se o valor no vetor da posição deste indice for menor que o valor do indice auxiliar os valores são trocados
				if (vetCountLFU[indiceArrayLFU] < aux2) {
					aux = indiceArrayLFU;
					aux2 = vetCountLFU[indiceArrayLFU];
					indexF = (mod * valorDeN()) + j++;
				}
				else if (vetCountLFU[indiceArrayLFU] >= aux2) {
					j++;
				}
			}
	
			showRemove(vetLFU[aux], getBloco()); //Chama func que mostra a remoção
			var changeBlock = document.getElementById("array" + indexF); // Gera uma var para conseguir mudar o bloco
	
			//Remove 1 elemento dos vetores em que o indice é aux
			vetLFU.splice(aux, 1);
			vetCountLFU.splice(aux, 1);
			//insere o bloco digitado em um vetor e o count no outro
			push(vetLFU, getBloco());
			push(vetCountLFU, 1);
			vetGlobal[indexF] = getBloco();
	
			changeBlock.innerHTML = "Bloco " + getBloco(); //Muda o bloco
			break;

		case 'LRU':
			for (var i = (mod * valorDeN()); i < con; i++) {
				var indiceArrayLRU = vetLRU.indexOf(vetGlobal[i]);
				//Se o valor no vetor da posição deste indice for menor que o valor do indice auxiliar os valores são trocados
				if (vetCountLRU[indiceArrayLRU] < aux2) {
					aux = indiceArrayLRU;
					aux2 = vetCountLRU[indiceArrayLRU];
					indexF = (mod * valorDeN()) + j++;
				}
				else if (vetCountLRU[indiceArrayLRU] >= aux2) {
					j++;
				}
			}
			showRemove(vetLRU[aux], getBloco()); //Chama func que mostra a remoção
	
			//Valor do final
			var endValue = vetLRU.indexOf(vetGlobal[con - 1]);
			push(vetCountLRU, vetCountLRU[endValue] + 1);
	
			var changeBlock = document.getElementById("array" + indexF); // Gera uma var para conseguir mudar o bloco
	
			//Splice no valor que está na fila, inserindo um novo valor no fim da fila com maior valor +1 :
			vetLRU.splice(aux, 1);
			vetCountLRU.splice(aux, 1);
			push(vetLRU, getBloco());
			vetGlobal[indexF] = getBloco();
	
			changeBlock.innerHTML = "Bloco " + getBloco(); //Muda o bloco
			break;

		default:
			break;
	}
}

// Função para carregamento de bloco
function btnLoadBlock() {
	var blocoIns = getBloco(); // Pega o bloco inserido

	if (blocoIns >= 0) { // Se o bloco inserido for maior ou igual a 0 executa
		disableSelect();// Desabilita o campo de seleção de algoritmo

		// Cria a variavel com o local em que o bloco irá entrar e uma que armazena o mod do bloco inserido
		var modBlock = blocoIns % buildConjunto();
		var localMemCache = (modBlock * valorDeN());

		exibeMod(blocoIns, modBlock); // Chama função que exibe o bloco que sai e entra

		if (!existe(blocoIns, localMemCache)) { // Se o bloco não existe dentro do conjunto 
			if (isEmpty(localMemCache) != -1) { // Se o conjunto não estiver cheio:

				// Torna as mensagens de aviso invisiveis
				document.getElementById("valorQueSai").style.display = "none";
				document.getElementById("valorQueEntra").style.display = "none";

				var locIndex = localMemCache + isEmpty(localMemCache);	// Atribui bloco inserido ao array de controle e declara variavel
				vetGlobal[locIndex] = blocoIns;

				// Insere o bloco inserido no final dos arrays
				push(vetFila, blocoIns);
				push(vetLFU, blocoIns);
				push(vetCountLFU, 1);
				push(vetLRU, blocoIns);

				if (vetCountLRU.length == 0) { // Se o tamanho do array for igual a 0
					push(vetCountLRU, 1);
				}
				else {
					var last = vetCountLRU.length - 1; // recebe o ultimo indice do vetor
					for (var i = 0; i < vetCountLRU.lenght; i++) { // for iterando por todo o vetor
						if (vetCountLRU[i] > vetCountLRU[last]) {// Se o valor atual for maior q o ultimo
							last = i;
						}
					}
					push(vetCountLRU, vetCountLRU[last] + 1); // Insere no final do vetor o maior valor do array
				}
				document.getElementById("array" + locIndex).innerHTML = "Bloco " + blocoIns; // Executa a troca de bloco
			}
			else {
				algSubs(); // Caso o conjunto esteja cheio roda o algoritmo de substituição
			}
			// Incrementa o miss:
			miss++;
			hitOrMiss();
		}
		// Se o valor já foi inserido antes
		else {
			// Incremente o hit:
			hit++;
			hitOrMiss();

			var indexLFU = vetLFU.indexOf(blocoIns); // Atualiza o valor no array de frequencia de acessos
			vetCountLFU[indexLFU] += 1;

			// Atualiza o valor no array de recentes:
			var indexLRU = vetLRU.indexOf(blocoIns);
			var finalVal = vetLRU.length - 1;
			var incVal = vetCountLRU[finalVal];

			// for colocando o maior valor no atual:
			for (var i = 0; i < vetGlobal.lenght; i++) {
				if (vetCountLRU[i] == incVal) {
					incVal += 1;
				}
			}
			vetCountLRU[indexLRU] = incVal + 1;
		}
	}
	else {
		alert("Tem que ter uma valor né querido!"); // Se o valor inserido for invalido
	}
}