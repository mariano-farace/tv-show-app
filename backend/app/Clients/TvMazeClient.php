<?php

namespace App\Clients;

use App\Clients\Exceptions\TvMazeException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

class TvMazeClient
{
    /**
     * Busca series por nombre y deja solo los campos que usamos.
     */
    public function searchShows(string $query): array
    {
        try {
            $response = Http::baseUrl(config('services.tvmaze.base_url'))
                ->timeout(10)
                ->get('/search/shows', ['q' => $query]);

            $response->throw();
        } catch (ConnectionException $e) {
            throw TvMazeException::unavailable($e);
        } catch (RequestException $e) {
            if ($e->response->status() === 429) {
                throw TvMazeException::rateLimited();
            }

            throw TvMazeException::unavailable($e);
        }

        $shows = [];

        foreach ($response->json() as $item) {
            $shows[] = $this->toSummary($item['show']);
        }

        return $shows;
    }

    /**
     * Pide una serie por id y devuelve el objeto completo de TVMaze.
     */
    public function getShow(int $id): array
    {
        try {
            $response = Http::baseUrl(config('services.tvmaze.base_url'))
                ->timeout(10)
                ->get("/shows/{$id}");

            $response->throw();
        } catch (ConnectionException $e) {
            throw TvMazeException::unavailable($e);
        } catch (RequestException $e) {
            throw match ($e->response->status()) {
                404 => TvMazeException::notFound(),
                429 => TvMazeException::rateLimited(),
                default => TvMazeException::unavailable($e),
            };
        }

        return $response->json();
    }

    /**
     * Deja del show solo los datos que necesita la card según el enunciado de la tarea.
     *
     * Conserva la forma original de image ({medium, original}) y rating ({average})
     * para que la búsqueda y el detalle devuelvan los mismos tipos.
     */
    private function toSummary(array $show): array
    {
        return [
            'id' => $show['id'],
            'name' => $show['name'],
            'image' => $show['image'] ?? null,
            'genres' => $show['genres'] ?? [],
            'rating' => ['average' => $show['rating']['average'] ?? null],
        ];
    }
}
