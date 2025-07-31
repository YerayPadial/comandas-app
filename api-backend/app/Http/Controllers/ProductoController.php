<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    // Listar productos
    public function index()
    {
        return Producto::orderBy('categoria')->orderBy('nombre')->get();
    }

    // Crear producto
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'categoria' => 'required|string|max:50',
            'precio' => 'required|numeric|min:0',
        ]);

        $producto = Producto::create($validated);

        return response()->json($producto, 201);
    }

    // Actualizar producto
    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'categoria' => 'required|string|max:50',
            'precio' => 'required|numeric|min:0',
        ]);

        $producto->update($validated);

        return response()->json($producto);
    }

    // Eliminar producto
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();

        return response()->json(['message' => 'Producto eliminado']);
    }
}