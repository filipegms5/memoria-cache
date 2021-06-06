//Arrays  do projeto
var arrayGlobal = [];
var arrayFila = [];
var arrayLRU = [];
var arrayCountLRU = [];
var arrayLFU = [];
var arrayCountLFU = [];

//Variaveis hit e miss
var hit = 0;
var miss = 0;

//Função (ou funções) ao carregar a página
window.onload = function() {
	document.getElementById('processo').style.display = 'none';
};

// Esconde o form de inserção de valores
function hideForm(){
	document.getElementById('mainForm').style.display = 'none';
	document.getElementById("insertValTitle").innerHTML="<b>MEMÓRIA CACHE</b>";
}

//Msg de Hit
function criaAttHit() {
	var criar = document.getElementById("Hit");
	criar.innerHTML = "Hit: " + hit;
}

//Msg de Miss
function criaAttMiss() {
	var criar = document.getElementById("Miss");
	criar.innerHTML = "Miss: " + miss;
}

/* Função para criar a mensagem de mod */
function criaAttMod(bloco, mod) {
	var criar = document.getElementById("ModTotal");
	criar.innerHTML = bloco + "%" + montaConjuntos() + "=" + mod;
}

/* Função para ativar os campos do carregamento de bloco */
function ativarCarregamento() {
	document.getElementById('processo').style.display = 'block';
	document.getElementById('processo').setAttribute('disabled', 'disabled');
	document.getElementById("carregarBloco").setAttribute('disabled', 'disabled');
	document.getElementById("botaoCarrega").setAttribute('disabled', 'disabled');
}

/* Após selecionar algoritimo, ativar e desativar campos de interação com usuario */
function selecionouAlgoritimo() {
	document.getElementById("carregarBloco").removeAttribute('disabled'); // Habilitar
	document.getElementById("botaoCarrega").removeAttribute('disabled'); // Habilitar
	document.getElementById('Atencao').style.display = 'none';
}

/* Função para criar a mensagem saida e entrada de bloco */
function mostraValorQueSai(valorIni, valorFim) {
	document.getElementById("valorQueSai").style.display = "block"; // Desabilitar
	document.getElementById("valorQueEntra").style.display = "block"; // Desabilitar
	var sai = document.getElementById("valorQueSai");
	var entra = document.getElementById("valorQueEntra");
	sai.innerHTML = "Bloco que sai: " + valorIni;
	sai.style.color = "red";
	entra.innerHTML = "Bloco que entra: " + valorFim;
	entra.style.color = "green";
}

/* Função para retornar valor da memoria principal */
function memoriaPrincipal() { return parseInt(document.getElementById("tamanhoMemoria").value); }

/* Função para retornar valor do tamanho do bloco */
function tamanhoDoBloco() { return parseInt(document.getElementById("tamanhoBloco").value); }

/* Função para retornar valor da quantidade de linha */
function quantidadeDeLinha() { return parseInt(document.getElementById("quantidadeLinha").value); }

/* Função para retornar valor de N */
function valorDeN() { return parseInt(document.getElementById("valorN").value); }

/* Calcula quantidade de conjunto */
function montaConjuntos() {
	return Math.round(quantidadeDeLinha() / valorDeN()) == 0 ? 1 : Math.round(quantidadeDeLinha() / valorDeN());
}

/* Cria tabela dinamicamente */
function criaTabela() {
	/* Busca valores nas funções */
	var memoriaPrin = document.getElementById("tamanhoMemoria").value;
	var tamanhoBloco = document.getElementById("tamanhoBloco").value;
	var quantidadeLinha = document.getElementById("quantidadeLinha").value;
	var valorN = document.getElementById("valorN").value;

	/* Se algum valor estiver vazio, retornar mensagem de erro */
	if (memoriaPrin == '' || tamanhoBloco == '' || quantidadeLinha == '' || valorN == '') {
		alert("Campos obrigatorios não preenchidos.");
	}
	else {
		/* Busca na função a quantidade de conjuntos */
		quantidadeDeConjuntos = montaConjuntos(quantidadeLinha, valorN);

		/* Cria elemento */
		var tabela = document.getElementById("tabela");
		var tbody = document.createElement("tbody");
		var tdata = document.createElement("td");

		/* Variavel que vai ser usada para exibição do conjunto */
		var m = 0;

		/* Cria as linhas */
		for (var j = 0; j < quantidadeLinha; j++) {
			/* Linha Nome conjunto */
			var trow = document.createElement("tr");
			/* Dados Nome conjunto */
			var tdata = document.createElement("td");
			/* Se o valor do momento % o valor de N for igual a 0
			   Deve ser exibido o Nome conjunto */
			if (j % valorN == 0) {
				tdata.innerHTML = "Conjunto " + m++;
				tdata.colSpan = 2;
				tdata.classList.add("tableTitle");
				trow.appendChild(tdata).colSpan = 2;
				tbody.appendChild(trow);
			}

			/* Linha para as colunas - Excessão do nome do conjunto */
			var tr = document.createElement("tr");

			/* Cria as oolunas */
			for (var i = 0; i < 3; i++) {
				/* Cria as colunas - Excessão do nome do conjunto */
				var td = document.createElement("td");
				/* Onde deve ser armazenado o bloco */
				if (i == 0) {
					td.id = "array" + j;
					td.style.width = "75%";
					td.innerHTML = "vazio";
					tr.appendChild(td);
				}
				/* Exibição da linha */
				else if (i == 1) {
					td.innerHTML = "linha " + j;
					tr.appendChild(td);
				}
			}
			/* Concatena tudo no body */
			tbody.appendChild(tr);
		}
		/* Coloca na tabela */
		tabela.classList.add("animated");
		tabela.classList.add("fadeInDownBig");
		tabela.appendChild(tbody);
		/* Chama a função que esconde o formulário */
		hideForm();
		/* Chama a função que ativa o input para carregar bloco */
		ativarCarregamento();
		/* Criar Hit */
		criaAttHit();
		/* Criar Miss */
		criaAttMiss();
		/* Chamar a próxima parte do algoritmo */
		selecionouAlgoritimo();
	}
}

