<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Session;

/**
 * A generic controller for handling CRUD operations
 * on resources. Child controllers may override specific
 * methods as needed.
 */
class StandardResourceController extends Controller
{
    protected $request;
    protected $object;
    protected $id = false;

    /** The following protected properties are to be used here but declared in child class  */

    /**
     *  Eloquent model to which the controller is providing access, e.g. 'App\Product' or Product::class
     */
    protected $model = '';
    
    /**
     * All writable columns in database, given as array of `field_name => validation_rule` pairs
     */
    protected $fields = [];

    /**
     * the database table name, usually plural, e.g., "products"
     */
    protected $tableName = '';

    /**
     * how to refer to a singular instance, e.g., "product"
     */
    protected $objectName = '';

    /**
     * column name to order by when selecting all
     */
    protected $orderBy = '';

    /**
     * Handle GET requests for all instances
     * returning JSON or HTML, as needed
     */
    public function index(Request $request)
    {
        if ($request->wantsJson()) {
            return $this->orderBy ? $this->model::orderBy($this->orderBy)->get() : $this->model::all();
        }
        $resource = $this->model;
        return view('/stdResources/index', compact('resource'));
    }


    /**
     * Handle GET requests for form that, when POSTed, creates new row to DB
     */
    public function create()
    {
        $resource = $this->model;
        return view('/stdResources/create', compact('resource'));
    }


    /**
     * Handle POST requests to create new row in DB
     * returning JSON or HTML, as needed
     */
    public function store(Request $request)
    {
        $this->request = $request;
        $this->processFormSubmission();
        if ($request->wantsJson()) {
            return $this->object;
        }
        return redirect($this->tableName);
    }

    /**
     * Handle PUT/PATCH requests to update existing row in DB
     * returning JSON representation of result with id
     * or HTML, as needed
     */
    public function update(Request $request, $id)
    {
        $this->request = $request;
        $this->id = $id;
        $this->processFormSubmission();
        if ($request->wantsJson()) {
            return $this->object;
        }
        return redirect($this->tableName . '/' . $this->id);
    }

    /**
     * Handle DELETE requests to destroy existing row in DB
     * returning JSON success message
     * or redirecting to index, as neeeded
     */
    public function destroy(Request $request, $id)
    {
        $this->id = $id;
        $this->destroyObject();
        if ($request->wantsJson()) {
            return ['status' => 'success'];
        }
        return redirect($this->tableName);
    }

    /**
     * Handle form submissions for new and existing records
     */
    protected function processFormSubmission()
    {
        $this->setObject();
        $this->validate($this->request, $this->fields);
        $this->setObjectData();
        $this->saveObject();
        $this->setSuccessMessage('save');
    }

    /**
     * Set the `object` attribute of this instance.
     * If there's no id, create a new object of the appropriate type,
     * otherwise instantiate the object to correspond to the object id.
     */
    protected function setObject()
    {
        $model = $this->model;
        if ($this->id === false) {
            $this->object = new $model;
        } else {
            $this->object = $model::find($this->id);
        }
    }

    /**
     * Handle destroy actions
     */
    protected function destroyObject()
    {
        $this->setObject();
        $this->deleteObject();
        $this->setSuccessMessage('destroy');
    }

    /**
     * Cycle through the form fields and set them in the object.
     */
    protected function setObjectData()
    {
        foreach ($this->fields as $field => $rules) {
            $this->object->$field = $this->request->$field;
        }
    }

    /**
     * Save the object to the database
     */
    protected function saveObject()
    {
        $this->object->save();
    }

    /**
     * Delete the object from the database
     */
    protected function deleteObject()
    {
        $this->object->delete();
    }

    /**
     * Set a success message in the session
     */
    protected function setSuccessMessage($messageType)
    {
        $messages = array(
            'save' => 'The ' . $this->objectName . ' was successfully saved.',
            'destroy' => 'The ' . $this->objectName . ' was successfully deleted.'
        );
        Session::flash('success', $messages[$messageType]);
    }
}
