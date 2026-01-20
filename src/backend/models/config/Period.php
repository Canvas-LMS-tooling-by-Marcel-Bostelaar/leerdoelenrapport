<?php

namespace App\Models\Config;

use DateTime;

class Period
{
    public DateTime $startDate;
    public DateTime $endDate;
    public int $periodNumber;

    public function toArray(): array
    {
        return [
            'startDate' => $this->startDate->format('Y-m-d\TH:i:s.uP'),
            'endDate' => $this->endDate->format('Y-m-d\TH:i:s.uP'),
            'periodNumber' => $this->periodNumber
        ];
    }

    public static function fromArray(array $data): self
    {
        $period = new self();
        $period->startDate = new DateTime($data['startDate']);
        $period->endDate = new DateTime($data['endDate']);
        $period->periodNumber = $data['periodNumber'];
        return $period;
    }
}