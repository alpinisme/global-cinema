<?php

namespace App\Http\Controllers;

use App\AssignmentSetting;
use App\Http\Requests\AssignmentSettingRequest;

class AssignmentSettingController extends Controller
{
    public function show()
    {
        return AssignmentSetting::latest()->first();
    }

    public function create(AssignmentSettingRequest $request)
    {
        $setting = new AssignmentSetting($request->validated());
        $setting->created_by = auth()->id();
        $setting->save();
    }
}
