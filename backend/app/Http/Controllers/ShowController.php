<?php

namespace App\Http\Controllers;

use App\Clients\TvMazeClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShowController extends Controller
{
    public function __construct(private readonly TvMazeClient $client) {}

    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q');

        $request->merge([
            'q' => is_string($query) ? trim($query) : $query,
        ]);

        $validated = $request->validate([
            'q' => ['required', 'string', 'max:100'],
        ]);

        $shows = $this->client->searchShows($validated['q']);

        return response()->json(['data' => $shows]);
    }

    public function show(int $id): JsonResponse
    {
        $show = $this->client->getShow($id);

        return response()->json(['data' => $show]);
    }
}
