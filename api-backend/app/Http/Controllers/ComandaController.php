<?php

namespace App\Http\Controllers;

use App\Models\Comanda;
use App\Models\DetalleComanda;
use Illuminate\Http\Request;

class ComandaController extends Controller
{
    // Listar comandas
    public function index()
    {
        // Devuelve todas las comandas con sus productos y detalles.
        return Comanda::with(['detalles.producto'])->orderBy('created_at', 'desc')->get();
    }

    // Crear nueva comanda
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_mesa' => 'required|string|max:100',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
        ]);

        $comanda = Comanda::create([
            'nombre_mesa' => $validated['nombre_mesa'],
            'estado' => 'pendiente', // Estado inicial
        ]);

        foreach ($validated['productos'] as $item) {
            DetalleComanda::create([
                'comanda_id' => $comanda->id,
                'producto_id' => $item['producto_id'],
                'cantidad' => $item['cantidad'],
            ]);
        }

        return response()->json($comanda->load('detalles.producto'), 201);
    }

    // Actualizar estado de la comanda (por ejemplo, marcar como terminada, cobrada, etc.)
    public function update(Request $request, $id)
    {
        $comanda = Comanda::findOrFail($id);

        $validated = $request->validate([
            'estado' => 'required|in:pendiente,en_cocina,lista,cobrada',
        ]);

        $comanda->estado = $validated['estado'];
        $comanda->save();

        return response()->json($comanda->load('detalles.producto'));
    }
}