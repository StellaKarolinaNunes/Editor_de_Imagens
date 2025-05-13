/* 
Nome: Stella Karolina Nunes Peixoto, João Gabriel Peres de Castro e Jhonefer Vinicius Lima da Silva
Descrição: Aplicação do Strategy - Editor de Imagens
Versão: 1.0


============================
Índice do js
============================
01. Interface do Padrão Strategy
02. Estratégias Concretas (Filtros específicos)
03. Contexto do Padrão Strategy
04. Transformações Visuais (fora do Strategy)
05. Seletores de Elementos DOM
06. Instancia os Contextos de Filtro e Transformação
07. Aplicar Filtros e Transformações na Imagem
08. Carregamento da Imagem
09. Atualizar Interface do Slider
10. Atualizar Valor do Filtro
11. Evento: Seleção de Filtros
12. Evento: Botões de Rotação/Espelhamento
13. Resetar Editor
14. Salvar Imagem Editada
15. Tema Escuro Persistente
16. Eventos de Inicialização
============================
*/



/*============================
01. Interface do Padrão Strategy
============================ */

// Define a interface base que será utilizada pelas estratégias de filtro.
class IFilterStrategy {
  constructor() {
    // Impede a instância direta da interface.
    if (this.constructor === IFilterStrategy) {
      throw new Error("Não é permitido instanciar uma interface diretamente.");
    }
  }

  // Métodos abstratos que devem ser implementados pelas classes concretas.
  setValue(val) { throw new Error("Método 'setValue()' deve ser implementado."); }
  getCSS() { throw new Error("Método 'getCSS()' deve ser implementado."); }
  getName() { throw new Error("Método 'getName()' deve ser implementado."); }
  getUnit() { throw new Error("Método 'getUnit()' deve ser implementado."); }
  getMax() { throw new Error("Método 'getMax()' deve ser implementado."); }
  getValue() { throw new Error("Método 'getValue()' deve ser implementado."); }
  reset() { throw new Error("Método 'reset()' deve ser implementado."); }
}

/*============================
02. Estratégias Concretas (Filtros específicos)
============================ */

// Implementação concreta para o filtro de brilho.
class BrightnessFilter extends IFilterStrategy {
  constructor() {
    super();
    this.name = 'brightness'; // Nome CSS do filtro.
    this.unit = '%'; // Unidade de medida do filtro.
    this.value = 100; // Valor inicial padrão.
    this.max = 200; // Valor máximo permitido.
  }

  setValue(val) { this.value = val; } // Define o valor do filtro.
  getCSS() { return `${this.name}(${this.value}${this.unit})`; } // Retorna o filtro CSS aplicado.
  getName() { return this.name; } // Retorna o nome.
  getUnit() { return this.unit; } // Retorna a unidade.
  getMax() { return this.max; } // Retorna o valor máximo.
  getValue() { return this.value; } // Retorna o valor atual.
  reset() { this.value = 100; } // Restaura para o valor padrão.
}

// Filtro de saturação de cor.
class SaturationFilter extends IFilterStrategy {
  constructor() {
    super();
    this.name = 'saturate';
    this.unit = '%';
    this.value = 100;
    this.max = 200;
  }

  setValue(val) { this.value = val; }
  getCSS() { return `${this.name}(${this.value}${this.unit})`; }
  getName() { return this.name; }
  getUnit() { return this.unit; }
  getMax() { return this.max; }
  getValue() { return this.value; }
  reset() { this.value = 100; }
}

// Filtro de inversão de cores.
class InversionFilter extends IFilterStrategy {
  constructor() {
    super();
    this.name = 'invert';
    this.unit = '%';
    this.value = 0;
    this.max = 100;
  }

  setValue(val) { this.value = val; }
  getCSS() { return `${this.name}(${this.value}${this.unit})`; }
  getName() { return this.name; }
  getUnit() { return this.unit; }
  getMax() { return this.max; }
  getValue() { return this.value; }
  reset() { this.value = 0; }
}

// Filtro de escala de cinza.
class GrayscaleFilter extends IFilterStrategy {
  constructor() {
    super();
    this.name = 'grayscale';
    this.unit = '%';
    this.value = 0;
    this.max = 100;
  }

  setValue(val) { this.value = val; }
  getCSS() { return `${this.name}(${this.value}${this.unit})`; }
  getName() { return this.name; }
  getUnit() { return this.unit; }
  getMax() { return this.max; }
  getValue() { return this.value; }
  reset() { this.value = 0; }
}

