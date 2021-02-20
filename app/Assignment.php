<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use App\AssignmentSetting;
use DateTime;
use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Assignment extends Model
{
    use HasFactory;

    const ASSIGNMENTS_PER_MONTH = 2;

    public $timestamps = false;

    public $guarded = ['id'];

    /**
     * find next date to assign
     * return formatted as ISO string yyyy-mm-dd
     */
    public static function nextDate()
    {
        $setting = AssignmentSetting::currentSetting();

        if (!$setting) {
            throw new Exception('Cannot set assignment date without assignment settings in database');
        }

        $assignmentCount = static::where('city_id', $setting->city_id)->after($setting->date)->count();
        $monthOffset = floor($assignmentCount / static::ASSIGNMENTS_PER_MONTH);

        $date = new DateTime($setting->date);
        $date->modify($monthOffset . ' Months');
        $dateString = $date->format('Y-m-d');

        return $dateString;
    }

    public function scopeAfter($query, $date)
    {
        return $query->where('date', '>=', $date);
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }
}