/* Checha se o conjunto está vazio */
function checaVazio(operador) {
	for (var i = 0; i < valorDeN(); i++) {
		if (arrayGlobal[operador] == null) {
			return i;
		}
		operador++;
	}
	return -1;
}

/* Checa se o valor ja existe no conjunto */
function checaExiste(bloco, operador) {
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
	criaAttMiss();
	/* Cria as variaveis principais */
	var blocoDigitado = parseInt(document.getElementById("carregarBloco").value);
	var historico = document.getElementById("historico");
	var paragrafoHistorico = document.createElement("p");

	/* Se o bloco digitado for maior ou igual a 0 executa */
	if (blocoDigitado >= 0) {
		/* Desabilita o campo de algoritimo*/
		document.getElementById("campoSubstituicao").setAttribute('disabled', 'disabled'); // Desabilitar
		/* Cria variavel com o local de onde o bloco ira entrar */
		var mod = blocoDigitado % montaConjuntos();
		var localMemoriaCache = (mod * valorDeN());
		/* Chama função para exibit o bloco q sai e entra */
		criaAttMod(blocoDigitado, mod);
		/* Executa funções de prevenção como - Vazio e Existe */
		var verificaVazio = checaVazio(localMemoriaCache);
		var verificaExiste = checaExiste(blocoDigitado, localMemoriaCache);
		var linhaDeEntradaDoBloco = localMemoriaCache + verificaVazio;
		var condicao = localMemoriaCache + valorDeN();
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
				trocaBloco.classList.add("trocarBloco");
				trocaBloco.classList.add("animated");
				trocaBloco.classList.add("rubberBand");
				paragrafoHistorico.innerHTML = "Linha: " + linhaDeEntradaDoBloco + " Bloco: " + blocoDigitado;
				historico.appendChild(paragrafoHistorico);

			}
			/* Caso estiver cheia executa o algoritimo de substituição */
			else {
				algoritimoSubstituicao();
			}
			/* Incrementa o miss */
			miss++;
			criaAttMiss();
		}
		/* Se o valor ja existir */
		else {
			/* Incremente o hit */
			hit++;
			criaAttHit();
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

/* Executa o algoritimo de substituição */
function algoritimoSubstituicao() {
	/* Cria variaveis para troca de blocos */
	var algoritimo = document.getElementById("campoSubstituicao").value;
	var blocoDigitado = parseInt(document.getElementById("carregarBloco").value);
	var mod = blocoDigitado % montaConjuntos();
	var localMemoriaCache = (mod * valorDeN());
	var aux = 100000;
	var valorAux = 100000;
	var indiceFim = 0;
	var j = 0;
	var condicao = localMemoriaCache + valorDeN();
	/* Se o algoritimo for FIFO executa */
	if (algoritimo == 'FIFO') {
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
		trocaBloco.classList.add("trocarBloco");
		trocaBloco.classList.add("animated");
		trocaBloco.classList.add("rubberBand");
	}
	/* Se o algoritimo for LFU executa */
	else if (algoritimo == 'LFU') {
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
		trocaBloco.classList.add("trocarBloco");
		trocaBloco.classList.add("animated");
		trocaBloco.classList.add("rubberBand");
	}
	/* Se o algoritimo selecionado for o LRU executa */
	else if (algoritimo == 'LRU') {
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
		trocaBloco.classList.add("trocarBloco");
		trocaBloco.classList.add("animated");
		trocaBloco.classList.add("rubberBand");
	}
}

/* Inicio Algortimo de FILA */
/*
 * CLASSE FILA - IMPLEMENTA O TIPO ABSTRATO DE DADOS FILA ESTÁTICA CIRCULAR
 * OPERAÇÕES: *
 *	enfileirar(x) -> coloca o elemento x no fim da fila.
 *	desenfileirar() -> retorna o elemento situado no inicio da fila.
 */
function enfileirar(array, valor) {
	array.push(valor);
}
function desenfileirar(array) {
	array.shift();
}
/* Fim Algortimo de FILA */