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
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
        
            if (!empty($startDate) && !empty($endDate) && $startDate !== 'null' && $endDate !== 'null') {
                try {
                    $startDate = preg_replace('/\s\(.*\)$/', '', $startDate);
                    $endDate = preg_replace('/\s\(.*\)$/', '', $endDate);
        
                    $startDate = new \DateTime($startDate);
                    $endDate = new \DateTime($endDate);
        
                    $filteredProducts = $filteredProducts->filter(function ($product) use ($startDate, $endDate) {
                        $productDate = new \DateTime($product['meta']['createdAt']);
                        return $productDate >= $startDate && $productDate <= $endDate;
                    });
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Invalid date format'], 400);
                }
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
        if ($request->has('name')) {
            $name = strtolower($request->input('name'));
            if (!empty($name)) {
                $filteredProducts = $filteredProducts->filter(function ($product) use ($name) {
                    return isset($product['title']) && strpos(strtolower($product['title']), $name) !== false;
                });
            }
        }
        
        
        $perPage = $request->input('per_page', 10);
        $currentPage = $request->input('page');
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
    public function getProductById($id)
    {
        $client = new Client();
        $response = $client->get('https://dummyjson.com/products?limit=200');
        $products = json_decode($response->getBody(), true)['products'];

        $filteredProducts = collect($products)->firstWhere('id', $id);

        if (!$filteredProducts) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($filteredProducts);
    }

    
}
