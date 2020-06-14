<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTheatersTableAddCity extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('theaters', function (Blueprint $table) {
            $table->unsignedBigInteger('city_id')->default(3);
            $table->foreign('city_id')->references('id')->on('cities');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('theaters', function (Blueprint $table) {
            $table->dropForeign('theaters_city_id_foreign');
            $table->dropColumn('city_id');
        });
    }
}
