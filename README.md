<p align="center">
  <img src="./client/public/Moveo-motors3.png" alt="Logo da Moveo Motors" width="500" />
</p>

<h1 align="center">Moveo Motors</h1>

<p align="center">
  Plataforma web para apresentação de veículos seminovos e gerenciamento do estoque da Moveo Motors.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?logo=express" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" />
</p>

> **Status:** projeto em evolução. Esta documentação descreve as funcionalidades implementadas na branch [`develop`](https://github.com/Marcenero/site-moveo-motors/tree/develop), que podem ainda não estar disponíveis na versão publicada em produção.

## Sobre o projeto

A **Moveo Motors** é uma aplicação web que reúne um site institucional, um catálogo de veículos e um painel administrativo para a equipe da loja. O objetivo é facilitar a busca de automóveis pelos visitantes e centralizar a gestão de anúncios, imagens e vendas.

O projeto é organizado como um monorepositório com frontend **Next.js** e backend **Express**, conectados a serviços gerenciados para banco de dados, autenticação e armazenamento de imagens.

## Tecnologias

| Camada | Tecnologias e serviços |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Node.js, Express 5, TypeScript, Zod |
| Persistência | Neon PostgreSQL, Prisma ORM 7 |
| Autenticação | Neon Auth com código OTP por e-mail |
| Imagens | Supabase Storage, Multer e Sharp |
| Monitoramento | Sentry e logs estruturados |
| Infraestrutura | Vercel para frontend e backend Express com implantação independente |
| Qualidade | ESLint, Prettier e Git/GitHub |

## Funcionalidades implementadas na `develop`

### Site público

- Página inicial com apresentação da loja e destaques do catálogo.
- Catálogo de veículos com pesquisa, filtros e ordenação.
- Páginas individuais com fotografias e informações detalhadas de cada veículo.
- Indicação de estoque em preparação quando não há veículos publicados.
- Páginas institucionais de **Sobre**, **Serviços**, **Privacidade** e **Termos**.
- Informações de contato e localização da loja, com integração de mapa.
- Interface responsiva para computador e dispositivos móveis.
- Recursos de SEO: metadados, Open Graph, sitemap, `robots.txt` e dados de páginas de veículos.

### Painel administrativo

- Autenticação por código temporário enviado por e-mail (OTP), utilizando Neon Auth.
- Restrição de acesso a endereços de e-mail autorizados.
- Visão geral com quantidade de veículos disponíveis e indicadores de vendas recentes.
- Cadastro e edição de veículos e suas características.
- Upload, remoção e reordenação de fotografias, com definição da imagem principal.
- Marcação de veículos como vendidos, removendo-os do estoque e registrando a venda.
- Consulta paginada ao histórico de auditoria de ações administrativas.

### Segurança e observabilidade

- Verificação de sessão e autorização nas páginas e rotas administrativas.
- Comunicação protegida entre Next.js e API Express para operações administrativas.
- Validação de entradas e imagens enviadas à API.
- Limitação de requisições e de uploads, além de cabeçalhos de segurança.
- Tratamento centralizado de erros, monitoramento com Sentry e registros de auditoria.

## Arquitetura

```text
Visitantes e administradores
            |
            v
   Next.js (frontend)
      |          |
      |          +--> Neon Auth (login OTP e sessões)
      |
      +--> API Express (backend)
                |          |
                |          +--> Supabase Storage (imagens)
                |
                +--> Prisma ORM --> Neon PostgreSQL
                                 (veículos, imagens,
                                  vendas e auditoria)
```

O **Neon PostgreSQL** armazena os dados de negócio. O **Supabase** permanece no projeto exclusivamente para o armazenamento dos arquivos de imagem; a autenticação administrativa utiliza **Neon Auth**.

Para detalhes sobre a separação de responsabilidades e os controles de acesso, consulte [`server/docs/seguranca-banco-de-dados.md`](https://github.com/Marcenero/site-moveo-motors/blob/develop/server/docs/seguranca-banco-de-dados.md) na branch `develop`.

## Estrutura do repositório

```text
site-moveo-motors/
├── client/                 # Next.js: site público, painel e rotas intermediárias
│   ├── src/app/            # Rotas e páginas
│   ├── src/components/     # Componentes de interface
│   └── src/lib/            # Autenticação, configuração e utilitários
├── server/                 # API Express
│   ├── prisma/             # Schema e migrations
│   ├── src/routes/         # Rotas da API
│   ├── src/middlewares/    # Controle de acesso
│   └── docs/               # Documentação técnica
└── package.json            # Scripts e workspaces npm
```

## Cookies e privacidade

O projeto oferece um mecanismo de **aceite ou rejeição de cookies opcionais**, com persistência da escolha do visitante e opção de revisar preferências.

Os scripts de **Google Analytics 4** e **Meta Pixel** estão previstos no código e só são carregados quando existe consentimento e seus respectivos identificadores estão configurados. Isso não significa que ambas as integrações já estejam ativas no ambiente de produção.

## Desenvolvimento e publicação

- **`develop`**: evolução e integração das funcionalidades.
- **`main`**: branch principal do repositório; a publicação em produção pode seguir um cronograma de releases distinto.
- Alterações devem passar por revisão e testes antes de serem promovidas para produção.

## Autores

- [@Marcenero](https://github.com/Marcenero)
- [@pedruxo](https://github.com/pedruxo)

## Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE).
