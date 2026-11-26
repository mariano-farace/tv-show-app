<?php

namespace App\Clients\Exceptions;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Throwable;

class TvMazeException extends RuntimeException
{
    private function __construct(
        string $message,
        private readonly int $status,
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, 0, $previous);
    }

    public static function notFound(): self
    {
        return new self('Serie no encontrada.', 404);
    }

    public static function rateLimited(): self
    {
        return new self('TVMaze está limitando las peticiones. Inténtalo en unos segundos.', 429);
    }

    public static function unavailable(?Throwable $previous = null): self
    {
        return new self('No se pudo consultar TVMaze.', 502, $previous);
    }

    public function render(Request $request): ?JsonResponse
    {
        if (! $request->is('api/*')) {
            return null;
        }

        return response()->json([
            'message' => $this->getMessage(),
        ], $this->status);
    }

    public function report(): bool
    {
        // Los 404 y 429 son esperados; solo interesan las caídas de TVMaze.
        return $this->status !== 502;
    }
}
