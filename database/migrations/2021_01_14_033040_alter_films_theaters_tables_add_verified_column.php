<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterFilmsTheatersTablesAddVerifiedColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('films', function (Blueprint $table) {
            $table->boolean('verified')->nullable();
        });

        Schema::table('theaters', function (Blueprint $table) {
            $table->boolean('verified')->nullable();
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
            $table->dropColumn('verified');
        });

        Schema::table('theaters', function (Blueprint $table) {
            $table->dropColumn('verified');
        });
    }
}
