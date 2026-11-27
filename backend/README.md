# Backend

API REST en Laravel para buscar series y consultar su detalle usando TVMaze.

## Requisitos

- PHP 8.3 o superior
- Composer 2

## Ejecución

```bash
cp .env.example .env
composer install
php artisan serve
```

El servidor arranca en `http://localhost:8001` (puerto configurable con
`SERVER_PORT`).

Las decisiones técnicas están en el [README principal](../README.md).
