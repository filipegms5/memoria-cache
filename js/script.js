//Arrays  do projeto
//TODO: MUDAR NOME DAS VARIÁVEIS, FUNÇÕES E COMENTÁRIOS

var arrGlobal = []; // arrGlobal
var arrFila = []; // arrFila
var arrLRU = []; // arrLRU
var arrCountLRU = []; // arrCountLRU
var arrLFU = []; // arrLFU
var arrCountLFU = []; // arrCountLFU


//Variaveis hit e miss
var hit = 0;
var miss = 0;

//Função (ou funções) ao carregar a página
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
	document.getElementById("ModTotal").innerHTML = bloco + " % " + montaConjuntos() + " = " + mod;
}

// Criação dos valores de entrada e saída para display ao usuário 
function mostraValorQueSai(valorIni, valorFim) {
	var s = document.getElementById("valorQueSai");
	var e = document.getElementById("valorQueEntra");

	s.style.display = "block";
	e.style.display = "block";

	s.innerHTML = '<b>Bloco que sai: </b>' + valorIni;
	e.innerHTML = '<b>Bloco que entra: </b>' + valorFim;
}

/* Função para parse e retornar valor da memoria principal */
function memoriaPrincipal() {
	return parseInt(document.getElementById("tamanhoMemoria").value);
}

/* Função para parse e retornar valor do tamanho do bloco */
function tamanhoDoBloco() {
	return parseInt(document.getElementById("tamanhoBloco").value);
}

/* Função para parse e retornar valor da quantidade de linha */
function quantidadeDeLinha() {
	return parseInt(document.getElementById("quantidadeLinha").value);
}

/* Função para dar parse e retornar valor de N */
function valorDeN() {
	return parseInt(document.getElementById("valorDeN").value);
}

function getBloco() {
	return parseInt(document.getElementById("carregarBloco").value);
}

function disableSelect() {
	document.getElementById("campoSubstituicao").setAttribute('disabled', 'disabled');
}

/* Calcula quantidade de conjunto */
function montaConjuntos() {
	return Math.round(quantidadeDeLinha() / valorDeN()) == 0 ? 1 : Math.round(quantidadeDeLinha() / valorDeN());
}

function push(array, valor) {
	array.push(valor); // Adiciona um valor no fim do vetor
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
		if (arrGlobal[op] == null)
			return i;
		op++;
	}

	return -1;
}

// Checa se o valor existe
function existe(bloco, op) {
	for (var i = op; i < (op + valorDeN()); i++)
		if (arrGlobal[i] == bloco)
			return true;
	return false;
}

