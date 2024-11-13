<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

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
            if (!empty($minPrice) && !empty($maxPrice)) {
                $filteredProducts = $filteredProducts->filter(function ($product) use ($minPrice, $maxPrice) {
                    return $product['price'] >= $minPrice && $product['price'] <= $maxPrice;
                });
            }
        }


        if ($request->has('category')) {
            $category = strtolower($request->input('category'));
            if (!empty($category)) {
                $filteredProducts = $filteredProducts->filter(function ($product) use ($category) {
                    return strtolower($product['category']) === $category;
                });
            }
        }

        $perPage = $request->input('per_page', 10);
        $currentPage = $request->input('page', 1);
        $currentItems = $filteredProducts->slice(($currentPage - 1) * $perPage, $perPage)->values();
        $paginatedProducts = new LengthAwarePaginator(
            $currentItems,
            $filteredProducts->count(),
            $perPage,
            $currentPage,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return response()->json($paginatedProducts);
    }
}
