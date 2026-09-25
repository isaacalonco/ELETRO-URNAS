'use strict';

var nomeLoja = 'ELETRO URNAS';
var taxaDesconto = 0.10;
var codigoCupomValido = 'ORELHA10';
var cupomAplicado = false;

const formatarMoeda = (valor) => {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

function aplicarCupom(codigo) {
  if (codigo.trim().toUpperCase() === codigoCupomValido) {
    cupomAplicado = true;
    return { sucesso: true, mensagem: 'Cupom ORELHA10 aplicado! 10% de desconto.' };
  }
  return { sucesso: false, mensagem: 'Cupom inválido. Verifique o código e tente novamente.' };
}

function removerCupom() {
  cupomAplicado = false;
}

class Produto {
  constructor(codigo, nome, categoria, preco, estoque, imagem, descricao, specs = [], destaque = false) {
    this.codigo = codigo;
    this.nome = nome;
    this.categoria = categoria;
    this.preco = Number(preco);
    this.estoque = Number(estoque);
    this.imagem = imagem;
    this.descricao = descricao;
    this.specs = specs;
    this.destaque = Boolean(destaque);
  }

  temEstoque() {
    return this.estoque > 0;
  }

  decrementarEstoque(quantidade = 1) {
    if (this.estoque >= quantidade) {
      this.estoque -= quantidade;
      return true;
    }
    return false;
  }

  incrementarEstoque(quantidade = 1) {
    this.estoque += quantidade;
  }
}

class Carrinho {
  constructor() {
    this.itens = [];
  }

  obterItem(codigo) {
    for (let i = 0; i < this.itens.length; i++) {
      if (this.itens[i].produto.codigo === codigo) {
        return this.itens[i];
      }
    }
    return null;
  }

  adicionar(produto, quantidade = 1) {
    if (!produto || !produto.temEstoque()) {
      return { sucesso: false, mensagem: 'Produto indisponível no momento.' };
    }

    let itemExistente = this.obterItem(produto.codigo);

    if (itemExistente) {
      let novaQuantidade = itemExistente.quantidade + quantidade;
      if (novaQuantidade > produto.estoque) {
        return {
          sucesso: false,
          mensagem: 'Limite de estoque atingido (' + produto.estoque + ' unidades disponíveis).'
        };
      }
      itemExistente.quantidade = novaQuantidade;
    } else {
      if (quantidade > produto.estoque) {
        return {
          sucesso: false,
          mensagem: 'Quantidade solicitada maior que o estoque disponível.'
        };
      }
      this.itens.push({
        produto: produto,
        quantidade: quantidade
      });
    }

    return { sucesso: true, mensagem: produto.nome + ' adicionado ao carrinho!' };
  }

  aumentarQuantidade(codigo) {
    let item = this.obterItem(codigo);
    if (!item) return false;

    if (item.quantidade < item.produto.estoque) {
      item.quantidade++;
      return true;
    }
    return false;
  }

  diminuirQuantidade(codigo) {
    let item = this.obterItem(codigo);
    if (!item) return false;

    if (item.quantidade > 1) {
      item.quantidade--;
      return true;
    } else {
      return this.remover(codigo);
    }
  }

  remover(codigo) {
    let posicao = -1;
    for (let i = 0; i < this.itens.length; i++) {
      if (this.itens[i].produto.codigo === codigo) {
        posicao = i;
      }
    }

    if (posicao !== -1) {
      this.itens.splice(posicao, 1);
      return true;
    }
    return false;
  }

  obterQuantidadeTotal() {
    let total = 0;
    for (let i = 0; i < this.itens.length; i++) {
      total += this.itens[i].quantidade;
    }
    return total;
  }

  calcularSubtotal() {
    let subtotal = 0;
    for (let i = 0; i < this.itens.length; i++) {
      let item = this.itens[i];
      subtotal += item.produto.preco * item.quantidade;
    }
    return subtotal;
  }

  calcularDesconto() {
    let subtotal = this.calcularSubtotal();
    let desconto = 0;

    if (cupomAplicado) {
      desconto = subtotal * taxaDesconto;
    } else {
      desconto = 0;
    }

    return desconto;
  }

  calcularTotal() {
    let subtotal = this.calcularSubtotal();
    let desconto = this.calcularDesconto();
    let valorFinal = subtotal - desconto;
    if (valorFinal > 0) {
      return valorFinal;
    }
    return 0;
  }

  limpar() {
    while (this.itens.length > 0) {
      this.itens.pop();
    }
  }
}

const catalogoProdutos = [
  new Produto(
    1,
    'iPhone 18 Pro Max',
    'smartphones',
    12499.0,
    5,
    'assets/iphone.png',
    'Forjado em titânio aeroespacial grau 5 com chip Apple A18 Pro, câmera tripla de 48MP com zoom 5x e tela Super Retina XDR.',
    ['Chip A18 Pro 3nm', 'Tela 6.9" Super Retina', '36h Bateria', 'Câmera Tripla 48MP Pro'],
    true
  ),
  new Produto(
    2,
    'MacBook Pro 16" M4 Max',
    'computers',
    28999.0,
    3,
    'assets/macbook.png',
    'Chip M4 Max de 16 núcleos, 48GB de memória unificada ultrarrápida e armazenamento SSD de 1TB em tela Liquid Retina XDR.',
    ['Chip M4 Max 16-core', '48GB RAM Unificada', 'SSD 1TB Ultrarrápido', 'Tela Mini-LED 120Hz'],
    true
  ),
  new Produto(
    3,
    'AirPods Pro 3',
    'audio',
    2799.0,
    8,
    'assets/airpods.png',
    'Cancelamento ativo de ruído 2x mais potente, Áudio Espacial personalizado com rastreamento da cabeça e estojo MagSafe USB-C.',
    ['Cancelamento Ativo (ANC)', 'Áudio Espacial Dolby', 'Até 30h com Estojo', 'Resistência IP54'],
    false
  ),
  new Produto(
    4,
    'iPhone 18 Standard',
    'smartphones',
    8999.0,
    6,
    'assets/iphone.png',
    'Performance com o chip A18 Bionic, Dynamic Island, sistema de câmera dupla de 48MP e acabamento em alumínio aeroespacial.',
    ['Chip A18 Bionic', 'Câmera Dupla 48MP', 'Dynamic Island', 'OLED Super Retina'],
    false
  ),
  new Produto(
    5,
    'AirPods Max 2',
    'audio',
    4999.0,
    4,
    'assets/airpods.png',
    'Som de estúdio de alta fidelidade com drivers desenvolvidos pela Apple, cancelamento de ruído pro e conexão USB-C Lossless.',
    ['Áudio Lossless USB-C', 'Almofadas com Memória', 'Cancelamento Pro', '20h de Bateria'],
    false
  ),
  new Produto(
    6,
    'iPad Pro M4 13"',
    'tablets',
    11499.0,
    0,
    'assets/ipad.jpg',
    'O dispositivo mais fino da história da Apple (5.1mm) com nova tela Ultra Retina Tandem OLED e chip Apple M4.',
    ['Chip M4 10-core', 'Tandem OLED Ultra Retina', 'Espessura 5.1mm', 'Apple Pencil Pro'],
    false
  ),
  new Produto(
    7,
    'Apple Watch Ultra 3',
    'wearables',
    7999.0,
    5,
    'assets/watch.jpg',
    'Caixa em titânio reforçado, GPS de precisão e dupla frequência, profundímetro integrado e bateria para expedições.',
    ['Caixa Titânio 49mm', 'Tela OLED 3.000 nits', 'Bateria até 72h', 'Resistente à Água 100m'],
    false
  ),
  new Produto(
    8,
    'Carregador MagSafe Duo',
    'audio',
    899.0,
    10,
    'assets/Carregador.png',
    'Carregamento sem fio rápido e simultâneo para iPhone, Apple Watch e estojo de AirPods em design dobrável portátil.',
    ['Carregamento Rápido 15W', 'Compatível Qi / MagSafe', 'Design Articulado', 'Conexão USB-C'],
    false
  )
];

const meuCarrinho = new Carrinho();

function buscarProdutoPorCodigo(codigo) {
  let codigoNumero = Number(codigo);
  for (let i = 0; i < catalogoProdutos.length; i++) {
    if (catalogoProdutos[i].codigo === codigoNumero) {
      return catalogoProdutos[i];
    }
  }
  return null;
}

function obterProdutosFiltrados(categoria, termo) {
  let resultado = [];
  let termoNormalizado = (termo || '').trim().toLowerCase();

  for (let i = 0; i < catalogoProdutos.length; i++) {
    let p = catalogoProdutos[i];
    let bateCategoria = (categoria === 'all' || p.categoria === categoria);
    let bateNome = (termoNormalizado === '' || p.nome.toLowerCase().includes(termoNormalizado));

    if (bateCategoria && bateNome) {
      resultado.push(p);
    }
  }

  return resultado;
}
