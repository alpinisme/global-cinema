<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;
use DateTime;

class Assignment extends Model
{
    const START_YEAR = '1952'; // earliest year to be assigned

    public $timestamps = false;
    public $guarded = ['id'];

    /**
     * find next date to assign
     * return formatted as ISO string yyyy-mm-dd
     */
    public static function nextDate()
    {
        $assignmentsPerMonth = 2;
        $count = self::count();
        $monthOffset = floor($count/$assignmentsPerMonth);

        $date = new DateTime;
        $date->setDate(self::START_YEAR, 1, 1);
        $date->modify($monthOffset . ' Months');
        $dateString = $date->format('Y-m-d');
        
        return $dateString;
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
