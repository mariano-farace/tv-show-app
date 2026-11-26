<?php

use App\Http\Controllers\ShowController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/shows', [ShowController::class, 'search']);
Route::get('/shows/{id}', [ShowController::class, 'show'])->where('id', '[0-9]{1,9}');
