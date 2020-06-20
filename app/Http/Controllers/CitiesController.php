<?php

namespace App\Http\Controllers;

use App\City;
use Illuminate\Http\Request;

class CitiesController extends StandardResourceController
{

    /**
     *  Eloquent model to which the controller is providing access, e.g. 'App\Product' or Product::class
     */
    protected $model = City::class;
    
    /**
     * All writable columns in database, given as array of `field_name => validation_rule` pairs
     */
    protected $fields = [
        'name' => 'required|max:50',
        'country' => 'required|max:50',
        'lat' => 'nullable|regex:/^[0-9]{1,2}.[0-9]{4,6}$/',
        'lng' => 'nullable|regex:/^[0-9]{1,2}.[0-9]{4,6}$/',
        'zoom' => 'nullable|integer|between:1,30'
    ];

    /**
     * the database table name, usually plural, e.g., "products"
     */
    protected $tableName = 'cities';

    /**
     * how to refer to a singular instance, e.g., "product"
     */
    protected $objectName = 'city';

    /**
     * column name to order by when selecting all
     */
    protected $orderBy = 'name';
}
