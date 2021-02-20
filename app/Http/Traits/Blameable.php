<?php

namespace App\Http\Traits;

use Illuminate\Database\Eloquent\Model;

trait Blameable
{
    protected static function boot()
    {
        parent::boot();

        static::creating(function (Model $model) {
            // this check is to ensure that ScreeningFactory can create Screenings without a problem
            if (!$model->created_by) {
                $model->created_by = auth()->id();
            }
        });
    }
}
