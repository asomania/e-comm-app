<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class ProductController extends Controller
{
    public function getProducts(Request $request)
    {
        $client = new Client();
        $response = $client->get('https://dummyjson.com/products?limit=200');
        $products = json_decode($response->getBody(), true)['products'];

        $filteredProducts = collect($products);

        if ($request->has('min_price') && $request->has('max_price')) {
            $minPrice = $request->input('min_price');
            $maxPrice = $request->input('max_price');
            $filteredProducts = $filteredProducts->filter(function ($product) use ($minPrice, $maxPrice) {
                return $product['price'] >= $minPrice && $product['price'] <= $maxPrice;
            });
        }

        if ($request->has('name')) {
            $name = strtolower($request->input('name'));
            $filteredProducts = $filteredProducts->filter(function ($product) use ($name) {
                return str_contains(strtolower($product['title']), $name);
            });
        }

        if ($request->has('category')) {
            $category = strtolower($request->input('category'));
            $filteredProducts = $filteredProducts->filter(function ($product) use ($category) {
                return strtolower($product['category']) === $category;
            });
        }

         return response()->json($filteredProducts->values()->all());
    }
}
