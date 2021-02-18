<?php

namespace Tests\Unit;

use App\Helpers\CsvReader;
use PHPUnit\Framework\TestCase;

class CsvReaderTest extends TestCase
{
    /** @test */
    public function it_can_parse_a_csv_with_headers()
    {
        $reader = new CsvReader;
        $csv = $reader->read(dirname(__FILE__) . '/../test-data/theaters.csv')->toArray();
        $this->assertEquals('68th Street Playhouse', $csv[0]['theater']);
    }
}
