<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ComandaController;
use App\Http\Controllers\ProductoController;

Route::get('/ping', fn() => response()->json(['pong' => true]));
Route::apiResource('comandas', ComandaController::class)->only(['index', 'store', 'update']);
Route::apiResource('productos', ProductoController::class)->except(['show']);
