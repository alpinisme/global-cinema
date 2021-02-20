<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterFilmsTableAndTheaterTableAndScreeningsTableAddRawColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('films', function (Blueprint $table) {
            $table->text('raw')->nullable();
        });

        Schema::table('theaters', function (Blueprint $table) {
            $table->text('raw')->nullable();
        });

        Schema::table('screenings', function (Blueprint $table) {
            $table->text('raw')->nullable();
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
            $table->dropColumn('raw');
        });

        Schema::table('theaters', function (Blueprint $table) {
            $table->dropColumn('raw');
        });

        Schema::table('screenings', function (Blueprint $table) {
            $table->dropColumn('raw');
        });
    }
}
