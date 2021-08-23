<?php

namespace Database\Seeders;

use App\AssignmentSetting;
use Illuminate\Database\Seeder;

class AssignmentSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        AssignmentSetting::factory()->create();
    }
}
