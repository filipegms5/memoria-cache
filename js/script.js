//Arrays  do projeto
//TODO: MUDAR NOME DAS VARIÁVEIS, FUNÇÕES E COMENTÁRIOS

var arrayGlobal = []; // arrayGlobal
var arrayFila = []; // arrayFila
var arrayLRU = []; // arrayLRU
var arrayCountLRU = []; // arrayCountLRU
var arrayLFU = []; // arrayLFU
var arrayCountLFU = []; // arrayCountLFU


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

//Msg de Hit
function msgHit() {
	document.getElementById("Hit").innerHTML = "Hit: " + hit;
}

//Msg de Miss
function msgMiss() {
	document.getElementById("Miss").innerHTML = "Miss: " + miss;
}

//Msg de MOD
function msgMOD(bloco, mod) {
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

/* Calcula quantidade de conjunto */
function montaConjuntos() {
	return Math.round(quantidadeDeLinha() / valorDeN()) == 0 ? 1 : Math.round(quantidadeDeLinha() / valorDeN());
}

function enfileirar(array, valor) {
	array.push(valor); // Adiciona um valor no fim do vetor
}

function desenfileirar(array) { 
	array.shift(); // Remove o primeiro item do vetor
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


		for (var linha = 0; linha < qtLinhas; linha++) {//linhas
			var trRow = document.createElement("tr"); /* Linha Nome conjunto */
			var tdData = document.createElement("td"); /* Dados Nome conjunto */
			
			/* Se o valor do momento % o valor de N for igual a 0 Deve ser exibido o Nome conjunto */
			if (linha % valorN == 0) {
				tdData.innerHTML = "Conjunto " + numeroConjunto++;
				tdData.colSpan = 2;
				tdData.classList.add("tableTitle");
				trRow.appendChild(tdData).colSpan = 2;
				tbody.appendChild(trRow);
			}

			/* Linha para as colunas - Excessão do nome do conjunto */
			var tr = document.createElement("tr");

			
			for (var col = 0; col < 3; col++) { //colunas
				/* Cria as colunas - Excessão do nome do conjunto */
				var td = document.createElement("td");
				/* Onde deve ser armazenado o bloco */
				if (col == 0) {
					td.id = "array" + linha;
					td.style.width = "75%";
					td.innerHTML = "vazio";
					tr.appendChild(td);
				}
				/* Exibição da linha */
				else if (col == 1) {
					td.innerHTML = "linha " + linha;
					tr.appendChild(td);
				}
			}
			/* Concatena tudo no body */
			tbody.appendChild(tr);
		}
		/* Coloca na tabela */
		tabela.appendChild(tbody);

		hideForm(); //Esconde o form de inserção de valores
		showCache(); //Revela o form de inserção para carregamento de bloco

		msgHit(); //Mensagem de Hit
		msgMiss(); //Mensagem de Miss
	}
}

/* Checha se o conjunto está vazio */
function isEmpty(operador) {
	for (var i = 0; i < valorDeN(); i++) {
		if (arrayGlobal[operador] == null) {
			return i;
		}

		operador++;
	}

	return -1;
}

/* Checa se o valor ja existe no conjunto */
function existe(bloco, operador) {
	var condicao = operador + valorDeN();
	for (var i = operador; i < condicao; i++) {
		if (arrayGlobal[i] == bloco) {
			return true;
		}
	}

	return false;
}

