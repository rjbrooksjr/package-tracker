import './contentscript.scss';
import { Carrier, TrackingData, TrackingMatchResult, SerialData } from '../common/types';
import { mod10, dummy, getSerialData } from '../common/util';
import { pipe, map, prop, join, flip, match, filter, uniq, applySpec, flatten, tap } from 'ramda';
import * as usps from '../../external/tracking_number_data/couriers/usps.json';

const carriers = [usps];

const getList = (trackingNumber: TrackingData): string[] => pipe(
  prop('regex'),
  join(''),
  (r: string) => new RegExp(r, 'g'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flip(match)(document.body.innerHTML.replace(/(<([^>]+)>)/ig,"")) as any,
  uniq,
)(trackingNumber);

const validator = (trackingData: TrackingData): (x: SerialData) => boolean =>
  trackingData.validation.checksum.name === 'mod10'
    ? mod10
    : dummy;

const getTrackingNumbers = (carrier: Carrier): TrackingMatchResult => applySpec({
  courierCode: prop('courier_code'),
  trackingNumbers: pipe(
    prop('tracking_numbers'),
    pipe(map((tn: TrackingData) => pipe(getList, tap(x => console.log('here', tn, x)), filter(x => validator(tn)(getSerialData(x, tn))))(tn)), flatten)
  )
})(carrier) as TrackingMatchResult;

chrome.runtime.onMessage.addListener((_request, _sender, sendResponse) => {

  console.log('got', carriers.map(getTrackingNumbers));

  sendResponse(carriers.map(getTrackingNumbers));

});
