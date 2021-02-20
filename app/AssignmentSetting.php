<?php

namespace App;

use App\Http\Traits\Blameable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentSetting extends Model
{
    use HasFactory, Blameable;

    public static function currentSetting()
    {
        return static::latest()->first();
    }
}
