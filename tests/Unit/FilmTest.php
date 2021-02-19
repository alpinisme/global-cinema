<?php

namespace Tests\Unit;

use App\Film;
use App\Helpers\StringHelper;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FilmTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function film_model_allows_scoped_queries_to_alternate_spellings()
    {
        $films = factory(Film::class, 3)->create(['verified' => true]);
        $corruptedTitle = 'r' . $films[0]->title . 'xf';
        $helper = new StringHelper;
        $queryResults = Film::verifiedLike($helper->substrings($corruptedTitle), $films[0]->year);
        $this->assertTrue($queryResults->count() == 1);
    }
}
