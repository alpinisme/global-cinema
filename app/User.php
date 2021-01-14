<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    const ADMIN_TYPE = 'admin';

    const DEFAULT_TYPE = 'student';

    const ROLES = [
        'user',
        'student',
        'instructor',
        'admin',
        'unconfirmed_contributor',
        'unconfirmed_instructor',
        'contributor',
    ];

    const REGISTERABLE_ROLES = [
        'unconfirmed_contributor',
        'unconfirmed_instructor',
        'student',
    ];

    protected $fillable = [
        'name', 'email', 'password', 'role',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function students()
    {
        return $this->hasManyThrough(User::class, Assignment::class, 'instructor_id', 'id', 'id', 'student_id');
    }

    public function instructor()
    {
        return $this->hasOneThrough(User::class, Assignment::class, 'student_id', 'id', 'id', 'instructor_id');
    }

    public function assignment()
    {
        return $this->hasOne(Assignment::class, 'student_id');
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'instructor_id');
    }

    public function screenings()
    {
        return $this->hasMany(Screening::class, 'createdBy');
    }

    public function datesCompleted()
    {
        $screenings = $this->screenings;
        $dates = [];

        foreach ($screenings as $screening) {
            if (in_array($screening->date, $dates)) {
                continue;
            }
            $dates[] = $screening->date;
        }

        return $dates;
    }

    /**
     * Checks actual role against argument, used when iterating over
     * all roles. For checking specific roles, use isStudent, etc.
     *
     * @param string $role
     */
    public function hasRole($role)
    {
        return $this->role === $role;
    }

    public function isStudent()
    {
        return $this->hasRole('student');
    }

    public function isAdmin()
    {
        return $this->hasRole('admin');
    }

    public function isInstructor()
    {
        return $this->hasRole('instructor');
    }

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