/* Função para carregamento de bloco */
function buttonCarregaBloco() {
	msgMiss();
	/* Cria as variaveis principais */
	var blocoDigitado = parseInt(document.getElementById("carregarBloco").value);
	/* Se o bloco digitado for maior ou igual a 0 executa */
	if (blocoDigitado >= 0) {
		/* Desabilita o campo de algoritmo*/
		document.getElementById("campoSubstituicao").setAttribute('disabled', 'disabled'); // Desabilitar
		/* Cria variavel com o local de onde o bloco ira entrar */
		var mod = blocoDigitado % montaConjuntos();
		var localMemoriaCache = (mod * valorDeN());
		/* Chama função para exibit o bloco q sai e entra */
		msgMOD(blocoDigitado, mod);
		/* Executa funções de prevenção como - Vazio e Existe */
		var verificaVazio = isEmpty(localMemoriaCache);
		var verificaExiste = existe(blocoDigitado, localMemoriaCache);
		/* Se o bloco nao existir executa */
		if (!verificaExiste) {
			/* Se o conjunto nao estiver cheio executa */
			if (verificaVazio != -1) {
				/* Remove as mensagens de aviso */
				document.getElementById("valorQueSai").style.display = "none"; // Desabilitar
				document.getElementById("valorQueEntra").style.display = "none"; // Desabilitar
				/* Cria a variavel de troca de bloco */
				var trocaBloco = document.getElementById("array" + (localMemoriaCache + verificaVazio));
				/* Atribui bloco digitado a um array de controle */
				arrayGlobal[localMemoriaCache + verificaVazio] = blocoDigitado;
				/* Insere o bloco digitado no final de cada array */
				enfileirar(arrayFila, blocoDigitado);
				enfileirar(arrayLFU, blocoDigitado);
				enfileirar(arrayCountLFU, 1);
				enfileirar(arrayLRU, blocoDigitado);
				/* Cria variavem para posição de entrada */
				var ultimo;
				/* Se o tamanho do array for igual a 0 executa */
				if (arrayCountLRU.length == 0) {
					enfileirar(arrayCountLRU, 1);
				}
				/* Se o valor do array for > 0 executa */
				else {
					/* recebe o ultimo valor do vetor */
					ultimo = arrayCountLRU.length - 1;
					/* for para rodar todo o vetor */
					for (var l = 0; l < arrayCountLRU.lenght; l++) {
						/* Se o valor atual for maior q o ultimo executa */
						if (arrayCountLRU[l] > arrayCountLRU[ultimo]) {
							ultimo = l;
						}
					}
					/* Insere no final o maior valor do array */
					enfileirar(arrayCountLRU, arrayCountLRU[ultimo] + 1);
				}
				// Executa a troca de bloco e animações 
				trocaBloco.innerHTML = "Bloco " + blocoDigitado;
			}
			/* Caso estiver cheia executa o algoritmo de substituição */
			else {
				algoritmoSubstituicao();
			}
			/* Incrementa o miss */
			miss++;
			msgMiss();
		}
		/* Se o valor ja existir */
		else {
			/* Incremente o hit */
			hit++;
			msgHit();
			/* Atualiza o valor no array de frequencia de acessos */
			var indiceIncrementoLFU = arrayLFU.indexOf(blocoDigitado);
			arrayCountLFU[indiceIncrementoLFU] += 1;
			/* Atualiza o valor no array de recentes */
			var indiceIncrementoLRU = arrayLRU.indexOf(blocoDigitado);
			var valorFinal = arrayLRU.length - 1;
			var valorIncremento = arrayCountLRU[valorFinal];
			/* Executa do primeiro ao ultimo, colocando o maior valor no atual */
			for (var k = 0; k < arrayGlobal.lenght; k++) {
				if (arrayCountLRU[k] == valorIncremento) {
					valorIncremento += 1;
				}
			}
			arrayCountLRU[indiceIncrementoLRU] = valorIncremento + 1;
		}
	}
	/* Caso o valor digitado não for valido */
	else {
		alert("Favor preencher com um valor válido");
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
			var indice = arrayFila.indexOf(arrayGlobal[i]);
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
		mostraValorQueSai(arrayFila[aux], blocoDigitado);
		/* Remove o elementro da fila e insere o novo no final */
		arrayFila.splice(aux, 1);
		enfileirar(arrayFila, blocoDigitado);
		arrayGlobal[indiceFim] = blocoDigitado;
		/* Troca bloco e adiciona animações */
		trocaBloco.innerHTML = "Bloco " + blocoDigitado;
	}
	/* Se o algoritmo for LFU executa */
	else if (algoritmo == 'LFU') {
		/* Começa na linha do primeiro bloco do conjunto e vai
		   ate a ultima linha do conjunto 					*/
		for (var i = localMemoriaCache; i < condicao; i++) {
			/* Pega o indice de cada linha */
			var indiceArrayLFU = arrayLFU.indexOf(arrayGlobal[i]);
			/* Se os acessos da posição deste indice for menor
			   que o valor do indice auxiliar troca  		 */
			if (arrayCountLFU[indiceArrayLFU] < valorAux) {
				aux = indiceArrayLFU;
				valorAux = arrayCountLFU[indiceArrayLFU];
				indiceFim = localMemoriaCache + j++;
			}
			/* Se não incrementa o J */
			else if (arrayCountLFU[indiceArrayLFU] >= valorAux) {
				j++;
			}

		}
		/* Exibe na tela o valor que sai e o que entra */
		mostraValorQueSai(arrayLFU[aux], blocoDigitado);
		/* Cria variavel para trocar bloco */
		var trocaBloco = document.getElementById("array" + indiceFim);
		/* Remove o elemento e insere o outro no final do array com acesso = 1 */
		arrayLFU.splice(aux, 1);
		arrayCountLFU.splice(aux, 1);
		enfileirar(arrayLFU, blocoDigitado);
		enfileirar(arrayCountLFU, 1);
		arrayGlobal[indiceFim] = blocoDigitado;
		/* Troca bloco e adiciona animações */
		trocaBloco.innerHTML = "Bloco " + blocoDigitado;
	}
	/* Se o algoritmo selecionado for o LRU executa */
	else if (algoritmo == 'LRU') {
		/* Começa na linha do primeiro bloco do conjunto e vai
		   ate a ultima linha do conjunto 					*/
		for (var i = localMemoriaCache; i < condicao; i++) {
			/* Pega o indice de cada linha */
			var indiceArrayLRU = arrayLRU.indexOf(arrayGlobal[i]);
			/* Se os acessos da posição deste indice for menor
			   que o valor do indice auxiliar troca  		 */
			if (arrayCountLRU[indiceArrayLRU] < valorAux) {
				aux = indiceArrayLRU;
				valorAux = arrayCountLRU[indiceArrayLRU];
				indiceFim = localMemoriaCache + j++;
			}
			/* Se não incrementa o J */
			else if (arrayCountLRU[indiceArrayLRU] >= valorAux) {
				j++;
			}
		}
		/* Exibe na tela o valor que sai e o que entra */
		mostraValorQueSai(arrayLRU[aux], blocoDigitado);
		/* Pega o valor final do conjunto */
		var valorFinal = arrayLRU.indexOf(arrayGlobal[condicao - 1]);
		enfileirar(arrayCountLRU, arrayCountLRU[valorFinal] + 1);
		/* Cria variavel para trocar bloco */
		var trocaBloco = document.getElementById("array" + indiceFim);
		/* Remove o elemento e insere o outro no final do array com o maior valor +1 */
		arrayLRU.splice(aux, 1);
		arrayCountLRU.splice(aux, 1);
		enfileirar(arrayLRU, blocoDigitado);
		/* Troca bloco e adiciona animações */
		arrayGlobal[indiceFim] = blocoDigitado;
		trocaBloco.innerHTML = "Bloco " + blocoDigitado;
	}
}