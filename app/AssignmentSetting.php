<?php

namespace App;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentSetting extends Model
{
    use HasFactory;

    public static function currentSetting()
    {
        return static::latest()->first();
    }
}
