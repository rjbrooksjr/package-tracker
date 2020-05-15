export type SerialNumberFormat = {
  prepend_if: {
    matches_regex: string;
    content: string;
  };
}

export type TrackingData = {
  tracking_url: string;
  name: string;
  description: string;
  regex: string[];
  validation: {
    checksum: Checksum ;
    serial_number_format?: SerialNumberFormat;
  };
  test_numbers: { valid: string[], invalid: string[] };
}

export type Carrier = {
  name: string;
  courier_code: string;
  tracking_numbers: TrackingData[];
};

export type Checksum = {
  name: string;
  evens_multiplier: number;
  odds_multiplier: number;
}

export type TrackingMatchResult = {
  courierCode: string;
  trackingNumbers: string[];
}

export type SerialData = {
  serial: string;
  checkDigit: string;
  checksum: Checksum;
}

export type StoredTrackingNumber = {
  courierCode: string;
  trackingNumber: string;
  status: string;
}

export type TrackingStorage = {
  tracking: StoredTrackingNumber[];
}
