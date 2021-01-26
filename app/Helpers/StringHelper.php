<?php

namespace App\Helpers;

class StringHelper
{
    /**
     * Divides a string into all possible substrings of specified length
     *
     * @param string $string
     * @param int $chunkSize
     * @return array<string>
     */
    public function substrings($string, $chunkSize = 5)
    {
        $length = strlen($string);
        if ($length <= $chunkSize) {
            return [$string];
        } elseif ($length) {
            $result = [];
            for ($i = 0; $i < $length - $chunkSize; $i++) {
                $result[] = substr($string, $i, $i + $chunkSize);
            }

            return $result;
        }
    }
}
