# Segurança do banco

## Roles

### postgres
Utilizada apenas para migrations e administração.

- BYPASSRLS: sim
- CREATEDB: sim
- usada pela DIRECT_URL

### moveo_app
Utilizada pela aplicação em runtime.

- LOGIN: sim
- SUPERUSER: não
- BYPASSRLS: não
- CREATEDB: não
- CREATEROLE: não

Permissões:
- SELECT
- INSERT
- UPDATE
- DELETE

Tabelas:
- Veiculo
- ImagemVeiculo
- VendaDia

## Acesso público

anon:
- Veiculo: nenhum
- ImagemVeiculo: nenhum
- VendaDia: nenhum

authenticated:
- Veiculo: nenhum
- ImagemVeiculo: nenhum
- VendaDia: nenhum

O catálogo público acessa os veículos exclusivamente através do backend.