<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateScreeningsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('screenings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->date('date')->index();
            $table->unsignedInteger('theater_id');
            $table->unsignedInteger('film_id');
            $table->timestamps();

            $table->foreign('theater_id')
                ->references('id')->on('theaters')
                ->onDelete('restrict');

            $table->foreign('film_id')
                ->references('id')->on('films')
                ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('screenings');
    }
}
