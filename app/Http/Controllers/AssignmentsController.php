<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;

class AssignmentsController extends StandardResourceController
{

    /**
     *  Eloquent model to which the controller is providing access, e.g. 'App\Product' or Product::class
     */
    protected $model = 'App\Assignment';
    
    /**
     * All writable columns in database, given as array of `field_name => validation_rule` pairs
     */
    protected $fields = [];

    /**
     * the database table name, usually plural, e.g., "products"
     */
    protected $tableName = 'assignments';

    /**
     * how to refer to a singular instance, e.g., "product"
     */
    protected $objectName = 'assignment';

    /**
     * column name to order by when selecting all
     */
    protected $orderBy = '';

    public function getAssignedCity()
    {
        $query= DB::select("Select column_default from information_schema.columns where table_name='theaters' and column_name='city_id'");
        return $query[0]->column_default;
    }

    public function setAssignedCitys(Request $request)
    {
        // get value from request, make sure it is a valid city; if not, return error; if yes, execute query
        $query = DB::table("alter table theaters alter city_id set default ?", []);
    }
}
