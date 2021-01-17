<?php

namespace Tests\Unit;

use App\Helpers\FuzzySearch;
use PHPUnit\Framework\TestCase;

class FuzzySearchTest extends TestCase
{
    /** @test */
    public function fuzzy_search_orders_strings_by_similarity_from_most_to_least_similar()
    {
        $needle = 'Bravissimo';
        $haystack = ['Bravo', 'Bravisimo', 'Hello', 'Hi', 'Bravissimo'];
        $fuzzy = new FuzzySearch($needle, $haystack);
        $result = $fuzzy->sorted()->toArray();
        $this->assertEquals(['Bravissimo', 'Bravisimo', 'Bravo', 'Hello', 'Hi'], $result);
    }

    /** @test */
    public function fuzzy_search_works_on_nested_arrays_when_field_specified()
    {
        $needle = ['name' => 'Bravissimo'];
        $haystack = [['name' => 'Bravo'], ['name' => 'Bravisimo'], ['name' => 'Hello'], ['name' => 'Hi'], ['name' => 'Bravissimo']];

        $fuzzy = new FuzzySearch($needle, $haystack);
        $result = $fuzzy->byKey('name')->sorted()->toArray();
        $this->assertEquals([['name' => 'Bravissimo'], ['name' => 'Bravisimo'], ['name' => 'Bravo'], ['name' => 'Hello'], ['name' => 'Hi']], $result);
    }

    /** @test */
    public function fuzzy_search_works_on_nested_collections_when_field_specified()
    {
        $needle = ['name' => 'Bravissimo'];
        $haystack = [['name' => 'Bravo'], ['name' => 'Bravisimo'], ['name' => 'Hello'], ['name' => 'Hi'], ['name' => 'Bravissimo']];

        $fuzzy = new FuzzySearch($needle, $haystack);
        $result = $fuzzy->byKey('name')->sorted()->threshold(0.5)->toArray();
        $this->assertEquals([['name' => 'Bravissimo'], ['name' => 'Bravisimo'], ['name' => 'Bravo']], $result);
    }
}
