<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comanda extends Model
{
    use HasFactory;

    protected $fillable = ['nombre_mesa', 'estado'];

    // Una comanda tiene muchos detalles
    public function detalles()
    {
        return $this->hasMany(DetalleComanda::class);
    }

    // Relación a productos a través de detalles
    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'detalle_comandas')
            ->withPivot('cantidad')
            ->withTimestamps();
    }
}
