# Segurança do banco e storage

## Banco de dados

### Roles

#### postgres

Utilizada apenas para migrations e administração.

* BYPASSRLS: sim
* CREATEDB: sim
* usada pela `DIRECT_URL`

#### moveo_app

Utilizada pela aplicação em runtime.

* LOGIN: sim
* SUPERUSER: não
* BYPASSRLS: não
* CREATEDB: não
* CREATEROLE: não

Permissões:

* SELECT
* INSERT
* UPDATE
* DELETE

Tabelas:

* `Veiculo`
* `ImagemVeiculo`
* `VendaDia`

### Acesso público ao banco

#### anon

* `Veiculo`: nenhum
* `ImagemVeiculo`: nenhum
* `VendaDia`: nenhum

#### authenticated

* `Veiculo`: nenhum
* `ImagemVeiculo`: nenhum
* `VendaDia`: nenhum

O catálogo público acessa os dados dos veículos exclusivamente através do backend.

---

## Supabase Storage

### Bucket `Imagens`

O bucket `Imagens` é utilizado para armazenar as imagens exibidas no catálogo de veículos.

Configuração atual:

* bucket público: sim (`public = true`)
* prefixo utilizado para imagens de veículos: `veiculos/`
* leitura pública das imagens: permitida
* operações de escrita por usuários públicos: não permitidas

O bucket é público para permitir que as imagens do catálogo sejam acessadas diretamente através de suas URLs públicas.

A configuração de bucket público não concede, por si só, permissão para upload, alteração ou remoção de arquivos.

### Policies de `storage.objects`

Foi realizada a consulta:

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

Resultado:

* nenhuma policy cadastrada em `storage.objects`

Com isso, usuários utilizando a chave pública (`anon`) não possuem permissão para realizar operações de escrita diretamente no Storage.

### Permissões públicas do Storage

| Operação                | Acesso público |
| ----------------------- | -------------- |
| Leitura por URL pública | Permitida      |
| INSERT                  | Bloqueado      |
| UPDATE                  | Bloqueado      |
| DELETE                  | Bloqueado      |

### Operações administrativas

Uploads, alterações e remoções de imagens devem ocorrer exclusivamente através do backend.

O backend utiliza a variável:

```text
SUPABASE_SERVICE_ROLE_KEY
```

A chave de `service_role` é utilizada apenas no servidor e não deve ser exposta ao frontend.

As rotas administrativas são protegidas pelo middleware `exigirAdmin` antes da execução das operações no Storage.

O upload de imagens utiliza o prefixo:

```text
veiculos/
```

### Validação das permissões

Foi realizado um teste utilizando apenas a `anon key`, sem passar pelo backend.

Resultados:

* leitura pública da imagem: permitida
* INSERT anônimo: bloqueado por RLS
* UPDATE anônimo: bloqueado por RLS
* DELETE anônimo: nenhum arquivo removido

Na tentativa de DELETE, o Supabase retornou:

```text
data: []
error: null
```

Apesar de não retornar erro explícito, uma verificação posterior utilizando o cliente administrativo confirmou que o arquivo continuava existindo.

Portanto, usuários públicos não conseguem realizar upload, substituir ou excluir arquivos do bucket `Imagens`.

As operações administrativas continuam disponíveis ao backend através da `SUPABASE_SERVICE_ROLE_KEY`.