// Função para carregamento de bloco
function btnLoadBlock() {
	var blocoIns = getBloco(); // Pega o bloco inserido

	if (blocoIns >= 0) { // Se o bloco inserido for maior ou igual a 0 executa
		disableSelect();// Desabilita o campo de seleção de algoritmo

		// Cria a variavel com o local em que o bloco irá entrar e uma que armazena o mod do bloco inserido
		var modBlock = blocoIns % montaConjuntos();
		var localMemCache = (modBlock * valorDeN());

		exibeMod(blocoIns, modBlock); // Chama função que exibe o bloco que sai e entra

		if (!existe(blocoIns, localMemCache)) { // Se o bloco não existe dentro do conjunto 
			if (isEmpty(localMemCache) != -1) { // Se o conjunto não estiver cheio:

				// Torna as mensagens de aviso invisiveis
				document.getElementById("valorQueSai").style.display = "none";
				document.getElementById("valorQueEntra").style.display = "none";

				var locIndex = localMemCache + isEmpty(localMemCache);	// Atribui bloco inserido ao array de controle e declara variavel
				arrGlobal[locIndex] = blocoIns;

				// Insere o bloco inserido no final dos arrays
				push(arrFila, blocoIns);
				push(arrLFU, blocoIns);
				push(arrCountLFU, 1);
				push(arrLRU, blocoIns);

				if (arrCountLRU.length == 0) { // Se o tamanho do array for igual a 0
					push(arrCountLRU, 1);
				}
				else {
					var last = arrCountLRU.length - 1; // recebe o ultimo indice do vetor
					for (var i = 0; i < arrCountLRU.lenght; i++) { // for iterando por todo o vetor
						if (arrCountLRU[i] > arrCountLRU[last]) {// Se o valor atual for maior q o ultimo
							last = i;
						}
					}
					push(arrCountLRU, arrCountLRU[last] + 1); // Insere no final do vetor o maior valor do array
				}
				document.getElementById("array" + locIndex).innerHTML = "Bloco " + blocoIns; // Executa a troca de bloco
			}
			else {
				algoritmoSubstituicao(); // Caso o conjunto esteja cheio roda o algoritmo de substituição
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

			var indexLFU = arrLFU.indexOf(blocoIns); // Atualiza o valor no array de frequencia de acessos
			arrCountLFU[indexLFU] += 1;

			// Atualiza o valor no array de recentes:
			var indexLRU = arrLRU.indexOf(blocoIns);
			var finalVal = arrLRU.length - 1;
			var incVal = arrCountLRU[finalVal];

			// for colocando o maior valor no atual:
			for (var i = 0; i < arrGlobal.lenght; i++) {
				if (arrCountLRU[i] == incVal) {
					incVal += 1;
				}
			}
			arrCountLRU[indexLRU] = incVal + 1;
		}
	}
	else {
		alert("Tem que ter uma valor né querido!"); // Se o valor inserido for invalido
	}
}

/* Executa o algoritmo de substituição */
function algoritmoSubstituicao() {
	/* Cria variaveis para troca de blocos */
	var algoritmo = document.getElementById("campoSubstituicao").value;
	var blocoDigitado = parseInt(document.getElementById("carregarBloco").value);
	var mod = blocoDigitado % montaConjuntos();
	var localMemoriaCache = (mod * valorDeN());
	var aux = Number.MAX_VALUE;
	var valorAux = Number.MAX_VALUE;
	var indiceFim = 0;
	var j = 0;
	var condicao = localMemoriaCache + valorDeN();

	/* Se o algoritmo for FIFO executa */
	if (algoritmo == 'FIFO') {
		/* Começa na linha do primeiro bloco do conjunto e vai
		   ate a ultima linha do conjunto 					*/
		for (var i = localMemoriaCache; i < condicao; i++) {
			/* Pega o indice de cada linha */
			var indice = arrFila.indexOf(arrGlobal[i]);
			/* Se ele for menor que o indice auxiliar troca valores */
			if (indice < aux) {
				aux = indice;
				indiceFim = localMemoriaCache + j++;
			}
			/* Se não incrementa o J */
			else if (indice > aux) {
				j++;
			}
		}
		/* Cria variavel para trocar bloco */
		var trocaBloco = document.getElementById("array" + indiceFim);
		/* Exibe na tela o valor que sai e o que entra */
		mostraValorQueSai(arrFila[aux], blocoDigitado);
		/* Remove o elementro da fila e insere o novo no final */
		arrFila.splice(aux, 1);
		push(arrFila, blocoDigitado);
		arrGlobal[indiceFim] = blocoDigitado;
		/* Troca bloco e adiciona animações */
		trocaBloco.innerHTML = "Bloco " + blocoDigitado;
	}
	/* Se o algoritmo for LFU executa */
	else if (algoritmo == 'LFU') {
		/* Começa na linha do primeiro bloco do conjunto e vai
		   ate a ultima linha do conjunto 					*/
		for (var i = localMemoriaCache; i < condicao; i++) {
			/* Pega o indice de cada linha */
			var indiceArrayLFU = arrLFU.indexOf(arrGlobal[i]);
			/* Se os acessos da posição deste indice for menor
			   que o valor do indice auxiliar troca  		 */
			if (arrCountLFU[indiceArrayLFU] < valorAux) {
				aux = indiceArrayLFU;
				valorAux = arrCountLFU[indiceArrayLFU];
				indiceFim = localMemoriaCache + j++;
			}
			/* Se não incrementa o J */
			else if (arrCountLFU[indiceArrayLFU] >= valorAux) {
				j++;
			}

		}
		/* Exibe na tela o valor que sai e o que entra */
		mostraValorQueSai(arrLFU[aux], blocoDigitado);
		/* Cria variavel para trocar bloco */
		var trocaBloco = document.getElementById("array" + indiceFim);
		/* Remove o elemento e insere o outro no final do array com acesso = 1 */
		arrLFU.splice(aux, 1);
		arrCountLFU.splice(aux, 1);
		push(arrLFU, blocoDigitado);
		push(arrCountLFU, 1);
		arrGlobal[indiceFim] = blocoDigitado;
		/* Troca bloco e adiciona animações */
		trocaBloco.innerHTML = "Bloco " + blocoDigitado;
	}
	/* Se o algoritmo selecionado for o LRU executa */
	else if (algoritmo == 'LRU') {
		/* Começa na linha do primeiro bloco do conjunto e vai
		   ate a ultima linha do conjunto 					*/
		for (var i = localMemoriaCache; i < condicao; i++) {
			/* Pega o indice de cada linha */
			var indiceArrayLRU = arrLRU.indexOf(arrGlobal[i]);
			/* Se os acessos da posição deste indice for menor
			   que o valor do indice auxiliar troca  		 */
			if (arrCountLRU[indiceArrayLRU] < valorAux) {
				aux = indiceArrayLRU;
				valorAux = arrCountLRU[indiceArrayLRU];
				indiceFim = localMemoriaCache + j++;
			}
			/* Se não incrementa o J */
			else if (arrCountLRU[indiceArrayLRU] >= valorAux) {
				j++;
			}
		}
		/* Exibe na tela o valor que sai e o que entra */
		mostraValorQueSai(arrLRU[aux], blocoDigitado);
		/* Pega o valor final do conjunto */
		var valorFinal = arrLRU.indexOf(arrGlobal[condicao - 1]);
		push(arrCountLRU, arrCountLRU[valorFinal] + 1);
		/* Cria variavel para trocar bloco */
		var trocaBloco = document.getElementById("array" + indiceFim);
		/* Remove o elemento e insere o outro no final do array com o maior valor +1 */
		arrLRU.splice(aux, 1);
		arrCountLRU.splice(aux, 1);
		push(arrLRU, blocoDigitado);
		/* Troca bloco e adiciona animações */
		arrGlobal[indiceFim] = blocoDigitado;
		trocaBloco.innerHTML = "Bloco " + blocoDigitado;
	}
}