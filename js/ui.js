'use strict';

const $ = (seletor, contexto = document) => contexto.querySelector(seletor);
const $$ = (seletor, contexto = document) => [...contexto.querySelectorAll(seletor)];

let categoriaFiltroAtual = 'all';
let termoBuscaAtual = '';

function filtrarProdutos() {
  let produtosFiltrados = obterProdutosFiltrados(categoriaFiltroAtual, termoBuscaAtual);
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
                Info →
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  container.innerHTML = htmlCards;

  $$('.btn-card-add', container).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      let codigo = Number(btn.dataset.codigo);
      adicionarAoCarrinho(codigo);
    });
  });

  $$('.btn-card-details', container).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      let codigo = Number(btn.dataset.codigo);
      abrirModalProduto(codigo);
    });
  });
}

function adicionarAoCarrinho(codigo) {
  let prod = buscarProdutoPorCodigo(codigo);
  if (!prod) return;

  let resultado = meuCarrinho.adicionar(prod, 1);
  if (resultado.sucesso) {
    atualizarCarrinhoUI();
    exibirToast(resultado.mensagem, 'sucesso');
    abrirCarrinho();
  } else {
    exibirToast(resultado.mensagem, 'erro');
  }
}

function atualizarCarrinhoUI() {
  const badge = $('#cart-badge');
  const itemsContainer = $('#cart-items-list');
  const emptyState = $('#cart-empty-state');
  const footerElem = $('#cart-footer');
  const subtotalElem = $('#cart-subtotal');
  const discountElem = $('#cart-discount');
  const discountNotice = $('#cart-discount-notice');
  const totalElem = $('#cart-total');
  const parcelasElem = $('#cart-split');

  let totalQtd = meuCarrinho.obterQuantidadeTotal();
  if (badge) {
    badge.textContent = totalQtd;
    badge.style.transform = 'scale(1.25)';
    setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
  }

  if (meuCarrinho.itens.length === 0) {
    if (itemsContainer) itemsContainer.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    if (footerElem) footerElem.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (footerElem) footerElem.style.display = 'block';

  let subtotal = meuCarrinho.calcularSubtotal();
  let desconto = meuCarrinho.calcularDesconto();
  let total = meuCarrinho.calcularTotal();

  if (subtotalElem) subtotalElem.textContent = formatarMoeda(subtotal);
  if (discountElem) discountElem.textContent = '- ' + formatarMoeda(desconto);
  if (totalElem) totalElem.textContent = formatarMoeda(total);

  if (discountNotice) {
    if (subtotal >= valorMinimoDesconto) {
      discountNotice.style.display = 'flex';
    } else {
      discountNotice.style.display = 'none';
    }
  }

  if (parcelasElem) {
    parcelasElem.textContent = 'ou até ' + calcularParcelamento(total);
  }

  if (itemsContainer) {
    let htmlItens = '';
    for (let i = 0; i < meuCarrinho.itens.length; i++) {
      let item = meuCarrinho.itens[i];
      let p = item.produto;
      let subitem = p.preco * item.quantidade;
      let estoqueRestante = p.estoque;

      htmlItens += `
        <div class="cart-item" data-codigo="${p.codigo}">
          <div class="cart-item__thumb">
            <img src="${p.imagem}" alt="${p.nome}" />
          </div>
          <div class="cart-item__details">
            <h4 class="cart-item__title">${p.nome}</h4>
            <span class="cart-item__unit-price">${formatarMoeda(p.preco)} un.</span>
            <div class="cart-item__controls">
              <button class="cart-qty-btn btn-minus" data-codigo="${p.codigo}" aria-label="Diminuir quantidade">−</button>
              <span class="cart-item__qty">${item.quantidade}</span>
              <button class="cart-qty-btn btn-plus" data-codigo="${p.codigo}" aria-label="Aumentar quantidade" ${item.quantidade >= estoqueRestante ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>+</button>
              <button class="cart-item__remove" data-codigo="${p.codigo}" aria-label="Remover ${p.nome}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                <span>Remover</span>
              </button>
            </div>
          </div>
          <div class="cart-item__subtotal">
            <span>${formatarMoeda(subitem)}</span>
          </div>
        </div>
      `;
    }
    itemsContainer.innerHTML = htmlItens;

    $$('.btn-plus', itemsContainer).forEach(btn => {
      btn.addEventListener('click', () => {
        let cod = Number(btn.dataset.codigo);
        let ok = meuCarrinho.aumentarQuantidade(cod);
        if (ok) {
          atualizarCarrinhoUI();
        } else {
          exibirToast('Limite de estoque atingido.', 'erro');
        }
      });
    });

    $$('.btn-minus', itemsContainer).forEach(btn => {
      btn.addEventListener('click', () => {
        let cod = Number(btn.dataset.codigo);
        meuCarrinho.diminuirQuantidade(cod);
        atualizarCarrinhoUI();
      });
    });

    $$('.cart-item__remove', itemsContainer).forEach(btn => {
      btn.addEventListener('click', () => {
        let cod = Number(btn.dataset.codigo);
        meuCarrinho.remover(cod);
        atualizarCarrinhoUI();
        exibirToast('Item removido do carrinho.', 'sucesso');
      });
    });
  }
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
          <img src="${item.produto.imagem}" alt="${item.produto.nome}" />
          <div>
            <strong>${item.produto.nome}</strong>
            <small>${item.quantidade}x ${formatarMoeda(item.produto.preco)}</small>
          </div>
        </div>
        <div class="checkout-item-row__right">
          <span>${formatarMoeda(sub)}</span>
        </div>
      </div>
    `;
  }
  listElem.innerHTML = htmlItens;

  let subtotal = meuCarrinho.calcularSubtotal();
  let desconto = meuCarrinho.calcularDesconto();
  let total = meuCarrinho.calcularTotal();

  totalsElem.innerHTML = `
    <div class="checkout-line">
      <span>Subtotal dos Produtos:</span>
      <span>${formatarMoeda(subtotal)}</span>
    </div>
    <div class="checkout-line checkout-line--discount">
      <span>Desconto Aplicado (10%):</span>
      <span>- ${formatarMoeda(desconto)}</span>
    </div>
    <div class="checkout-line checkout-line--total">
      <span>Valor Total a Pagar:</span>
      <span class="checkout-total-val">${formatarMoeda(total)}</span>
    </div>
    <p class="checkout-parcelas-info">Em até ${calcularParcelamento(total)}</p>
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
    exibirToast('Não é possível concluir a compra sem produtos no carrinho.', 'erro');
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