/*============================
03. Contexto do Padrão Strategy
============================ */

// Define o contexto que gerencia as estratégias de filtro.
class FilterContext {
  constructor() {
    // Mapeia os filtros por identificadores.
    this.strategies = {
      brilho: new BrightnessFilter(),
      saturacao: new SaturationFilter(),
      inversao: new InversionFilter(),
      'escala-cinza': new GrayscaleFilter()
    };
    // Define o filtro ativo inicial.
    this.active = this.strategies.brilho;
  }

  // Altera o filtro ativo com base no ID do botão clicado.
  setActiveFilter(id) {
    if (this.strategies[id]) {
      this.active = this.strategies[id];
    }
  }

  // Retorna a instância do filtro atualmente ativo.
  getActiveFilter() {
    return this.active;
  }

  // Atualiza o valor do filtro ativo.
  updateValue(value) {
    this.active.setValue(value);
  }

  // Gera a string CSS contendo todos os filtros combinados.
  getCSS() {
    return Object.values(this.strategies)
      .map(strategy => strategy.getCSS())
      .join(' ');
  }

  // Restaura todos os filtros aos valores padrão e ativa brilho.
  reset() {
    for (const strategy of Object.values(this.strategies)) {
      strategy.reset();
    }
    this.active = this.strategies.brilho;
  }
}

/*============================
04. Transformações Visuais (fora do Strategy)
============================ */

// Classe que gerencia as transformações visuais da imagem (rotação e espelhamento).
class Transformations {
  constructor() {
    this.reset(); // Inicializa com transformações padrão.
  }

  // Aplica uma transformação com base no ID do botão.
  applyTransform(id) {
    switch (id) {
      case 'esquerda': this.rotate -= 90; break;
      case 'direita': this.rotate += 90; break;
      case 'horizontal': this.flipH *= -1; break;
      case 'vertical': this.flipV *= -1; break;
    }
  }

  // Retorna a string CSS correspondente às transformações aplicadas.
  getTransformCSS() {
    return `rotate(${this.rotate}deg) scale(${this.flipH}, ${this.flipV})`;
  }

  // Restaura transformações para o estado padrão.
  reset() {
    this.rotate = 0;
    this.flipH = 1;
    this.flipV = 1;
  }
}

/*============================
05. Seletores de Elementos DOM
============================ */

// Seleciona os elementos necessários da interface gráfica (DOM).
const inputFile = document.querySelector(".input-file"),
  filterOptions = document.querySelectorAll(".opcoes-filtro button"),
  filterName = document.querySelector(".nome-filtro"),
  filterValue = document.querySelector(".valor-filtro"),
  filterSlider = document.querySelector(".slider-filtro input"),
  rotateOptions = document.querySelectorAll(".opcoes-rotacao button"),
  previewImg = document.querySelector(".preview-imagem img"),
  resetFilterBtn = document.querySelector(".botao-resetar"),
  saveImgBtn = document.querySelector(".botao-salvar"),
  botaoTema = document.getElementById("botao-tema"),
  body = document.body;

  /*============================
06. Instancia os Contextos de Filtro e Transformação
============================ */

// Cria as instâncias responsáveis por filtros e transformações.
const filters = new FilterContext();
const transforms = new Transformations();

/*============================
07. Aplicar Filtros e Transformações na Imagem
============================ */

// Aplica os filtros e transformações diretamente na imagem visualizada.
function applyImageStyles() {
  previewImg.style.filter = filters.getCSS();
  previewImg.style.transform = transforms.getTransformCSS();
}

/*============================
08. Carregamento da Imagem
============================ */

// Função responsável por carregar a imagem selecionada.
function loadImage() {
  const file = inputFile.files[0]; // Obtém o arquivo selecionado.
  if (!file) return; // Cancela se nenhum arquivo for fornecido.

  previewImg.src = URL.createObjectURL(file); // Gera URL temporária da imagem.

  previewImg.onload = () => {
    resetEditor(); // Reseta filtros e ativa o editor.
    document.querySelector(".container-editor").classList.remove("editor-desativado"); // Ativa interface do editor.
  };
}

/*============================
09. Atualizar Interface do Slider
============================ */

// Atualiza o slider com base no filtro atualmente selecionado.
function updateSliderUI() {
  const active = filters.getActiveFilter();
  filterSlider.max = active.getMax(); // Define o valor máximo.
  filterSlider.value = active.getValue(); // Atualiza valor atual.
  filterValue.innerText = `${active.getValue()}${active.getUnit()}`; // Mostra o valor na interface.
}

