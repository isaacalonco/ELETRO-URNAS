var nomeLoja = "ELETRO URNAS";
const valorMinimoDesconto = 300.0;
const taxaDesconto = 0.10;

function formatarMoeda(valor) {
  return "R$ " + valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

const calcularParcelas = (total) => {
  let parcelas = 1;
  let texto = "";
  while (parcelas <= 12) {
    let valorParcela = total / parcelas;
    texto = `${parcelas}x de ${formatarMoeda(valorParcela)} sem juros`;
    parcelas++;
  }
  return texto;
};

class Produto {
  constructor(codigo, nome, categoria, preco, estoque, imagem, descricao) {
    this.codigo = codigo;
    this.nome = nome;
    this.categoria = categoria;
    this.preco = preco;
    this.estoque = estoque;
    this.imagem = imagem;
    this.descricao = descricao;
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
}

class Carrinho {
  constructor() {
    this.itens = [];
  }

  adicionar(produto) {
    if (!produto.temEstoque()) {
      alert("Produto esgotado no momento!");
      return false;
    }

    let itemExistente = this.itens.find(item => item.produto.codigo === produto.codigo);

    if (itemExistente) {
      if (itemExistente.quantidade < produto.estoque) {
        itemExistente.quantidade++;
        return true;
      } else {
        alert("Limite de estoque atingido (" + produto.estoque + " unidades disponíveis).");
        return false;
      }
    } else {
      this.itens.push({
        produto: produto,
        quantidade: 1
      });
      return true;
    }
  }

  aumentar(codigo) {
    let item = this.itens.find(item => item.produto.codigo === codigo);
    if (item) {
      if (item.quantidade < item.produto.estoque) {
        item.quantidade++;
        return true;
      } else {
        alert("Estoque máximo atingido para este item.");
        return false;
      }
    }
    return false;
  }

  diminuir(codigo) {
    let index = this.itens.findIndex(item => item.produto.codigo === codigo);
    if (index !== -1) {
      if (this.itens[index].quantidade > 1) {
        this.itens[index].quantidade--;
      } else {
        this.itens.splice(index, 1);
      }
      return true;
    }
    return false;
  }

  remover(codigo) {
    let index = this.itens.findIndex(item => item.produto.codigo === codigo);
    if (index !== -1) {
      this.itens.splice(index, 1);
      return true;
    }
    return false;
  }

  calcularSubtotal() {
    let subtotal = 0;
    for (let i = 0; i < this.itens.length; i++) {
      subtotal += this.itens[i].produto.preco * this.itens[i].quantidade;
    }
    return subtotal;
  }

  calcularDesconto() {
    let subtotal = this.calcularSubtotal();
    if (subtotal >= valorMinimoDesconto) {
      return subtotal * taxaDesconto;
    }
    return 0;
  }

  calcularTotal() {
    let total = this.calcularSubtotal() - this.calcularDesconto();
    if (total < 0) {
      return 0;
    }
    return total;
  }

  obterQuantidadeTotal() {
    let total = 0;
    for (let item of this.itens) {
      total += item.quantidade;
    }
    return total;
  }

  limpar() {
    this.itens = [];
  }
}

const produtos = [
  new Produto(
    1,
    "iPhone 16 Pro Max",
    "smartphones",
    10499.00,
    5,
    "assets/iphone.png",
    "Tela Super Retina XDR de 6.9 polegadas, chip A18 Pro e câmera de 48MP."
  ),
  new Produto(
    2,
    "MacBook Pro 16\" M4",
    "computadores",
    24999.00,
    3,
    "assets/macbook.png",
    "Chip M4 Max de alto desempenho, 36GB de RAM e 1TB SSD ultrarrápido."
  ),
  new Produto(
    3,
    "AirPods Pro 2",
    "audio",
    2399.00,
    8,
    "assets/airpods.png",
    "Cancelamento Ativo de Ruído, Áudio Espacial e estojo com USB-C."
  ),
  new Produto(
    4,
    "iPad Pro 13\"",
    "tablets",
    12299.00,
    4,
    "assets/ipad.jpg",
    "Tela Ultra Retina OLED, processador Apple M4 e suporte à Apple Pencil Pro."
  ),
  new Produto(
    5,
    "Apple Watch Ultra 2",
    "wearables",
    7499.00,
    2,
    "assets/watch.jpg",
    "Caixa de titânio de 49mm, GPS de dupla precisão e bateria para até 72 horas."
  ),
  new Produto(
    6,
    "Carregador MagSafe Duo",
    "acessorios",
    349.00,
    10,
    "assets/Carregador.png",
    "Carregamento sem fio rápido e simultâneo para iPhone e Apple Watch."
  )
];

const carrinho = new Carrinho();

function renderizarCatalogo(lista) {
  let catalogoElemento = document.getElementById("catalogo");
  let mensagemVazio = document.getElementById("mensagemNenhumProduto");
  let contadorCatalogo = document.getElementById("totalProdutosExibidos");

  catalogoElemento.innerHTML = "";

  if (lista.length === 0) {
    mensagemVazio.style.display = "block";
    contadorCatalogo.textContent = "0 produtos encontrados";
    return;
  }

  mensagemVazio.style.display = "none";
  contadorCatalogo.textContent = `${lista.length} produto(s) disponível(is)`;

  for (let i = 0; i < lista.length; i++) {
    let p = lista[i];

    let card = document.createElement("div");
    card.className = "card-produto";

    let textoEstoque = p.temEstoque() ? `${p.estoque} em estoque` : "Esgotado";
    let classeEstoque = p.temEstoque() ? "card-estoque" : "card-estoque esgotado";
    let statusBotao = p.temEstoque() ? "" : "disabled";
    let textoBotao = p.temEstoque() ? "Adicionar ao Carrinho" : "Indisponível";

    card.innerHTML = `
      <div class="card-imagem-container">
        <img src="${p.imagem}" alt="${p.nome}" class="card-imagem">
      </div>
      <span class="card-categoria">${p.categoria}</span>
      <h3 class="card-titulo">${p.nome}</h3>
      <p class="card-descricao">${p.descricao}</p>
      <div class="card-rodape">
        <div class="card-preco-estoque">
          <span class="card-preco">${formatarMoeda(p.preco)}</span>
          <span class="${classeEstoque}">${textoEstoque}</span>
        </div>
        <button class="btn-adicionar" id="btn-comprar-${p.codigo}" ${statusBotao}>
          ${textoBotao}
        </button>
      </div>
    `;

    catalogoElemento.appendChild(card);

    let botao = document.getElementById(`btn-comprar-${p.codigo}`);
    if (p.temEstoque()) {
      botao.addEventListener("click", () => {
        carrinho.adicionar(p);
        atualizarCarrinho();
        abrirCarrinho();
      });
    }
  }
}

function filtrarProdutos() {
  let termo = document.getElementById("inputBusca").value.trim().toLowerCase();
  let categoria = document.getElementById("selectCategoria").value;

  let filtrados = [];

  for (let i = 0; i < produtos.length; i++) {
    let p = produtos[i];
    let nomeCoincide = p.nome.toLowerCase().includes(termo);
    let descricaoCoincide = p.descricao.toLowerCase().includes(termo);
    let buscaValida = nomeCoincide || descricaoCoincide;

    let categoriaValida = false;
    switch (categoria) {
      case "todos":
        categoriaValida = true;
        break;
      case "smartphones":
        categoriaValida = (p.categoria === "smartphones");
        break;
      case "computadores":
        categoriaValida = (p.categoria === "computadores");
        break;
      case "audio":
        categoriaValida = (p.categoria === "audio");
        break;
      case "tablets":
        categoriaValida = (p.categoria === "tablets");
        break;
      case "wearables":
        categoriaValida = (p.categoria === "wearables");
        break;
      case "acessorios":
        categoriaValida = (p.categoria === "acessorios");
        break;
      default:
        categoriaValida = true;
        break;
    }

    if (buscaValida && categoriaValida) {
      filtrados.push(p);
    }
  }

  renderizarCatalogo(filtrados);
}

function atualizarCarrinho() {
  let contador = document.getElementById("contadorCarrinho");
  let containerItens = document.getElementById("itensCarrinho");
  let avisoVazio = document.getElementById("avisoCarrinhoVazio");
  let subtotalTexto = document.getElementById("subtotalValor");
  let descontoTexto = document.getElementById("descontoValor");
  let totalTexto = document.getElementById("totalValor");
  let parcelasTexto = document.getElementById("parcelamentoTexto");

  contador.textContent = carrinho.obterQuantidadeTotal();
  containerItens.innerHTML = "";

  if (carrinho.itens.length === 0) {
    avisoVazio.style.display = "block";
    subtotalTexto.textContent = formatarMoeda(0);
    descontoTexto.textContent = "- " + formatarMoeda(0);
    totalTexto.textContent = formatarMoeda(0);
    parcelasTexto.textContent = "";
    return;
  }

  avisoVazio.style.display = "none";

  for (let i = 0; i < carrinho.itens.length; i++) {
    let item = carrinho.itens[i];
    let p = item.produto;

    let itemDiv = document.createElement("div");
    itemDiv.className = "item-carrinho";

    itemDiv.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}" class="item-carrinho-imagem">
      <div class="item-carrinho-info">
        <h4 class="item-carrinho-nome">${p.nome}</h4>
        <p class="item-carrinho-preco">${formatarMoeda(p.preco)} cada</p>
        <div class="item-carrinho-controles">
          <button id="btn-menos-${p.codigo}">-</button>
          <span>${item.quantidade}</span>
          <button id="btn-mais-${p.codigo}">+</button>
        </div>
      </div>
      <button class="btn-remover-item" id="btn-remover-${p.codigo}" title="Remover item">🗑</button>
    `;

    containerItens.appendChild(itemDiv);

    document.getElementById(`btn-menos-${p.codigo}`).addEventListener("click", () => {
      carrinho.diminuir(p.codigo);
      atualizarCarrinho();
    });

    document.getElementById(`btn-mais-${p.codigo}`).addEventListener("click", () => {
      carrinho.aumentar(p.codigo);
      atualizarCarrinho();
    });

    document.getElementById(`btn-remover-${p.codigo}`).addEventListener("click", () => {
      carrinho.remover(p.codigo);
      atualizarCarrinho();
    });
  }

  let subtotal = carrinho.calcularSubtotal();
  let desconto = carrinho.calcularDesconto();
  let total = carrinho.calcularTotal();

  subtotalTexto.textContent = formatarMoeda(subtotal);
  descontoTexto.textContent = "- " + formatarMoeda(desconto);
  totalTexto.textContent = formatarMoeda(total);

  if (total > 0) {
    parcelasTexto.textContent = "ou até " + calcularParcelas(total);
  } else {
    parcelasTexto.textContent = "";
  }
}

function abrirCarrinho() {
  document.getElementById("drawerCarrinho").classList.add("aberto");
  document.getElementById("backdropCarrinho").classList.add("aberto");
}

function fecharCarrinho() {
  document.getElementById("drawerCarrinho").classList.remove("aberto");
  document.getElementById("backdropCarrinho").classList.remove("aberto");
}

function abrirCheckout() {
  if (carrinho.itens.length === 0) {
    alert("Seu carrinho está vazio! Adicione itens antes de finalizar.");
    return;
  }

  let modal = document.getElementById("modalCheckout");
  let detalhes = document.getElementById("detalhesPedido");

  let htmlResumo = "";
  for (let i = 0; i < carrinho.itens.length; i++) {
    let item = carrinho.itens[i];
    let sub = item.produto.preco * item.quantidade;
    htmlResumo += `
      <div class="linha-item-resumo">
        <span>${item.quantidade}x ${item.produto.nome}</span>
        <strong>${formatarMoeda(sub)}</strong>
      </div>
    `;
  }

  let subtotal = carrinho.calcularSubtotal();
  let desconto = carrinho.calcularDesconto();
  let total = carrinho.calcularTotal();

  htmlResumo += `
    <hr style="margin: 0.75rem 0; border: none; border-top: 1px solid #cbd5e1;">
    <div class="linha-item-resumo">
      <span>Subtotal:</span>
      <span>${formatarMoeda(subtotal)}</span>
    </div>
    <div class="linha-item-resumo" style="color: #059669;">
      <span>Desconto Aplicado:</span>
      <span>- ${formatarMoeda(desconto)}</span>
    </div>
    <div class="linha-item-resumo" style="font-size: 1.1rem; font-weight: bold; margin-top: 0.5rem;">
      <span>Total a Pagar:</span>
      <span style="color: #0284c7;">${formatarMoeda(total)}</span>
    </div>
  `;

  detalhes.innerHTML = htmlResumo;
  fecharCarrinho();
  modal.classList.add("aberto");
}

function fecharCheckout() {
  document.getElementById("modalCheckout").classList.remove("aberto");
}

function confirmarCompra() {
  let codigoPedido = Math.floor(100000 + Math.random() * 900000);
  let totalPago = carrinho.calcularTotal();
  let quantidadeItens = carrinho.obterQuantidadeTotal();

  let index = 0;
  while (index < carrinho.itens.length) {
    let item = carrinho.itens[index];
    item.produto.decrementarEstoque(item.quantidade);
    index++;
  }

  carrinho.limpar();
  atualizarCarrinho();
  renderizarCatalogo(produtos);
  fecharCheckout();

  let modalSucesso = document.getElementById("modalSucesso");
  let msg = document.getElementById("mensagemSucesso");
  msg.innerHTML = `
    Pedido <strong>#${codigoPedido}</strong> confirmado!<br>
    Quantidade de produtos: <strong>${quantidadeItens}</strong><br>
    Valor total: <strong>${formatarMoeda(totalPago)}</strong>
  `;

  modalSucesso.classList.add("aberto");
}

function fecharSucesso() {
  document.getElementById("modalSucesso").classList.remove("aberto");
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarCatalogo(produtos);
  atualizarCarrinho();

  let inputBusca = document.getElementById("inputBusca");
  let selectCategoria = document.getElementById("selectCategoria");
  let btnAbrirCarrinho = document.getElementById("btnAbrirCarrinho");
  let btnFecharCarrinho = document.getElementById("btnFecharCarrinho");
  let backdropCarrinho = document.getElementById("backdropCarrinho");
  let btnLimparCarrinho = document.getElementById("btnLimparCarrinho");
  let btnFinalizarCompra = document.getElementById("btnFinalizarCompra");
  let btnCancelarCheckout = document.getElementById("btnCancelarCheckout");
  let btnConfirmarPedido = document.getElementById("btnConfirmarPedido");
  let btnFecharSucesso = document.getElementById("btnFecharSucesso");

  inputBusca.addEventListener("input", filtrarProdutos);
  selectCategoria.addEventListener("change", filtrarProdutos);

  btnAbrirCarrinho.addEventListener("click", abrirCarrinho);
  btnFecharCarrinho.addEventListener("click", fecharCarrinho);
  backdropCarrinho.addEventListener("click", fecharCarrinho);

  btnLimparCarrinho.addEventListener("click", () => {
    if (carrinho.itens.length > 0) {
      carrinho.limpar();
      atualizarCarrinho();
    }
  });

  btnFinalizarCompra.addEventListener("click", abrirCheckout);
  btnCancelarCheckout.addEventListener("click", fecharCheckout);
  btnConfirmarPedido.addEventListener("click", confirmarCompra);
  btnFecharSucesso.addEventListener("click", fecharSucesso);
});
