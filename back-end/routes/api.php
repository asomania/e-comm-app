<?php


use App\Http\Controllers\ProductController;

Route::get('/products', [ProductController::class, 'getProducts']);
Route::get('products/{id}', [ProductController::class, 'getProductById']);

