<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Producto;

class ProductoSeeder extends Seeder
{
    public function run()
    {
        $productos = [
            // Alcohol
            ['nombre' => 'Cerveza', 'categoria' => 'Alcohol', 'precio' => 2.50],
            ['nombre' => 'Vino Tinto', 'categoria' => 'Alcohol', 'precio' => 3.00],
            ['nombre' => 'Vermú', 'categoria' => 'Alcohol', 'precio' => 2.80],
            // Bebidas
            ['nombre' => 'Refresco', 'categoria' => 'Bebidas', 'precio' => 1.80],
            ['nombre' => 'Agua Mineral', 'categoria' => 'Bebidas', 'precio' => 1.20],
            ['nombre' => 'Zumo de Naranja', 'categoria' => 'Bebidas', 'precio' => 2.00],
            // Hamburguesas
            ['nombre' => 'Hamburguesa Clásica', 'categoria' => 'Hamburguesas', 'precio' => 2.50],
            ['nombre' => 'Hamburguesa BBQ', 'categoria' => 'Hamburguesas', 'precio' => 3.00],
            ['nombre' => 'Hamburguesa Vegana', 'categoria' => 'Hamburguesas', 'precio' => 4.50],
            // Montaditos
            ['nombre' => 'Montadito de Lomo', 'categoria' => 'Montaditos', 'precio' => 2.20],
            ['nombre' => 'Montadito de Tortilla', 'categoria' => 'Montaditos', 'precio' => 2.00],
            ['nombre' => 'Montadito de Jamón', 'categoria' => 'Montaditos', 'precio' => 2.50],
            // Ensaladas
            ['nombre' => 'Ensalada César', 'categoria' => 'Ensaladas', 'precio' => 5.50],
            ['nombre' => 'Ensalada Mixta', 'categoria' => 'Ensaladas', 'precio' => 4.80],
            ['nombre' => 'Ensalada de Atún', 'categoria' => 'Ensaladas', 'precio' => 5.80],
            // Postres
            ['nombre' => 'Tarta de Queso', 'categoria' => 'Postres', 'precio' => 3.50],
            ['nombre' => 'Brownie', 'categoria' => 'Postres', 'precio' => 3.00],
            ['nombre' => 'Helado', 'categoria' => 'Postres', 'precio' => 2.50],
        ];

        foreach ($productos as $producto) {
            Producto::create($producto);
        }
    }
}
