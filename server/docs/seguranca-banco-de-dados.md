# Segurança do banco de dados, autenticação e Storage

## 1. Arquitetura atual

Após a migração da issue #113, os serviços da Moveo Motors são:

| Responsabilidade | Serviço | Utilização |
| --- | --- | --- |
| Banco de dados da aplicação | Neon PostgreSQL | Veículos, referências e ordem de imagens, vendas e auditoria |
| Acesso ao banco | Prisma ORM no Express | Consultas e alterações das tabelas de negócio |
| Autenticação administrativa | Neon Auth | Login por código enviado por email (OTP) e sessão |
| Armazenamento de arquivos | Supabase Storage | Upload, exibição pública e exclusão das imagens |
| Frontend | Next.js | Catálogo, páginas administrativas e API intermediária |
| Backend | Express | Operações de negócio e integração com o Storage |

A aplicação **não usa mais Supabase Auth nem o PostgreSQL do Supabase para armazenar dados de negócio**. O pacote `@supabase/supabase-js` continua no **backend**, exclusivamente para operar o Supabase Storage.

O Supabase Storage possui seus próprios metadados internos no Supabase. Isso é parte do funcionamento do serviço de arquivos e não equivale a utilizar o banco antigo para as tabelas da aplicação.

## 2. Neon PostgreSQL e Prisma

### Conexões

- `server/src/services/prisma.ts` cria o Prisma Client usando `@prisma/adapter-pg` e `DATABASE_URL`.
- `server/prisma.config.ts` usa `DIRECT_URL` para comandos e migrations do Prisma.
- `server/prisma/schema.prisma` define `Veiculo`, `ImagemVeiculo`, `VendaDia` e `LogAuditoria`.
- O frontend consulta os veículos pela API do Express e não recebe credenciais de acesso ao PostgreSQL.

| Variável | Onde configurar | Finalidade |
| --- | --- | --- |
| `DATABASE_URL` | Backend Express | Conexão de execução com o Neon PostgreSQL |
| `DIRECT_URL` | Ambiente do Prisma CLI | Conexão direta para migrations |
| `NEON_AUTH_BASE_URL` | Next.js | Endpoint do Neon Auth |
| `NEON_AUTH_COOKIE_SECRET` | Next.js | Proteção dos cookies de sessão |

A `DIRECT_URL` não precisa ser disponibilizada ao frontend.

### Privilégios e roles

As roles `postgres`, `moveo_app`, `anon` e `authenticated` descritas na documentação anterior pertenciam à configuração antiga. **Não presumir que essas roles, nem seus privilégios, foram recriados no Neon.** Consultar as permissões reais no projeto Neon antes de documentá-las como verificadas.

Boas práticas: separar credenciais de execução e migração quando possível, aplicar o princípio do menor privilégio, não expor URLs de conexão em variáveis `NEXT_PUBLIC_*` e manter procedimentos de backup e restauração.

Verificações sem alteração de dados:

```powershell
cd server
npx prisma validate
npx prisma migrate status
```

Revisar migrations pendentes, ambiente-alvo e backup antes de executar `npx prisma migrate deploy`. **Nunca usar `prisma migrate reset` em um banco com dados que precisam ser preservados.**

## 3. Neon Auth e autorização administrativa

O fluxo administrativo funciona assim:

1. O usuário solicita um código OTP por email.
2. O Neon Auth valida o código e estabelece a sessão.
3. O servidor Next.js verifica a sessão e o email configurado em `ADMIN_EMAILS`.
4. Os layouts/páginas administrativas protegidos verificam a autorização antes de renderizar.
5. A API intermediária Next.js emite um JWT interno de curta duração para operações protegidas.
6. O middleware `exigirAdmin` do Express verifica o JWT e a permissão do email antes de executar a operação.

Arquivos relevantes:

- `client/src/lib/auth/client.ts`: cliente Neon Auth.
- `client/src/lib/auth/server.ts`: configuração de autenticação no servidor.
- `client/src/lib/auth/admin.ts`: sessão e autorização via `ADMIN_EMAILS`.
- `client/src/proxy.ts`: middleware de autenticação de páginas.
- `client/src/app/api/auth/[...path]/route.ts`: integração de rotas do Neon Auth.
- `client/src/app/api/admin/[...path]/route.ts`: API administrativa intermediária.
- `server/src/middlewares/exigirAdmin.ts`: proteção das rotas no Express.

