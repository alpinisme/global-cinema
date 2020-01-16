<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    public $timestamps = false;

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
