import { complement, pipe, split, map, pickBy, values, sum, reverse } from 'ramda';
import { TrackingData, SerialData, SerialNumberFormat } from './types';

const toObj = (list): Record<string, number> => Object.assign({}, list);

const evenKeys = (_v, k): boolean => k % 2 === 0;

const oddKeys = complement(evenKeys);

const formatList = (tracking: string): number[] => pipe(reverse, split(''), map(parseInt))(tracking);

const getSum = (parityFn, tracking): number => pipe(
  toObj,
  pickBy(parityFn),
  values,
  sum
)(tracking);

export const dummy = (_serialData: SerialData): boolean => true;

export const mod10 = ({ serial, checkDigit, checksum }: SerialData): boolean => {
  const t = formatList(serial.replace(/[^\d]/g, ''));
  const sum = (getSum(evenKeys, t) * checksum.evens_multiplier) + (getSum(oddKeys, t) * checksum.odds_multiplier);
  return (10 - sum % 10) % 10 === parseInt(checkDigit);
};

const formatSerial = (serial: string, numberFormat: SerialNumberFormat): string =>
  numberFormat.prepend_if && new RegExp(numberFormat.prepend_if.matches_regex).test(serial)
    ? `${numberFormat.prepend_if.content}${serial}`
    : serial;

const matchTrackingData = (trackingNumber: string, regex: string[]): Partial<SerialData> => {
  const match = new RegExp(regex.join('')).exec(trackingNumber);
  return match && {
    serial: match.groups.SerialNumber.replace(/\s/g, ''),
    checkDigit: match.groups.CheckDigit,
  };
};

export const getSerialData = (
  trackingNumber: string,
  { regex, validation: { serial_number_format, checksum }}: TrackingData
): SerialData => {
  const trackingData = matchTrackingData(trackingNumber, regex);

  return {
    serial: serial_number_format
      ? formatSerial(trackingData.serial, serial_number_format)
      : trackingData.serial,
    checkDigit: trackingData.checkDigit,
    checksum,
  };
};

export const log = (t, x) => (console.log(t, x), x);
