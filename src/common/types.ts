type TrackingNumber = {
  tracking_url: string;
  name: string;
  description: string;
  regex: string[];
  validation: { checksum: Checksum };
  test_numbers: { valid: string[], invalid: string[] };
}

export type Carrier = {
  name: string;
  courier_code: string;
  tracking_numbers: TrackingNumber[];
};

export type Checksum = {
  name: string;
  evens_multiplier: number;
  odds_multiplier: number;
}