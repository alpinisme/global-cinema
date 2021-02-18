<?php

namespace Tests\Unit;

use App\Exceptions\InvalidCsvException;
use App\Helpers\CsvReader;
use PHPUnit\Framework\TestCase;

class CsvReaderTest extends TestCase
{
    /** test */
    public function it_can_parse_a_csv_with_headers()
    {
        $reader = new CsvReader;
        $csv = $reader->read(dirname(__FILE__) . '/../test-data/theaters.csv')->toArray();
        $this->assertEquals('68th Street Playhouse', $csv[0]['theater']);
    }

    /** @test */
    public function it_throws_an_exception_if_nonexistent_file_supplied()
    {
        $this->expectException(InvalidCsvException::class);
        $reader = new CsvReader;
        $reader->read(dirname(__FILE__) . '/nonexistentfile')->toArray();
    }

    /** @test */
    public function it_trims_and_converts_headers_to_lowercase()
    {
        $reader = new CsvReader;
        $csv = $reader->read(dirname(__FILE__) . '/../test-data/theaters.csv')->toArray();
        $this->assertTrue(array_key_exists('address', $csv[0]));
    }

    /** @test */
    public function it_throws_an_exception_if_required_field_missing()
    {
        $this->expectException(InvalidCsvException::class);
        $reader = new CsvReader;
        $reader->read(dirname(__FILE__) . '/../test-data/theaters.csv')->require(['missing field']);
    }

    /** @test */
    public function it_ignores_fields_not_allowed()
    {
        $reader = new CsvReader;
        $csv = $reader->read(dirname(__FILE__) . '/../test-data/theaters.csv')->only(['theater', 'capacity'])->toArray();
        $this->assertFalse(array_key_exists('address', $csv[0]));
    }

    /** @test */
    public function it_allows_you_to_map_over_rows_with_given_callback()
    {
        $phrase = 'testing testing testing';
        $cb = function ($row) use ($phrase) { return $phrase; };
        $reader = new CsvReader;
        $csv = $reader->read(dirname(__FILE__) . '/../test-data/theaters.csv')->map($cb)->toArray();
        $this->assertEquals($phrase, $csv[0]);
    }
}
