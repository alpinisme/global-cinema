<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GradingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'info' => [
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
            ],
            'datesCompleted' => $this->resource->datesCompleted(),
        ];
    }
}
