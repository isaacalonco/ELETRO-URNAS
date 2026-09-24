# ELETRO URNAS — E-Commerce

Projeto desenvolvido para a atividade **N1 – AT2 - Programação para Web (2026)**.

Aplicação Web de vendas (*e-commerce*) desenvolvida utilizando **HTML5, CSS3 e JavaScript puro**, simulando as principais funcionalidades de uma loja virtual premium de eletrônicos e gadgets de ponta.

---

## 🚀 Funcionalidades

- **Página Inicial Completa:**
  - Identidade visual moderna e responsiva (*Dark Mode / Aesthetic Glassmorphism*).
  - Vitrine em destaque (*Hero Showcase*) do iPhone 18 Pro Max com detalhes técnicos.
  - Seções editoriais institucionais e canais de contato.

- **Catálogo de Produtos Dinâmico:**
  - Produtos gerados dinamicamente via manipulação do DOM a partir de instâncias de classes JavaScript.
  - Exibição de imagem, nome, categoria, preço formatado em BRL, especificações técnicas e disponibilidade de estoque em tempo real.
  - Tratamento de itens sem estoque (ex: exibição de badge *Esgotado* e bloqueio do botão de compra).

- **Busca & Filtros:**
  - Campo de busca em tempo real com pesquisa por nome do produto.
  - Filtros interativos por categoria (*Smartphones, Computadores, Áudio, Tablets, Smartwatches*).
  - Tratamento e feedback visual quando nenhum produto atende aos critérios da busca.

- **Carrinho de Compras Interativo (Drawer Lateral):**
  - Adição de produtos ao carrinho com atualização instantânea da badge no cabeçalho.
  - Listagem dos itens com foto, nome, valor unitário, quantidade e subtotal por produto.
  - Botões para aumentar (`+`) e diminuir (`−`) a quantidade, respeitando estritamente o limite de estoque disponível.
  - Remoção individual de itens e opção para esvaziar o carrinho.

- **Cálculo da Compra & Regra de Desconto:**
  - Atualização automática em tempo real do total de itens, subtotal, desconto e valor final.
  - Aplicação condicional de **10% de desconto** para compras a partir de R$ 300,00, com aviso informativo na sacola.
  - Cálculo e simulação de opções de parcelamento sem juros em até 12x.

- **Finalização da Compra (Checkout):**
  - Validação impedindo finalização com carrinho vazio.
  - Modal com resumo detalhado do pedido (itens, quantidades, subtotal, desconto aplicado e total a pagar).
  - Confirmação de pedido com baixa automática no estoque dos produtos e modal de confirmação com código de rastreio/pedido gerado.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica e acessível.
- **CSS3:** Design System com variáveis CSS (Tokens), flexbox, grid, animações fluidas e suporte a responsividade.
- **JavaScript (ES6+):**
  - Variáveis com `let`, `var` e `const`.
  - Tipos primitivos: `string`, `number`, `boolean`.
  - Operadores aritméticos e de comparação.
  - Estruturas condicionais `if` / `else`.
  - Estruturas de repetição `for` e `while`.
  - Programação Orientada a Objetos com as classes `Produto` e `Carrinho`.
  - Funções tradicionais e arrow functions.
  - Manipulação avançada do DOM sem frameworks ou dependências externas.

---

## 📁 Estrutura de Pastas

```text
PROGRAMCAO-WEB/
│
├── index.html        # Página principal da aplicação
├── README.md         # Documentação do projeto
│
├── css/
│   ├── reset.css     # Normalização e reset de estilos
│   ├── tokens.css    # Variáveis e tokens de design (cores, fontes, espaçamentos)
│   └── styles.css    # Folhas de estilo da aplicação e componentes
│
├── js/
│   └── main.js       # Classes, lógica de negócio, catálogo e eventos do DOM
│
└── assets/           # Imagens dos produtos e backgrounds
```

---

## 💻 Como Executar

1. Clone o repositório ou faça o download dos arquivos:
   ```bash
   git clone https://github.com/isaacalonco/ELETRO-URNAS.git
   ```
2. Abra o arquivo `index.html` diretamente em seu navegador web (Google Chrome, Firefox, Edge, Safari, etc.) ou execute através de uma extensão como o *Live Server*.
3. Não é necessária a instalação de bibliotecas, pacotes npm ou configuração de banco de dados.
