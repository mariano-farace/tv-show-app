# Buscador de series

Aplicación web para buscar series y consultar su detalle usando la API pública
de [TVMaze](https://www.tvmaze.com/api). Backend en Laravel y frontend en React.

## Requisitos

- PHP 8.3 o superior
- Composer 2
- Node.js 20.19+ o 22.12+ (con npm)

## Instrucciones de ejecución

### Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan serve
```

El servidor arranca en `http://localhost:8001` (puerto configurable con
`SERVER_PORT`).

### Frontend

En otra terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Estructura

```
backend/    API REST en Laravel
frontend/   Aplicación React con Vite
```

## Decisiones técnicas

### General

Un único repositorio con dos proyectos: Laravel como API REST y React como SPA.

Las respuestas siguen siempre esta forma: las correctas llevan
`{"data": ...}` y las de error `{"message": "..."}`. El frontend lee `data` para
los datos y, ante un error, muestra el mensaje de la API o uno genérico.

### Backend

Las rutas de la API están en `routes/api.php` y se registran en
`bootstrap/app.php`. El esqueleto de Laravel ya no incluye ese archivo, así que
se creó a mano. Se evitó `install:api` porque además instala Sanctum, que aquí
no hace falta.

El controlador `ShowController` tiene dos métodos, uno para la búsqueda general y otro
para el detalle: recibe la petición, valida la entrada y devuelve el JSON.

Toda la comunicación con TVMaze está en `app/Clients/TvMazeClient.php`. Se optó
por crear una carpeta `Clients` para integraciones externas. `Services` se
reserva para lógica de negocio, que aquí no hay. El cliente monta la petición,
aplica el timeout y traduce los errores.

La búsqueda general devuelve solo lo que utiliza la card en el frontend (`id`, `name`, `image`,
`genres`, `rating`), para no mandar datos que no se usan. El detalle devuelve
el objeto completo porque la ficha lo muestra. No hay paginación porque TVMaze
no la ofrece.

Los errores de TVMaze se convierten en `TvMazeException`, una única clase con
tres métodos estáticos: `notFound()` (404), `rateLimited()` (429) y `unavailable()`
(502). Convierte los fallos de TVMaze en errores propios, solo los que tienen
significado para el usuario (la serie no existe, hay que esperar, el proveedor
está caído). Así el frontend muestra esos mensajes y uno genérico para el resto. Se
prefirió una sola clase porque los tres casos solo cambian
mensaje y código.

La entrada se valida antes de consultar TVMaze. En la búsqueda, el término
(`q`) es obligatorio, de tipo texto y de 100 caracteres como máximo. Se aplica
`trim` antes de validar, así que una petición de solo espacios se rechaza con
`422`.
En el detalle, el `id` solo admite dígitos y cualquier otra cosa devuelve
`404`.

### Frontend

La aplicación está montada con Vite y TypeScript. Vite se eligió como
herramienta de build por ser el estándar actual para React y necesitar
configuración mínima. TypeScript se eligió por el tipado estático.

El código está organizado por capas: `api/` para las llamadas al backend,
`types/` para los tipos compartidos, `pages/` para las dos pantallas (búsqueda y
detalle), `components/` para piezas reutilizables (la tarjeta) y `store/` para
el estado compartido. Se eligió esta estructura y
no una por funcionalidad porque el proyecto es pequeño.

Se utiliza React Router para navegar entre la pantalla de búsqueda y la de
detalle (`/` y `/shows/:id`), cada una con su propia URL; así funcionan el botón
atrás y la recarga en el detalle.

Para que los resultados de la búsqueda de series sigan disponibles al entrar en
el detalle de una serie y volver atrás, el estado se guarda en un store
(Zustand). Frente a guardar el
estado en `App`, evita pasar props; frente a Redux, ofrece simplicidad (no añade
acciones, reducers ni Provider).

Todas las llamadas al backend pasan por `api/client.ts`: un único sitio para la
URL, el `fetch` y el tratamiento de errores, de modo que los componentes solo
reciben datos o un mensaje listo para mostrar. Se usa `fetch` en vez de Axios
porque solo hay dos peticiones. La URL se toma de `VITE_API_URL`, con
`http://localhost:8001/api` por defecto.


Se utiliza Tailwind por simplicidad: los estilos van en el propio JSX, sin
archivos CSS ni nombres de clases que mantener.

Las pantallas cubren carga, error y sin resultados con un único estado que toma
distintos valores (`idle | loading | error | success`).
Se decidió que la búsqueda se ejecutara al enviar el formulario, no al escribir:
con `debounce` se harían varias peticiones por palabra y TVMaze limita a 20
cada 10 segundos.

En la búsqueda se aplica `trim` al término antes de enviarlo y no se busca si
queda vacío. El input limita a 100 caracteres. Los errores se muestran en rojo
con el mensaje de la API cuando el código es `404`, `429` o `502`, y con un
texto genérico en el resto. En el detalle, un id no numérico se rechaza antes de
hacer la solicitud.
