<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleComanda extends Model
{
    use HasFactory;

    protected $fillable = ['comanda_id', 'producto_id', 'cantidad'];

    public function comanda()
    {
        return $this->belongsTo(Comanda::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}
