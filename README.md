# Pokédex

Aplicativo em React Native com Expo para pesquisar Pokémon pelo nome ou número e consultar informações básicas.

## Funcionalidades

- Pesquisa por nome ou número da Pokédex.
- Sugestões de busca com até 10 resultados.
- Exibição do número, imagem, tipos, altura e peso do Pokémon selecionado.
- Dados obtidos pela [PokéAPI](https://pokeapi.co/).

## Requisitos

- Node.js e npm.
- Expo Go no celular para testar no dispositivo, ou um emulador Android/iOS.

## Como executar

Instale as dependências:

```bash
npm install
```

Inicie o Expo:

```bash
npm run start
```

Escaneie o QR code com o Expo Go ou use os atalhos exibidos no terminal. Também é possível iniciar diretamente com:

```bash
npm run android
npm run ios
npm run web
```

No Windows PowerShell, se a política de execução bloquear `npm.ps1`, use `npm.cmd install` e `npm.cmd run start`.

## API

A aplicação consulta a [PokéAPI](https://pokeapi.co/api/v2/), portanto é necessária uma conexão com a internet para carregar a lista e os detalhes dos Pokémon.
