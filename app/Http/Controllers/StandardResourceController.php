<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Session;

class StandardResourceController extends Controller
{
    protected $request;
    protected $object;
    protected $id = false;

    // child class properties
    protected $model = ''; // e.g. 'App\Product'
    protected $fields = []; // field-name => validation-rule pairs
    protected $tableName = '';
    protected $objectName = ''; // how to refer to an instance

    public function index()
    {
        $resource = $this->model;
        return view('/stdResources/index', compact('resource'));
    }

    public function create()
    {
        $resource = $this->model;
        return view('/stdResources/create',  compact('resource'));
    }


    public function store(Request $request)
    {
        $this->request = $request;
        $this->processFormSubmission();
        if ($request->wantsJson()) {
            return $this->object;

        }
        return redirect($this->tableName);
    }

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

    public function destroy($id)
    {
        $this->id = $id;
        $this->destroyObject();
        return redirect($this->tableName);
    }

    /**
     * Handle form submissions for new and existing records
     */
    protected function processFormSubmission()
    {
        $this->setObject();
        $this->validate($this->request, $this->fields);;
        $this->setObjectData();
        $this->saveObject();
        $this->setSuccessMessage('save');
    }

    /**
     * Set the object property.
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
