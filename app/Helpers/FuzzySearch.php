<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Collection;

/**
 * Fuzzy search helper class
 */
class FuzzySearch
{
    protected $needle;

    protected $key;

    protected $values;

    /**
     * Creates new instance
     *
     * $needle and $haystack ought to be the same type
     *
     * @param mixed $needle item to search for
     * @param Collection|array $haystack array or collection to search within
     */
    public function __construct($needle, $haystack)
    {
        $this->needle = $needle;

        $this->values = $haystack instanceof Collection ? $haystack : collect($haystack);
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
        $this->values = $this->values->map(function ($item) {
            $result['item'] = $item;
            $result['ratio'] = $this->levenshteinRatio(
                $this->getSearchTerm($item),
                $this->getSearchTerm($this->needle)
            );

            return $result;
        });
    }

    /**
     * Get a collection of all underlying values
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all()
    {
        return $this->removeRatios();
    }

    /**
     * Get a collection of the first `$count` number of raw values
     *
     * @param int $count
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function take($count)
    {
        $this->removeRatios();

        return $this->values->take($count);
    }

    /**
     * Get an array of the underlying collection
     *
     * @return array
     */
    public function toArray()
    {
        return $this->removeRatios()->values->all();
    }

    /**
     * Sort the underlying collection by similarity to the sought value
     *
     * @param string $key the key to use when comparing
     */
    public function sort($key = null)
    {
        $this->key = $key;
        $this->compareAndAttachRatios();

        $this->sortDescByRatio();

        return $this;
    }

    protected function removeRatios()
    {
        $this->values = $this->values->map(function ($item) {
            return $item['item'];
        });

        $this->values = $this->values->values();

        return $this;
    }

    protected function sortDescByRatio()
    {
        $this->values = $this->values->sortByDesc('ratio');
    }

    /**
     * Removes entries from the underlying collection that are less similar than the specified threshold
     *
     * @param float $value number between 0 and 1, 1 being a perfect match
     */
    public function threshold($value)
    {
        $this->values = $this->values->filter(function ($item) use ($value) {
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
     * 1 is a perfect match. 0 means the strings share nothing in common.
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
