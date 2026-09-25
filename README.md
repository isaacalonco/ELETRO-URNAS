# ELETRO URNAS — Loja Virtual

Projeto desenvolvido para a disciplina **Programação para Web (GPE02M30026)**.  
**Professor:** Ranyelson Neres Carvalho — Centro Universitário Católica

Aplicação Web de vendas (*e-commerce*) desenvolvida utilizando **HTML5, CSS3 e JavaScript puro**, simulando uma loja virtual de eletrônicos e novidades tecnológicas, totalmente executada no navegador sem frameworks ou dependências externas.

---

## 🚀 Funcionalidades

- **Catálogo de Produtos Dinâmico:**
  - Produtos gerados dinamicamente via manipulação do DOM a partir de instâncias da classe `Produto`.
  - Exibição de foto, nome, categoria, preço formatado em Real (R$), descrição e status do estoque.
  - Bloqueio e indicação visual de produtos esgotados.

- **Filtros e Busca em Tempo Real:**
  - Campo de busca textual por nome e descrição do item.
  - Filtro por categorias com estrutura de seleção (`switch`).

- **Carrinho de Compras Interativo:**
  - Gerenciado através da classe `Carrinho`.
  - Adição de produtos, incremento e decremento de quantidades respeitando o estoque.
  - Remoção individual e opção de esvaziar o carrinho.
  - Atualização em tempo real do contador de itens e subtotal.

- **Cálculo da Compra & Regra de Desconto:**
  - Aplicação de **10% de desconto** para compras a partir de R$ 300,00.
  - Simulação de parcelamento sem juros em até 12x.

- **Finalização da Compra (Checkout):**
  - Modal com resumo completo dos produtos, quantidades, desconto e valor total.
  - Baixa automática no estoque dos itens adquiridos.
  - Confirmação com número de pedido gerado.

---

## 🛠️ Tecnologias e Conceitos Aplicados

- **HTML5:** Estruturação semântica da página.
- **CSS3:** Estilização limpa, moderna, modular e responsiva com Flexbox e CSS Grid.
- **JavaScript (Vanilla / ES6+):**
  - Declaração de variáveis com `var`, `let` e `const`.
  - Tipos primitivos: `string`, `number`, `boolean`, `array` e `object`.
  - Operadores aritméticos (`+`, `-`, `*`, `/`) e de comparação (`===`, `!==`, `>`, `<`).
  - Estruturas de controle de fluxo: `if / else if / else` e `switch`.
  - Estruturas de repetição: `for` e `while`.
  - Programação Orientada a Objetos (POO): Classes `Produto` e `Carrinho` com atributos e métodos.
  - Funções tradicionais e arrow functions.
  - Manipulação do DOM (`document.getElementById`, `createElement`, `append`, `innerHTML`, `textContent`, `addEventListener`).

---

## 📁 Estrutura do Projeto

```text
PROGRAMCAO-WEB/
│
├── index.html        # Página principal e estrutura HTML
├── README.md         # Documentação da aplicação
│
├── css/
│   ├── reset.css     # Reset básico de estilos
│   └── styles.css    # Estilização limpa e responsiva da loja
│
├── js/
│   └── main.js       # Classes, catálogo e manipulação do DOM
│
└── assets/           # Imagens dos produtos
```

---

## 💻 Como Executar

1. Clone o repositório ou faça o download dos arquivos:
   ```bash
   git clone https://github.com/isaacalonco/ELETRO-URNAS.git
   ```
2. Abra o arquivo `index.html` em qualquer navegador web (Google Chrome, Firefox, Edge, etc.) ou através da extensão *Live Server*.
