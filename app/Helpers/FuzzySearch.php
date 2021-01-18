<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Collection;

/**
 * Fuzzy search helper class
 */
class FuzzySearch
{
    protected $needle;

    protected $haystack;

    protected $key;

    protected $result;

    public function __construct($needle, $haystack)
    {
        $this->needle = $needle;

        $this->haystack = $haystack instanceof Collection ? $haystack : collect($haystack);
    }

    protected function getSearchTerm($item)
    {
        if ($this->key) {
            $key = $this->key;

            return is_object($item) ? $item->$key : $item[$key];
        }

        return $item;
    }

    protected function compareAndAttachRatios()
    {
        $this->result = $this->haystack->map(function ($item) {
            $result['item'] = $item;
            $result['ratio'] = $this->levenshteinRatio(
                $this->getSearchTerm($item),
                $this->getSearchTerm($this->needle)
            );

            return $result;
        });
    }

    public function all()
    {
        return $this->removeRatios();
    }

    public function take($count)
    {
        $this->removeRatios();

        return $this->result->take($count);
    }

    public function toArray()
    {
        return $this->removeRatios()->result->all();
    }

    public function sort($key = null)
    {
        $this->key = $key;
        $this->compareAndAttachRatios();

        $this->sortDescByRatio();

        return $this;
    }

    protected function removeRatios()
    {
        $this->result = $this->result->map(function ($item) {
            return $item['item'];
        });

        $this->result = $this->result->values();

        return $this;
    }

    protected function sortDescByRatio()
    {
        $this->result = $this->result->sortByDesc('ratio');
    }

    public function threshold($value)
    {
        $this->result = $this->result->filter(function ($item) use ($value) {
            return $item['ratio'] >= $value ? true : false;
        });

        return $this;
    }

    /**
     * Compares two strings using levenshtein algorithm
     *
     * Finds ratio of the actual levenshtein distance (number of changes necessary
     * to convert one string to the other) to the highest possible distance
     * between two strings of the supplied lengths. Returns a number between 0 and 1.
     *
     * @param string $a
     * @param string $b
     *
     * @return number
     */
    protected function levenshteinRatio($a, $b)
    {
        $maxDistance = max(strlen($a), strlen($b));

        return 1 - (levenshtein($a, $b) / $maxDistance);
    }
}
