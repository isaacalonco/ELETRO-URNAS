'use strict';

var nomeLoja = 'ELETRO URNAS';
var valorMinimoDesconto = 300.0;
var taxaDesconto = 0.10;

const $ = (seletor, contexto = document) => contexto.querySelector(seletor);
const $$ = (seletor, contexto = document) => [...contexto.querySelectorAll(seletor)];

const formatarMoeda = (valor) => {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

function calcularParcelamento(valorFinal) {
  let parcelas = 1;
  let textoParcelamento = '';
  let maxParcelas = 12;

  while (parcelas <= maxParcelas) {
    let valorParcela = valorFinal / parcelas;
    textoParcelamento = parcelas + 'x de ' + formatarMoeda(valorParcela) + ' sem juros';
    parcelas++;
  }

  return textoParcelamento;
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
        break;
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

    if (subtotal >= valorMinimoDesconto) {
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
    return valorFinal > 0 ? valorFinal : 0;
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
    'assets/airpods.png',
    'Carregamento sem fio rápido e simultâneo para iPhone, Apple Watch e estojo de AirPods em design dobrável portátil.',
    ['Carregamento Rápido 15W', 'Compatível Qi / MagSafe', 'Design Articulado', 'Conexão USB-C'],
    false
  )
];

const meuCarrinho = new Carrinho();

let categoriaFiltroAtual = 'all';
let termoBuscaAtual = '';

function buscarProdutoPorCodigo(codigo) {
  let codigoNumero = Number(codigo);
  for (let i = 0; i < catalogoProdutos.length; i++) {
    if (catalogoProdutos[i].codigo === codigoNumero) {
      return catalogoProdutos[i];
    }
  }
  return null;
}

function filtrarProdutos() {
  let produtosFiltrados = [];
  let termoNormalizado = termoBuscaAtual.trim().toLowerCase();

  for (let i = 0; i < catalogoProdutos.length; i++) {
    let p = catalogoProdutos[i];
    let bateCategoria = (categoriaFiltroAtual === 'all' || p.categoria === categoriaFiltroAtual);
    let bateNome = (termoNormalizado === '' || p.nome.toLowerCase().includes(termoNormalizado));

    if (bateCategoria && bateNome) {
      produtosFiltrados.push(p);
    }
  }

  renderizarCatalogo(produtosFiltrados);
}

function renderizarCatalogo(lista) {
  const container = $('#product-grid');
  if (!container) return;

  if (lista.length === 0) {
    container.innerHTML = `
      <div class="catalog-empty-state">
        <div class="catalog-empty-icon">🔍</div>
        <h3 class="catalog-empty-title">Nenhum produto encontrado</h3>
        <p class="catalog-empty-desc">Não localizamos produtos correspondentes aos filtros ou à pesquisa informada.</p>
        <button class="btn-reset-filters" id="btn-reset-filters">Limpar Filtros e Busca</button>
      </div>
    `;

    const btnReset = $('#btn-reset-filters');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        categoriaFiltroAtual = 'all';
        termoBuscaAtual = '';

        const inputBusca = $('#catalog-search-input');
        if (inputBusca) inputBusca.value = '';

        const clearBtn = $('#catalog-search-clear');
        if (clearBtn) clearBtn.style.display = 'none';

        $$('.filter-pill').forEach(pill => {
          let ativa = pill.dataset.filter === 'all';
          pill.classList.toggle('is-active', ativa);
          pill.setAttribute('aria-selected', ativa ? 'true' : 'false');
        });

        filtrarProdutos();
      });
    }
    return;
  }

  let htmlCards = '';

  for (let i = 0; i < lista.length; i++) {
    let prod = lista[i];
    let temEstoque = prod.temEstoque();
    let textoEstoque = temEstoque ? '✓ Em Estoque (' + prod.estoque + ' un.)' : '✕ Indisponível';
    let classeEstoque = temEstoque ? 'is-available' : 'is-out';
    let classeCardExtra = prod.destaque ? 'cat-card--featured' : '';
    if (!temEstoque) classeCardExtra += ' is-unavailable';

    let badgeTopo = prod.destaque ? 'DESTAQUE' : (temEstoque ? prod.categoria.toUpperCase() : 'ESGOTADO');
    let splitTexto = '12x de ' + formatarMoeda(prod.preco / 12);

    let specsHtml = '';
    for (let s = 0; s < prod.specs.length; s++) {
      specsHtml += '<li>' + prod.specs[s] + '</li>';
    }

    let botaoTexto = temEstoque ? 'Adicionar +' : 'Indisponível';
    let botaoClasse = temEstoque ? 'btn-card-add' : 'btn-card-add is-disabled';
    let botaoDisabled = temEstoque ? '' : 'disabled';

    htmlCards += `
      <article class="cat-card ${classeCardExtra}" data-category="${prod.categoria}" id="card-prod-${prod.codigo}">
        <div class="cat-card__badge">${badgeTopo}</div>
        <div class="cat-card__img-container">
          <div class="cat-card__glow" aria-hidden="true"></div>
          <img src="${prod.imagem}" alt="${prod.nome}" class="cat-card__img" loading="lazy" />
        </div>
        <div class="cat-card__info">
          <div class="cat-card__meta">
            <span class="cat-card__tag">${prod.categoria.toUpperCase()}</span>
            <span class="cat-card__stock ${classeEstoque}">${textoEstoque}</span>
          </div>
          <h3 class="cat-card__title">${prod.nome}</h3>
          <p class="cat-card__desc">${prod.descricao}</p>
          <ul class="cat-card__specs">
            ${specsHtml}
          </ul>
          <div class="cat-card__footer">
            <div class="cat-card__price-box">
              <span class="cat-card__price">${formatarMoeda(prod.preco)}</span>
              <span class="cat-card__split">${splitTexto}</span>
            </div>
            <div class="cat-card__btns">
              <button class="${botaoClasse}" data-codigo="${prod.codigo}" aria-label="Adicionar ${prod.nome}" ${botaoDisabled}>
                ${botaoTexto}
              </button>
              <button class="btn-card-details" data-codigo="${prod.codigo}" aria-label="Detalhes ${prod.nome}">
                Info ↗
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  container.innerHTML = htmlCards;

  $$('.btn-card-add', container).forEach(botao => {
    botao.addEventListener('click', (e) => {
      e.stopPropagation();
      let codigo = Number(botao.dataset.codigo);
      adicionarAoCarrinho(codigo);
    });
  });

  $$('.btn-card-details', container).forEach(botao => {
    botao.addEventListener('click', (e) => {
      e.stopPropagation();
      let codigo = Number(botao.dataset.codigo);
      abrirModalProduto(codigo);
    });
  });
}

function adicionarAoCarrinho(codigo) {
  let produto = buscarProdutoPorCodigo(codigo);
  if (!produto) return;

  let resultado = meuCarrinho.adicionar(produto, 1);

  if (resultado.sucesso) {
    atualizarCarrinhoUI();
    exibirToast(resultado.mensagem, 'sucesso');
  } else {
    exibirToast(resultado.mensagem, 'erro');
  }
}

function atualizarCarrinhoUI() {
  const badge = $('#cart-badge');
  const countHeader = $('#cart-drawer-count');
  const containerItens = $('#cart-drawer-body');
  const qtyTotalElem = $('#cart-summary-qty');
  const subtotalElem = $('#cart-summary-subtotal');
  const discountElem = $('#cart-summary-discount');
  const discountRow = $('#cart-summary-discount-row');
  const totalElem = $('#cart-summary-total');
  const bannerDesconto = $('#cart-discount-banner');
  const infoParcelamento = $('#cart-installments-info');

  let totalItens = meuCarrinho.obterQuantidadeTotal();
  let subtotal = meuCarrinho.calcularSubtotal();
  let desconto = meuCarrinho.calcularDesconto();
  let valorFinal = meuCarrinho.calcularTotal();

  if (badge) {
    badge.textContent = totalItens;
    badge.style.transform = 'scale(1.35)';
    setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
  }

  if (countHeader) {
    countHeader.textContent = '(' + totalItens + ')';
  }

  if (qtyTotalElem) {
    qtyTotalElem.textContent = totalItens + (totalItens === 1 ? ' item' : ' itens');
  }

  if (subtotalElem) {
    subtotalElem.textContent = formatarMoeda(subtotal);
  }

  if (discountElem) {
    discountElem.textContent = '- ' + formatarMoeda(desconto);
  }

  if (totalElem) {
    totalElem.textContent = formatarMoeda(valorFinal);
  }

  if (infoParcelamento) {
    if (valorFinal > 0) {
      infoParcelamento.textContent = 'ou ' + calcularParcelamento(valorFinal);
    } else {
      infoParcelamento.textContent = '';
    }
  }

  if (bannerDesconto) {
    if (subtotal >= valorMinimoDesconto) {
      bannerDesconto.className = 'cart-discount-banner is-active';
      bannerDesconto.innerHTML = `<span>✓</span><span><strong>Desconto especial de 10% aplicado</strong> em compras acima de ${formatarMoeda(valorMinimoDesconto)}!</span>`;
      if (discountRow) discountRow.style.display = 'flex';
    } else if (subtotal > 0) {
      let falta = valorMinimoDesconto - subtotal;
      bannerDesconto.className = 'cart-discount-banner is-notice';
      bannerDesconto.innerHTML = `<span>💡</span><span>Adicione mais <strong>${formatarMoeda(falta)}</strong> para liberar 10% de desconto!</span>`;
      if (discountRow) discountRow.style.display = 'none';
    } else {
      bannerDesconto.className = 'cart-discount-banner is-notice';
      bannerDesconto.innerHTML = `<span>🏷️</span><span>Ganhe <strong>10% de desconto</strong> em compras a partir de ${formatarMoeda(valorMinimoDesconto)}.</span>`;
      if (discountRow) discountRow.style.display = 'none';
    }
  }

  if (!containerItens) return;

  if (meuCarrinho.itens.length === 0) {
    containerItens.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </div>
        <h3 class="cart-empty-title">Seu carrinho está vazio</h3>
        <p class="cart-empty-desc">Nenhum produto adicionado até o momento. Navegue pelo catálogo e selecione seus dispositivos.</p>
        <button class="btn-cart-shop" id="btn-cart-explore">Explorar Catálogo</button>
      </div>
    `;

    const btnExplore = $('#btn-cart-explore');
    if (btnExplore) {
      btnExplore.addEventListener('click', () => {
        fecharCarrinho();
        const secCat = $('#catalogo');
        if (secCat) secCat.scrollIntoView({ behavior: 'smooth' });
      });
    }
    return;
  }

  let itensHtml = '';

  for (let i = 0; i < meuCarrinho.itens.length; i++) {
    let item = meuCarrinho.itens[i];
    let prod = item.produto;
    let itemSubtotal = prod.preco * item.quantidade;
    let podeAumentar = item.quantidade < prod.estoque;

    itensHtml += `
      <div class="cart-item" data-codigo="${prod.codigo}">
        <div class="cart-item__thumb">
          <img src="${prod.imagem}" alt="${prod.nome}" />
        </div>
        <div class="cart-item__info">
          <h4 class="cart-item__title">${prod.nome}</h4>
          <span class="cart-item__unit-price">Unitário: ${formatarMoeda(prod.preco)}</span>
          <span class="cart-item__subtotal">Subtotal: ${formatarMoeda(itemSubtotal)}</span>
        </div>
        <div class="cart-item__controls">
          <div class="qty-counter">
            <button class="btn-qty btn-qty-minus" data-codigo="${prod.codigo}" aria-label="Diminuir quantidade">−</button>
            <span class="qty-val">${item.quantidade}</span>
            <button class="btn-qty btn-qty-plus" data-codigo="${prod.codigo}" ${podeAumentar ? '' : 'disabled'} aria-label="Aumentar quantidade">+</button>
          </div>
          <button class="btn-remove-item" data-codigo="${prod.codigo}" aria-label="Remover produto">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  containerItens.innerHTML = itensHtml;

  $$('.btn-qty-plus', containerItens).forEach(btn => {
    btn.addEventListener('click', () => {
      let cod = Number(btn.dataset.codigo);
      let produto = buscarProdutoPorCodigo(cod);
      let item = meuCarrinho.obterItem(cod);

      if (item && produto && item.quantidade >= produto.estoque) {
        exibirToast('Não é possível adicionar além do estoque (' + produto.estoque + ' unidades).', 'erro');
        return;
      }

      meuCarrinho.aumentarQuantidade(cod);
      atualizarCarrinhoUI();
    });
  });

  $$('.btn-qty-minus', containerItens).forEach(btn => {
    btn.addEventListener('click', () => {
      let cod = Number(btn.dataset.codigo);
      meuCarrinho.diminuirQuantidade(cod);
      atualizarCarrinhoUI();
    });
  });

  $$('.btn-remove-item', containerItens).forEach(btn => {
    btn.addEventListener('click', () => {
      let cod = Number(btn.dataset.codigo);
      meuCarrinho.remover(cod);
      atualizarCarrinhoUI();
      exibirToast('Produto removido do carrinho.', 'sucesso');
    });
  });
}

function abrirCarrinho() {
  const drawer = $('#cart-drawer');
  const backdrop = $('#cart-drawer-backdrop');
  if (!drawer || !backdrop) return;

  atualizarCarrinhoUI();
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  backdrop.classList.add('is-open');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function fecharCarrinho() {
  const drawer = $('#cart-drawer');
  const backdrop = $('#cart-drawer-backdrop');
  if (!drawer || !backdrop) return;

  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  backdrop.classList.remove('is-open');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function abrirModalCheckout() {
  if (meuCarrinho.itens.length === 0) {
    exibirToast('Seu carrinho está vazio! Adicione itens para finalizar a compra.', 'erro');
    return;
  }

  const modal = $('#checkout-modal');
  const listElem = $('#checkout-items-list');
  const totalsElem = $('#checkout-totals-box');
  if (!modal || !listElem || !totalsElem) return;

  fecharCarrinho();

  let htmlItens = '';
  for (let i = 0; i < meuCarrinho.itens.length; i++) {
    let item = meuCarrinho.itens[i];
    let sub = item.produto.preco * item.quantidade;
    htmlItens += `
      <div class="checkout-item-row">
        <div class="checkout-item-row__left">
          <span class="checkout-item-row__qty">${item.quantidade}x</span>
          <span class="checkout-item-row__name">${item.produto.nome}</span>
        </div>
        <span class="checkout-item-row__price">${formatarMoeda(sub)}</span>
      </div>
    `;
  }
  listElem.innerHTML = htmlItens;

  let subtotal = meuCarrinho.calcularSubtotal();
  let desconto = meuCarrinho.calcularDesconto();
  let totalFinal = meuCarrinho.calcularTotal();
  let totalItens = meuCarrinho.obterQuantidadeTotal();

  totalsElem.innerHTML = `
    <div class="cart-summary-row">
      <span>Total de Itens:</span>
      <strong>${totalItens} un.</strong>
    </div>
    <div class="cart-summary-row">
      <span>Subtotal:</span>
      <span>${formatarMoeda(subtotal)}</span>
    </div>
    <div class="cart-summary-row cart-summary-row--discount" style="color: #2ed573;">
      <span>Desconto Aplicado:</span>
      <span>- ${formatarMoeda(desconto)}</span>
    </div>
    <div class="cart-summary-row cart-summary-row--total">
      <span>Valor Final:</span>
      <span style="color: var(--color-accent);">${formatarMoeda(totalFinal)}</span>
    </div>
  `;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function fecharModalCheckout() {
  const modal = $('#checkout-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function confirmarPedido() {
  if (meuCarrinho.itens.length === 0) {
    fecharModalCheckout();
    exibirToast('Não é possível concluir uma compra sem produtos no carrinho.', 'erro');
    return;
  }

  let numeroPedido = Math.floor(100000 + Math.random() * 900000);
  let totalPago = meuCarrinho.calcularTotal();
  let totalItensComprados = meuCarrinho.obterQuantidadeTotal();

  let index = 0;
  while (index < meuCarrinho.itens.length) {
    let item = meuCarrinho.itens[index];
    item.produto.decrementarEstoque(item.quantidade);
    index++;
  }

  meuCarrinho.limpar();
  atualizarCarrinhoUI();
  filtrarProdutos();

  fecharModalCheckout();

  const modalSucesso = $('#success-modal');
  const boxDetalhes = $('#success-order-box');

  if (modalSucesso && boxDetalhes) {
    boxDetalhes.innerHTML = `
      <div class="success-order-line">
        <span>Número do Pedido:</span>
        <strong>#ELETRO-${numeroPedido}</strong>
      </div>
      <div class="success-order-line">
        <span>Itens adquiridos:</span>
        <strong>${totalItensComprados} itens</strong>
      </div>
      <div class="success-order-line">
        <span>Valor Total:</span>
        <strong style="color: #2ed573;">${formatarMoeda(totalPago)}</strong>
      </div>
      <div class="success-order-line">
        <span>Status do Pagamento:</span>
        <strong style="color: #2ed573;">Aprovado</strong>
      </div>
    `;

    modalSucesso.classList.add('is-open');
    modalSucesso.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  } else {
    exibirToast('Compra concluída com sucesso! Pedido #' + numeroPedido, 'sucesso');
  }
}

function fecharModalSucesso() {
  const modal = $('#success-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function abrirModalProduto(codigo) {
  let prod = buscarProdutoPorCodigo(codigo);
  if (!prod) return;

  const modal = $('#product-modal');
  const modalBody = $('#modal-body');
  if (!modal || !modalBody) return;

  let temEstoque = prod.temEstoque();
  let textoEstoque = temEstoque ? 'Em Estoque (' + prod.estoque + ' unidades)' : 'Esgotado';
  let classeEstoque = temEstoque ? 'style="color: #2ed573;"' : 'style="color: #ff4757;"';

  let specsHtml = '';
  for (let i = 0; i < prod.specs.length; i++) {
    specsHtml += '<li>' + prod.specs[i] + '</li>';
  }

  let botaoDisabled = temEstoque ? '' : 'disabled';
  let botaoTexto = temEstoque ? 'Adicionar à Sacola +' : 'Produto Esgotado';

  modalBody.innerHTML = `
    <div class="modal-img-col">
      <img src="${prod.imagem}" alt="${prod.nome}" />
    </div>
    <div class="modal-info-col">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="modal-cat">${prod.categoria.toUpperCase()}</span>
        <span ${classeEstoque} style="font-size: 12px; font-weight: bold;">${textoEstoque}</span>
      </div>
      <h3 class="modal-title">${prod.nome}</h3>
      <p class="modal-desc">${prod.descricao}</p>
      <ul class="modal-specs-list">
        ${specsHtml}
      </ul>
      <div class="modal-price-box">
        <span class="modal-price">${formatarMoeda(prod.preco)}</span>
        <span class="modal-split">ou 12x de ${formatarMoeda(prod.preco / 12)} sem juros</span>
      </div>
      <div class="modal-actions">
        <button class="btn-modal-add" id="btn-modal-add-item" data-codigo="${prod.codigo}" ${botaoDisabled}>
          ${botaoTexto}
        </button>
        <a href="https://wa.me/?text=Ol%C3%A1%2C%20gostaria%20de%20consultar%20sobre%20o%20${encodeURIComponent(prod.nome)}" target="_blank" rel="noopener" class="btn-modal-wa">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          Consultar via WhatsApp
        </a>
      </div>
    </div>
  `;

  const btnAdd = $('#btn-modal-add-item', modalBody);
  if (btnAdd && temEstoque) {
    btnAdd.addEventListener('click', () => {
      adicionarAoCarrinho(prod.codigo);
      fecharModalProduto();
    });
  }

  modal.classList.add('is-active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function fecharModalProduto() {
  const modal = $('#product-modal');
  if (!modal) return;
  modal.classList.remove('is-active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function exibirToast(mensagem, tipo = 'sucesso') {
  const toast = $('#toast-notification');
  const toastText = $('#toast-text');
  const toastIcon = $('.toast-icon', toast);
  if (!toast || !toastText) return;

  toastText.textContent = mensagem;

  if (toastIcon) {
    if (tipo === 'erro') {
      toastIcon.textContent = '✕';
      toastIcon.style.color = '#ff4757';
      toastIcon.style.background = 'rgba(255, 71, 87, 0.2)';
    } else {
      toastIcon.textContent = '✓';
      toastIcon.style.color = '#2ed573';
      toastIcon.style.background = 'rgba(46, 213, 115, 0.2)';
    }
  }

  toast.classList.add('is-show');

  if (window.toastTimer) clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('is-show');
  }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
  filtrarProdutos();
  atualizarCarrinhoUI();

  const searchInput = $('#catalog-search-input');
  const searchClear = $('#catalog-search-clear');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      termoBuscaAtual = e.target.value;
      if (searchClear) {
        searchClear.style.display = termoBuscaAtual.length > 0 ? 'flex' : 'none';
      }
      filtrarProdutos();
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      termoBuscaAtual = '';
      searchClear.style.display = 'none';
      searchInput.focus();
      filtrarProdutos();
    });
  }

  const btnSearchNav = $('#btn-search');
  if (btnSearchNav) {
    btnSearchNav.addEventListener('click', () => {
      const secaoCatalogo = $('#catalogo');
      if (secaoCatalogo) {
        secaoCatalogo.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (searchInput) searchInput.focus();
        }, 500);
      }
    });
  }

  $$('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-pill').forEach(p => {
        p.classList.remove('is-active');
        p.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      categoriaFiltroAtual = btn.dataset.filter;
      filtrarProdutos();
    });
  });

  $$('.footer-filter-link').forEach(link => {
    link.addEventListener('click', (e) => {
      let filtro = link.dataset.filter;
      if (!filtro) return;

      categoriaFiltroAtual = filtro;
      $$('.filter-pill').forEach(btn => {
        let ativa = btn.dataset.filter === filtro;
        btn.classList.toggle('is-active', ativa);
        btn.setAttribute('aria-selected', ativa ? 'true' : 'false');
      });

      filtrarProdutos();
    });
  });

  const btnCart = $('#btn-cart');
  if (btnCart) {
    btnCart.addEventListener('click', abrirCarrinho);
  }

  const btnCloseCart = $('#btn-close-cart');
  if (btnCloseCart) {
    btnCloseCart.addEventListener('click', fecharCarrinho);
  }

  const backdropCart = $('#cart-drawer-backdrop');
  if (backdropCart) {
    backdropCart.addEventListener('click', fecharCarrinho);
  }

  const btnClearCart = $('#btn-clear-cart');
  if (btnClearCart) {
    btnClearCart.addEventListener('click', () => {
      if (meuCarrinho.itens.length === 0) return;
      meuCarrinho.limpar();
      atualizarCarrinhoUI();
      exibirToast('Carrinho esvaziado com sucesso.', 'sucesso');
    });
  }

  const btnCheckout = $('#btn-checkout');
  if (btnCheckout) {
    btnCheckout.addEventListener('click', abrirModalCheckout);
  }

  const btnCloseCheckout = $('#btn-close-checkout');
  if (btnCloseCheckout) {
    btnCloseCheckout.addEventListener('click', fecharModalCheckout);
  }

  const backdropCheckout = $('#checkout-modal-backdrop');
  if (backdropCheckout) {
    backdropCheckout.addEventListener('click', fecharModalCheckout);
  }

  const btnCancelOrder = $('#btn-cancel-order');
  if (btnCancelOrder) {
    btnCancelOrder.addEventListener('click', () => {
      fecharModalCheckout();
      abrirCarrinho();
    });
  }

  const btnConfirmOrder = $('#btn-confirm-order');
  if (btnConfirmOrder) {
    btnConfirmOrder.addEventListener('click', confirmarPedido);
  }

  const btnCloseSuccess = $('#btn-close-success');
  if (btnCloseSuccess) {
    btnCloseSuccess.addEventListener('click', fecharModalSucesso);
  }

  const backdropSuccess = $('#success-modal-backdrop');
  if (backdropSuccess) {
    backdropSuccess.addEventListener('click', fecharModalSucesso);
  }

  const modalProductClose = $('#modal-close');
  if (modalProductClose) {
    modalProductClose.addEventListener('click', fecharModalProduto);
  }

  const modalProductBackdrop = $('#modal-backdrop');
  if (modalProductBackdrop) {
    modalProductBackdrop.addEventListener('click', fecharModalProduto);
  }

  const btnHeroBuy = $('#btn-buy-hero-phone');
  if (btnHeroBuy) {
    btnHeroBuy.addEventListener('click', () => {
      adicionarAoCarrinho(1);
    });
  }

  const hamburger = $('#btn-hamburger');
  const menu = $('#mobile-menu');
  const closeMenuBtn = $('#btn-mobile-close');

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeMenuBtn && menu) {
    closeMenuBtn.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  $$('.mm-link').forEach(link => {
    link.addEventListener('click', () => {
      if (menu) {
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      fecharCarrinho();
      fecharModalCheckout();
      fecharModalSucesso();
      fecharModalProduto();
      if (menu) {
        menu.classList.remove('is-open');
        menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }
  });

  const hero = $('#hero');
  const spotlight = $('#hero-spotlight');
  const image = $('#spotlight-image');
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (hero && spotlight && image && !isTouchDevice) {
    const RADIUS = 260;
    const FEATHER = 80;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isOver = false;
    let rafId = null;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function applyMask(x, y) {
      const rect = image.getBoundingClientRect();
      const imgX = x - rect.left;
      const imgY = y - rect.top;
      const pctX = ((imgX / rect.width) * 100).toFixed(2) + '%';
      const pctY = ((imgY / rect.height) * 100).toFixed(2) + '%';
      const outer = RADIUS + FEATHER;

      const mask = `radial-gradient(circle ${outer}px at ${pctX} ${pctY}, black ${RADIUS}px, transparent ${outer}px)`;
      image.style.webkitMaskImage = mask;
      image.style.maskImage = mask;
    }

    function animateSpotlight() {
      currentX = lerp(currentX, targetX, 0.12);
      currentY = lerp(currentY, targetY, 0.12);
      applyMask(currentX, currentY);

      if (isOver || Math.abs(currentX - targetX) > 0.5 || Math.abs(currentY - targetY) > 0.5) {
        rafId = requestAnimationFrame(animateSpotlight);
      } else {
        rafId = null;
      }
    }

    hero.addEventListener('mouseenter', () => {
      isOver = true;
      spotlight.classList.add('is-active');
      if (!rafId) rafId = requestAnimationFrame(animateSpotlight);
    });

    hero.addEventListener('mouseleave', () => {
      isOver = false;
      spotlight.classList.remove('is-active');
      image.style.webkitMaskImage = 'radial-gradient(circle 0px at 50% 50%, black 0%, transparent 0%)';
      image.style.maskImage = 'radial-gradient(circle 0px at 50% 50%, black 0%, transparent 0%)';
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });

    hero.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(animateSpotlight);
    });
  }

  const nav = $('.hero-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.style.background = 'rgba(0, 0, 0, 0.88)';
        nav.style.backdropFilter = 'blur(20px)';
        nav.style.webkitBackdropFilter = 'blur(20px)';
        nav.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = '';
        nav.style.webkitBackdropFilter = '';
        nav.style.borderColor = 'rgba(255, 255, 255, 0.07)';
      }
    }, { passive: true });
  }

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href === '') return;
      const elem = document.getElementById(href.slice(1));
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
