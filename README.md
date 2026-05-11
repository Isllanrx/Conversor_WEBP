# Conversor de Imagens para WEBP

Aplicacao de alto desempenho para conversao de imagens para o formato WebP, operando inteiramente no lado do cliente (navegador). O projeto foi reestruturado de um script legado para uma arquitetura modular moderna utilizando TypeScript e Vite.

## Arquitetura do Sistema

A aplicacao segue os principios de separacao de responsabilidades (SoC) e SOLID, dividida em camadas logicas:

```mermaid
graph TD
    subgraph Camada_de_Interface [Interface do Usuario]
        Events[events.ts] --> DOM[dom.ts]
    end

    subgraph Camada_de_Processamento [Nucleo de Conversao]
        Converter[converter.ts]
    end

    subgraph Camada_de_Servicos [Servicos de Suporte]
        ZipService[zip-service.ts]
    end

    Events --> Converter
    Events --> ZipService
    Converter --> DOM
```

### Componentes Principais

- **Interface do Usuario (UI)**: Gerencia o estado da interface, eventos de interacao e atualizacoes de progresso em tempo real.
- **Nucleo de Conversao (Core)**: Contem a logica de processamento de imagem utilizando a API de Canvas do navegador para transformacao em WebP.
- **Servicos de Suporte (Services)**: Gerencia a compactacao de arquivos utilizando a biblioteca JSZip e o fluxo de geracao do download.

## Funcionalidades

- Conversao em lote de ate 50 imagens simultaneas.
- Controle dinamico de qualidade de compressao (1-100%).
- Gerenciamento eficiente de memoria com revogacao de Object URLs (preencao de memory leaks).
- Interface responsiva e otimizada para diferentes resolucoes.
- Download unico em formato ZIP compactado.

## Requisitos de Desenvolvimento

- Node.js (v18 ou superior)
- NPM ou Yarn

## Instrucoes de Uso

1. **Instalacao de Dependencias**:
   ```bash
   npm install
   ```

2. **Ambiente de Desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Geracao do Build de Producao**:
   ```bash
   npm run build
   ```

4. **Verificacao de Qualidade (Linting)**:
   ```bash
   npm run lint
   ```

## Deploy

Esta aplicacao esta otimizada para deploy na **Vercel**. Ao conectar o repositorio, a plataforma detectara automaticamente a configuracao do Vite.

- **Comando de Build**: `npm run build`
- **Diretorio de Saida**: `dist`

## Licenca

Este projeto esta sob a licenca MIT.
