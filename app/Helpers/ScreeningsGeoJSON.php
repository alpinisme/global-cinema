<?php

namespace App\Helpers;

use App\Screening;

class ScreeningsGeoJSON
{
    public $type = 'FeatureCollection';

    public $crs = [
        'type' => 'name',
        'properties' => [
            'name' => 'urn:ogc:def:crs:OGC:1.3:CRS84',
        ],
    ];

    public $name;

    public $features = [];

    /**
     * @param String $date
     * @param Screening[] $screenings
     */
    public function __construct($date, $screenings)
    {
        $this->name = $date;

        foreach ($screenings as $screening) {
            $properties = [
                'theater' => $screening->name,
                'title' => $screening->title,
                'language' => $screening->language,
            ];

            $feature = [];
            $feature['type'] = 'Feature';
            $feature['properties'] = $properties;
            $feature['geometry'] = [
                'type' => 'Point',
                'coordinates' => [
                    $screening->lng,
                    $screening->lat,
                ],
            ];

            $this->features[] = $feature;
        }
    }
}
