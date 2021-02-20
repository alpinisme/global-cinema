<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterFilmsTableAndScreeningsTableRenameCreatedByColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('films', function (Blueprint $table) {
            $table->renameColumn('createdBy', 'created_by');
        });

        Schema::table('screenings', function (Blueprint $table) {
            $table->renameColumn('createdBy', 'created_by');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('films', function (Blueprint $table) {
            $table->renameColumn('created_by', 'createdBy');
        });

        Schema::table('screenings', function (Blueprint $table) {
            $table->renameColumn('created_by', 'createdBY');
        });
    }
}
