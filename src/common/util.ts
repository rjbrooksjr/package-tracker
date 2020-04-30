import { complement, pipe, split, map, pickBy, values, sum, curry } from 'ramda';
import { Checksum } from './types';

const toObj = list => Object.assign({}, list);

const evenKeys = (v, k) => k % 2 === 0;

const oddKeys = complement(evenKeys);

const formatList = (tracking: string): number[] => pipe(split(''), map(parseInt))(tracking);

const getSum = (parityFn, tracking) => pipe(
  toObj,
  pickBy(parityFn),
  values,
  sum
)(tracking);

export const validUsps = curry(trackingNumber => {
  const tracking = formatList(trackingNumber);
  const checksum = tracking.pop();

  const sum = (getSum(evenKeys, tracking) * 3) + getSum(oddKeys, tracking);

  console.log("here", sum, checksum);

  return 10 - sum % 10 === checksum;
})

export const dummy = curry((checksum: Checksum, trackin: string): boolean => true);

export const mod10 = curry((checksum: Checksum, tracking: string): boolean => {
  const t = formatList(tracking);
  const chk = t.pop();
  const sum = (getSum(evenKeys, t) * checksum.evens_multiplier) + (getSum(oddKeys, t) * checksum.odds_multiplier);
  return 10 - sum % 10 === chk;
});