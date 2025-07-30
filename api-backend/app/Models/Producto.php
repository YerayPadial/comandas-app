<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'categoria', 'precio'];

    // Un producto puede estar en muchos detalles de comanda
    public function detalles()
    {
        return $this->hasMany(DetalleComanda::class);
    }

    // Relación a comandas a través de detalles
    public function comandas()
    {
        return $this->belongsToMany(Comanda::class, 'detalle_comandas')
            ->withPivot('cantidad')
            ->withTimestamps();
    }
}