### JWT interno

O JWT entre Next.js e Express utiliza HS256, expiração de **60 segundos**, emissor `moveo-motors-nextjs` e audiência `moveo-motors-express`. O segredo `INTERNAL_AUTH_SECRET` deve ter **32 bytes após decodificação Base64** e conter o **mesmo valor nos dois servidores de um mesmo ambiente**. Deve permanecer exclusivamente no servidor.

`ADMIN_EMAILS` precisa ser configurada tanto no Next.js quanto no Express. CORS não substitui autenticação. As consultas públicas de veículos permanecem abertas; cadastro, edição, marcação de venda, upload, auditoria e histórico administrativo de vendas requerem autorização.

**Limitação conhecida:** o JWT de 60 segundos não implementa uma duração máxima de sessão de 12 horas nem expiração por 30 minutos de inatividade. Esses controles dependem de uma implementação própria e podem ser acompanhados em outra issue.

## 4. Supabase Storage

### Bucket e arquivos

O bucket público `Imagens` permanece no Supabase e utiliza o prefixo `veiculos/`. As imagens são exibidas por suas URLs públicas; o backend Express faz upload, otimização com `sharp` e remoção. As URLs e a ordem das imagens são persistidas na tabela `ImagemVeiculo`, **no Neon**.

Os arquivos centrais são `server/src/services/supabase.ts` e `server/src/routes/rotas.ts`.

| Variável | Onde configurar | Uso |
| --- | --- | --- |
| `SUPABASE_URL` | Backend Express | Projeto Supabase do Storage |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend Express | Operações privilegiadas de Storage |

**Nunca expor `SUPABASE_SERVICE_ROLE_KEY` em código do cliente, repositório ou variável `NEXT_PUBLIC_*`.** O cliente Supabase usado pelo Express desativa persistência e atualização automática de sessões; ele **não realiza login de usuários**.

O domínio público de imagens usado por `next/image` e pela CSP não é uma credencial administrativa.

### Acesso público e policies

O bucket público permite a leitura das imagens, mas **não implica autorização de escrita anônima**. Na configuração anteriormente documentada, testes com a chave pública permitiram leitura e bloquearam upload e atualização anônimos. Uma tentativa de exclusão anônima retornou `data: []`, `error: null`, mas a imagem permaneceu armazenada. Esses resultados são históricos e devem ser revalidados caso as policies mudem.

Para consultar as policies atuais no SQL Editor do **projeto Supabase usado para Storage**:

```sql
select
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by policyname;
```

Não conceder `INSERT`, `UPDATE` ou `DELETE` a usuários públicos sem necessidade e análise de segurança. Operações administrativas passam pelo backend protegido por `exigirAdmin`.

## 5. Verificações de conclusão da migração

- [ ] Migrations esperadas aplicadas ao banco Neon correto.
- [ ] Consulta pública de veículos carrega dados do Neon.
- [ ] Login e logout funcionam pelo Neon Auth.
- [ ] Usuários fora de `ADMIN_EMAILS` não conseguem executar operações administrativas.
- [ ] Cadastro, edição e marcação de venda persistem corretamente no Neon.
- [ ] Auditoria e gráfico de vendas consultam os dados esperados.
- [ ] Upload, exibição e exclusão de imagens funcionam no Supabase Storage.
- [ ] Builds de frontend e backend passam sem erros.
- [ ] Credenciais estão restritas aos ambientes corretos.

Marcar somente as verificações efetivamente executadas e aprovadas.

## 6. Escopo e melhorias futuras

A **issue #113** trata da migração das tabelas e conexões da aplicação de Supabase PostgreSQL para **Neon PostgreSQL**. No mesmo trabalho, a autenticação antiga foi substituída pelo **Neon Auth**. O Supabase permanece apenas como **Storage de imagens**.

A possível mudança futura de infraestrutura para **Staycloud**, inclusive eventual revisão do fluxo de uploads, não faz parte da conclusão da issue #113. Controle de duração e inatividade de sessão e aprimoramentos na auditoria também podem ser acompanhados em issues específicas.