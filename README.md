# Flashcards.io 🚀

Uma plataforma premium de aprendizado acelerado e memorização científica de alta performance, totalmente client-side e offline-first. A aplicação utiliza o algoritmo de repetição espaçada SM-2 (Anki-style), painéis analíticos interativos, gamificação local, banco relacional seguro e uma avançada camada de portabilidade e backups locais.

Desenvolvido com **Vite, React, TypeScript, Zustand, Dexie (IndexedDB), Recharts, react-day-picker v10 e Tailwind CSS v4**. O design é sóbrio, profissional e minimalista, inspirado em produtos de alto nível como *Obsidian, Notion, Linear e Raycast*.

---

## 📷 Capturas de Tela

![App Screenshot 1](https://cdn.bkappi.com/ProjectsAssets/Flashcards/FlashCardsPrint1.png)
![App Screenshot 2](https://cdn.bkappi.com/ProjectsAssets/Flashcards/FlashCardsPrint2.png)

---

## 🚀 Demonstração Live
Acesse a aplicação em produção: [Flashcards.io Live App](https://flashcards.bkappi.com/)

---

## 🛠️ Stack Tecnológica

### Core Frontend & Componentes
- **Vite**: Bundler ultra-rápido para desenvolvimento frontend moderno.
- **React 18 & TypeScript**: Tipagem estática rigorosa para escalabilidade de código.
- **Tailwind CSS v4**: Novo motor CSS baseado em CSS Variables dinâmicas.
- **Framer Motion**: Microinterações discretas e transições suaves.
- **react-day-picker v10**: Calendário interativo de atividades e registros cognitivos.
- **Recharts**: Gráficos analíticos leves baseados em SVG.

### Gerenciamento de Estado e Armazenamento Local
- **Zustand**: Gerenciamento de estado global leve e de baixa fricção.
- **Dexie.js (IndexedDB)**: Banco de dados relacional offline local suportando volumes massivos de mídias e registros.
- **Zod**: Biblioteca de validação de schemas em tempo de execução para dados e backups.

---

## 📐 Arquitetura e Decisões Técnicas

A aplicação segue uma **Feature-Based Architecture**, agrupando o código por módulos de domínio para garantir responsabilidade única, desacoplamento e isolamento de efeitos colaterais.

### Principais Decisões:
1. **Zustand em vez de Redux**: Substituição da stack de Redux legada por Zustand, eliminando boilerplate desnecessário e otimizando a reatividade dos componentes.
2. **Dexie.js / IndexedDB**: Banco de dados relacional cliente-side para armazenamento estruturado de cards, deques, sessões e históricos, mitigando limites de capacidade do LocalStorage.
3. **Portabilidade Avançada**: Implementada com um pipeline desacoplado contendo validação de integridade por checksum SHA-256 e compactação/descompactação em tempo real (GZIP) via API `CompressionStream` nativa do navegador.
4. **Algoritmo SM-2**: Implementação matemática pura do SuperMemo-2, garantindo que o Fator de Facilidade (Ease Factor) e os intervalos de recall (1, 6, n*EF) sejam calculados com precisão.

---

## 🧠 Principais Recursos (Features)

### 1. Motor de Aprendizado Espaçado (SM-2)
- **Agendamento Científico**: Fatores de facilidade atualizados dinamicamente a cada sessão.
- **Estudo Antecipado**: Filtro automático inteligente para estudar cards antecipadamente se não houver revisões pendentes.

### 2. Dashboard Analítico & Gamificação Local
- **Streak Diário**: Contador de ofensivas ativas de estudo.
- **Estatísticas Detalhadas**: Calendário interativo para conferência de métricas de estudos anteriores por data.
- **Gráficos de XP**: Relatórios de performance de XP ganho acumulados por semana.

### 3. Portabilidade & Segurança (.fibf)
- **Formato Proprietário (.fibf)**: Arquivos de backup oficial compactados contendo metadados de integridade.
- **Exportações Alternativas**: Geração de arquivos em formatos JSON, CSV e Markdown (Obsidian/Notion).
- **Motor de Merge Inteligente**: Escolha de estratégias de importação (Mesclar, Substituir, Duplicar, Ignorar).
- **Snapshots Automáticos**: Pontos de restauração automáticos gerados localmente antes de qualquer importação para rollback em caso de falha.

### 4. Gestor de Decks e Cards Multi-Modo
- **Editor Completo**: Suporte a respostas em formato de texto e múltipla escolha.
- **Arrastar e Soltar**: Reordenação intuitiva de categorias.

---

## 🚀 Instalação e Execução Local

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Execute a suíte de testes unitários:
   ```bash
   npm run test
   ```

4. Construa a aplicação para produção:
   ```bash
   npm run build
   ```

---

## 📄 Créditos e Autores
- [@brunokappi](https://www.github.com/brunokappi) - Idealizador e desenvolvedor principal.
