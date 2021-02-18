<?php

namespace App\Helpers;

use App\Exceptions\InvalidCsvException;

class CsvReader
{
    /** @var resource */
    protected $handle;

    /** @var string[] */
    protected $fields;

    /** @var array */
    protected $rows;

    /**
     * Reads and parses a csv file with headers
     *
     * @param mixed $file
     * @param string[] $requiredFields
     * @return $this
     */
    public function read($file, $requiredFields = [])
    {
        $this->open($file);
        $this->readHeader($requiredFields);
        $this->readBody();

        return $this;
    }

    /**
     * Asserts that the csv must contain the specified header fields. Throws exception if not.
     *
     * @param string[] $requiredFields
     * @return $this
     * @throws InvalidCsvException
     */
    public function require($requiredFields)
    {
        $missing = array_diff($requiredFields, $this->fields);

        if (!empty($missing)) {
            throw new InvalidCsvException('File missing required header field(s): ' . implode(', ', $missing));
        }

        return $this;
    }

    /**
     * Filters out all fields from the csv except the specified `$desiredFields`
     *
     * @param string[] $requiredFields
     * @return $this
     */
    public function only($desiredFields)
    {
        $extras = array_diff($this->fields, $desiredFields);

        $this->each(function ($item) use ($extras) {
            foreach ($extras as $extra) {
                unset($item[$extra]);
            }

            return $item;
        });

        return $this;
    }

    /**
     * Performs the specified operation on each row of the csv
     *
     * @param callable $callback
     * @return $this
     */
    public function each($callback)
    {
        $this->rows = array_map($callback, $this->rows);

        return $this;
    }

    /**
     * Returns the finalized data as an array of rows
     *
     * @return array
     */
    public function toArray()
    {
        return $this->rows;
    }

    /**
     * Opens the given file
     *
     * @throws InvalidCsvException
     */
    protected function open($file)
    {
        $this->handle = fopen($file, 'r');
        if (!$this->handle) {
            throw new InvalidCsvException('Could not open file');
        }
    }

    /**
     * Reads the first line and sets the object's `$fields` variable accordingly.
     *
     * Takes an array of `$required` fields and throws an exception if one or more
     * are absent from the csv.
     *
     * @param string[] $required
     * @return void
     * @throws InvalidCsvException
     */
    protected function readHeader($required)
    {
        // byte order mark, which may be at start of file
        $bom = "\xef\xbb\xbf";

        // Progress file pointer and get first 3 characters to compare to the BOM string.
        if (fgets($this->handle, 4) !== $bom) {
            // BOM not found - rewind pointer to start of file.
            rewind($this->handle);
        }

        // read first line for header
        $header = fgetcsv($this->handle);

        if (!$header) {
            throw new InvalidCsvException('File is empty or in invalid csv format');
        }

        $format = function ($field) {
            return (mb_strtolower(trim($field)));
        };

        $this->fields = array_map($format, $header);
    }

    /**
     * Builds an array of rows, each now an associative array of key-value pairs
     * based on the fields in the already-validated header
     * @return void
     */
    protected function readBody()
    {
        $result = [];

        while ($line = fgetcsv($this->handle)) {
            $row = [];
            foreach ($this->fields as $index => $field) {
                $row[$field] = $line[$index];
            }
            $result[] = $row;
        }

        $this->rows = $result;
    }
}