/*============================
10. Atualizar Valor do Filtro
============================ */

// Atualiza o filtro conforme o valor do slider.
function updateFilter() {
  const value = filterSlider.value;
  filters.updateValue(value); // Aplica novo valor.
  filterValue.innerText = `${value}${filters.getActiveFilter().getUnit()}`; // Atualiza a interface.
  applyImageStyles(); // Reaplica os estilos na imagem.
}

/*============================
11. Evento: Seleção de Filtros
============================ */

// Adiciona evento de clique aos botões de filtro.
filterOptions.forEach(option => {
  option.addEventListener("click", () => {
    document.querySelector(".opcoes-filtro .ativo")?.classList.remove("ativo"); // Remove seleção anterior.
    option.classList.add("ativo"); // Adiciona a classe 'ativo' ao botão clicado.

    filters.setActiveFilter(option.id); // Define o filtro ativo.
    filterName.innerText = option.innerText; // Atualiza o nome exibido.
    updateSliderUI(); // Atualiza o slider.
  });
});

/*============================
12. Evento: Botões de Rotação/Espelhamento
============================ */

// Adiciona eventos para botões de transformação.
rotateOptions.forEach(option => {
  option.addEventListener("click", () => {
    transforms.applyTransform(option.id); // Aplica a transformação escolhida.
    applyImageStyles(); // Atualiza imagem.
  });
});

/*============================
13. Resetar Editor
============================ */

// Função que reseta todos os filtros e transformações.
function resetEditor() {
  filters.reset(); // Restaura filtros.
  transforms.reset(); // Restaura transformações.
  document.querySelector(".opcoes-filtro button#brilho").click(); // Seleciona o filtro brilho.
  applyImageStyles(); // Aplica atualizações.
}

/*============================
14. Salvar Imagem Editada
============================ */

// Função para salvar a imagem editada.
function saveImage() {
  const canvas = document.createElement("canvas"); // Cria um elemento canvas.
  const ctx = canvas.getContext("2d"); // Obtém o contexto 2D.

  canvas.width = previewImg.naturalWidth; // Define largura original da imagem.
  canvas.height = previewImg.naturalHeight; // Define altura original.

  ctx.filter = filters.getCSS(); // Aplica filtros.
  ctx.translate(canvas.width / 2, canvas.height / 2); // Centraliza.

  if (transforms.rotate !== 0) {
    ctx.rotate((transforms.rotate * Math.PI) / 180); // Aplica rotação em radianos.
  }

  ctx.scale(transforms.flipH, transforms.flipV); // Aplica espelhamento.
  ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height); // Desenha imagem.

  const link = document.createElement("a"); // Cria link de download.
  link.download = "imagem-editada.jpg"; // Nome do arquivo.
  link.href = canvas.toDataURL("image/jpeg"); // Converte para base64.
  link.click(); // Inicia o download.
}

/*============================
15. Tema Escuro Persistente
============================ */

// Aplica o tema salvo anteriormente no localStorage.
function aplicarTemaSalvo() {
  const temaSalvo = localStorage.getItem("tema");

  if (temaSalvo === "escuro") {
    body.classList.add("tema-escuro"); // Aplica classe de tema escuro.
    botaoTema.innerHTML = '<i class="fas fa-sun"></i>'; // Ícone de sol.
  } else {
    botaoTema.innerHTML = '<i class="fas fa-moon"></i>'; // Ícone de lua.
  }
}

// Evento de clique no botão de tema.
botaoTema.addEventListener("click", () => {
  const isDark = body.classList.toggle("tema-escuro"); // Alterna entre claro e escuro.
  localStorage.setItem("tema", isDark ? "escuro" : "claro"); // Salva a preferência.

  botaoTema.innerHTML = isDark
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
});


/*============================
16. Eventos de Inicialização
============================ */

// Define os eventos padrão da interface.
filterSlider.addEventListener("input", updateFilter); // Slider de filtro.
resetFilterBtn.addEventListener("click", resetEditor); // Botão de reset.
saveImgBtn.addEventListener("click", saveImage); // Botão de salvar imagem.
inputFile.addEventListener("change", loadImage); // Carregamento de imagem.

// Estado inicial do editor ao carregar a aplicação.
document.querySelector(".opcoes-filtro button#brilho").click(); // Ativa o filtro brilho por padrão.
aplicarTemaSalvo(); // Aplica o tema salvo.
