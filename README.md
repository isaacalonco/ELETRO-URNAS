# ELETRO URNAS — E-Commerce

Projeto desenvolvido para a disciplina **Programação para Web (GPE02M30026)**.  
**Professor:** Ranyelson Neres Carvalho — Centro Universitário Católica

Aplicação Web de vendas (*e-commerce*) desenvolvida utilizando **HTML5, CSS3 e JavaScript puro**, simulando uma loja virtual premium de eletrônicos e novidades tecnológicas, totalmente executada no navegador sem frameworks ou dependências externas.

---

## 🚀 Funcionalidades

- **Identidade Visual & Hero Section:**
  - Layout moderno responsivo (*Dark Mode / Glassmorphism*).
  - Vitrine editorial do iPhone com efeito dinâmico interativo via JavaScript/CSS.
  - Navegação com blur e transições fluidas.

- **Catálogo de Produtos Dinâmico:**
  - Produtos gerados dinamicamente via manipulação do DOM a partir de instâncias da classe `Produto`.
  - Exibição de foto, nome, categoria, preço formatado em Real (R$), especificações técnicas e disponibilidade de estoque em tempo real.
  - Bloqueio e indicação visual para produtos sem estoque (*Esgotado*).

- **Busca & Filtros em Tempo Real:**
  - Campo de busca textual por nome de produto.
  - Filtro interativo por categorias (*Smartphones, Computadores, Áudio, Tablets, Smartwatches*).
  - Feedback visual e botão de reset quando a busca não retorna resultados.

- **Carrinho de Compras Interativo (Drawer Lateral):**
  - Gerenciado através da classe `Carrinho`.
  - Adição de produtos com atualização instantânea do badge e abertura de gaveta lateral.
  - Incremento e decremento de quantidades respeitando o limite de estoque.
  - Remoção individual e opção de esvaziar o carrinho.

- **Cálculo da Compra & Regra de Desconto:**
  - Aplicação condicional de **10% de desconto** para compras a partir de R$ 300,00.
  - Simulação de parcelamento sem juros em até 12x.

- **Finalização da Compra (Checkout):**
  - Modal com resumo detalhado do pedido (itens, quantidades, subtotal, desconto e total).
  - Baixa automática no estoque dos itens adquiridos.
  - Confirmação com número do pedido gerado dinamicamente.

---

## 🛠️ Arquitetura & Divisão do JavaScript

Para manter o código organizado, modular e de fácil manutenção, o JavaScript foi dividido em duas camadas:

1. **`js/logico.js` (Camada Lógica / Regras de Negócio):**
   - Variáveis globais e constantes (`var`, `let`, `const`).
   - Classes Orientadas a Objetos: `Produto` e `Carrinho`.
   - Métodos de manipulação de estoque e cálculo de valores (subtotal, desconto, total, parcelas).
   - Catálogo de dados dos produtos (`catalogoProdutos`).
   - Funções puras de busca e filtragem (`buscarProdutoPorCodigo`, `obterProdutosFiltrados`).

2. **`js/ui.js` (Camada de Interface, DOM e CSS):**
   - Manipulação de seletores e injeção dinâmica no DOM.
   - Aplicação de classes CSS para estados (`.is-open`, `.is-active`, etc.).
   - Controle de abertura e fechamento de modais e do drawer lateral com backdrop.
   - Efeitos visuais (spotlight do Hero, navbar com blur ao rolar a página).
   - Sistema de notificações flutuantes (*toasts*).
   - Vinculação de eventos de formulários, cliques e atalhos de teclado (Escape).

---

## 📁 Estrutura de Arquivos

```text
PROGRAMCAO-WEB/
│
├── index.html        # Página principal e marcação semântica
├── README.md         # Documentação da aplicação
│
├── css/
│   ├── reset.css     # Normalização e reset básico de estilos
│   ├── tokens.css    # Design tokens (cores, fontes, espaçamentos)
│   └── styles.css    # Estilização completa, dark mode e responsividade
│
├── js/
│   ├── logico.js     # JavaScript Lógico: Classes, regras de negócio e cálculos
│   └── ui.js         # JavaScript de CSS/Interface: DOM, animações e modais
│
└── assets/           # Imagens dos produtos e backgrounds
```

---

## 💻 Como Executar

1. Clone o repositório ou faça o download dos arquivos:
   ```bash
   git clone https://github.com/isaacalonco/ELETRO-URNAS.git
   ```
2. Abra o arquivo `index.html` em qualquer navegador web moderno (Chrome, Edge, Firefox, Safari) ou utilize uma extensão como o *Live Server*.

Raphael Gondim 
