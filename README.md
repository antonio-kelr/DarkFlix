# 🎬 CineMax - Site de Filmes

Site de filmes moderno que consome a API do The Movie Database (TMDB) para exibir filmes populares, permitir pesquisa e mostrar detalhes completos dos filmes.

## 🚀 Funcionalidades

- **🏠 Página Home**: Lista de filmes populares em grid responsivo
- **🔍 Pesquisa**: Campo de busca por título de filmes
- **📱 Design Responsivo**: Adaptável para desktop, tablet e mobile
- **🎭 Página de Detalhes**: Informações completas do filme (poster, sinopse, gêneros, avaliação, duração)
- **🎨 Interface Moderna**: Design escuro com gradientes e animações

## 📁 Estrutura do Projeto

```
Filme/
├── home.html          # Página inicial com lista de filmes
├── detalhes.html      # Página de detalhes do filme
├── style.css          # Estilos CSS responsivos
├── home.js            # JavaScript da página home
├── detalhes.js        # JavaScript da página de detalhes
└── README.md          # Documentação
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Grid, Flexbox, animações e design responsivo
- **JavaScript ES6+**: Fetch API, LocalStorage, manipulação DOM
- **TMDB API**: Base de dados de filmes

## ⚙️ Como Configurar

### 1. Obter API Key do TMDB

1. Acesse [The Movie Database](https://www.themoviedb.org/)
2. Crie uma conta gratuita
3. Vá em **Settings** → **API**
4. Copie sua **API Key**

### 2. Configurar o Projeto

1. Abra o arquivo `home.js`
2. Substitua `'SUA_API_KEY_AQUI'` pela sua API key:
```javascript
const API_KEY = 'sua_api_key_real_aqui';
```

3. Repita o processo no arquivo `detalhes.js`

### 3. Executar o Projeto

- **Opção 1**: Abra `home.html` diretamente no navegador
- **Opção 2**: Use um servidor local:
  ```bash
  # Python
  python -m http.server 8000
  
  # Node.js
  npx serve .
  ```

## 🎯 Como Usar

1. **Página Inicial**: Visualize filmes populares
2. **Pesquisar**: Digite o nome do filme no campo de busca
3. **Ver Detalhes**: Clique em qualquer filme para ver informações completas
4. **Voltar**: Use o botão "Voltar para Home" na página de detalhes

## 🌐 APIs Utilizadas

- `GET /movie/popular` - Filmes populares
- `GET /search/movie` - Pesquisa de filmes
- `GET /movie/{id}` - Detalhes do filme
- Imagens: `https://image.tmdb.org/t/p/w500/`

## 📱 Responsividade

- **Desktop**: Grid com múltiplas colunas
- **Tablet**: Grid adaptativo
- **Mobile**: Layout em coluna única

## 🎨 Características do Design

- **Paleta de Cores**: Tons escuros com vermelho como cor de destaque
- **Tipografia**: Segoe UI para melhor legibilidade
- **Animações**: Hover effects e transições suaves
- **Layout**: Grid responsivo e flexbox

## 🔧 Personalização

Para personalizar o visual, edite as variáveis CSS em `style.css`:

```css
:root {
    --color-primary: #1a1a2e;
    --color-secondary: #e94560;
    --color-accent: #0f3460;
    --color-text: #ffffff;
}
```

## 📄 Licença

Projeto livre para uso pessoal e educacional.