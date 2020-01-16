<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class User extends Authenticatable
{
    use Notifiable;

    const ADMIN_TYPE = 'admin';
    const DEFAULT_TYPE = 'user';
    const ROLES = [
        'user', 'student', 'instructor', 'admin', 'super-admin'
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

    public function hasRole($role)
    {
        return $this->role === $role;
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
