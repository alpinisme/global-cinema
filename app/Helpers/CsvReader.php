<?php

namespace App\Helpers;

use App\Exceptions\InvalidCsvException;

class CsvReader
{
    /** @var resource */
    protected $handle;

    /** @var string[] */
    protected $fields;

    /**
     * Reads and parses a csv file with headers
     *
     * @param mixed $file
     * @param string[] $requiredFields
     * @return array[]
     */
    public function read($file, $requiredFields = [])
    {
        $this->open($file);
        $this->validateHeader($requiredFields);

        return $this->parsed();
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
    protected function validateHeader($required)
    {
        $header = fgetcsv($this->handle);

        if (!$header) {
            throw new InvalidCsvException('File is empty or in invalid csv format');
        }

        $fields = array_map('mb_strtolower', $header);
        $missing = array_diff($required, $fields);

        if (!empty($missing)) {
            throw new InvalidCsvException('File missing required header field(s): ' . implode(', ', $missing));
        }

        $this->fields = $fields;
    }

    /**
     * Builds an array of rows, each now an associative array of key-value pairs
     * based on the fields in the already-validated header
     * @return void
     */
    protected function parsed()
    {
        $result = [];

        while ($line = fgetcsv($this->handle)) {
            $row = [];
            foreach ($this->fields as $index => $field) {
                $row[$field] = $line[$index];
            }
            $result[] = $row;
        }

        return $result;
    }
}
