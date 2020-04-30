import './contentscript.scss';
import { Carrier } from '../common/types';
import { mod10, dummy } from '../common/util';
import { identity, pipe, concat, map, prop, join, flip, match, objOf, tap, filter, uniq, pluck, replace, cond, pathEq, applySpec } from 'ramda';
import * as usps from '../../external/tracking_number_data/couriers/usps.json';

const c = [usps];

const getList = carrier => pipe(
  prop('regex'),
  join(''),
  replace(/\?<[a-zA-Z]+>/g, ''),
  concat('(\\b'),
  flip(concat)('\\b)'),
  (r: string) => new RegExp(r, 'g'),
  flip(match)(document.body.innerHTML),
  uniq,
)(carrier);

const validator = trackingNumber => trackingNumber.validation.checksum.name === 'mod10'
  ? mod10
  : dummy;

const getTrackingNumbers = carrier => pipe(
  applySpec({
    'name': prop('name'),
    'tr': pipe(
      prop('tracking_numbers'),
        map(
            tn => pipe(getList, filter(validator(tn)(tn.validation.checksum)))(tn),

        )
    )
  })
  ,
  tap(x => console.log('111', x)),
)(carrier);

const getTrackingNumbers2 = carrier => pipe(
  prop('tracking_numbers'),
  pluck('regex'),
  map(pipe(join(''), replace(/\?<[a-zA-Z]+>/g, ''))),
  join('\\b)|(\\b'),
  concat('(\\b'),
  flip(concat)('\\b)'),
  (r: string) => new RegExp(r, 'g'),
  flip(match)(document.body.innerHTML),
  // tap(x => console.log('111', x)),
  uniq,
  // filter(carrier.validator),
  // objOf('trackingNumbers'),
  // tap(x => console.log('x', x)),
)(carrier);

const validateTrackingNumbers = (carrier, trackingNumbers) => cond([
    [pathEq(['validation', 'checksum', 'name'], 'mod10'), mod10]
])(carrier);

const validate = (carrier: Carrier) => carrier.courier_code === 'usps'
  ? mod10
  : identity;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const foo = c.map(carrier => ({
    track: getTrackingNumbers(carrier),
    name: carrier.name,
  }));

  console.log('ccc', foo);
});
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   const foo = carriers.map(carrier => ({
//     track: pipe(
//       prop('patterns'),
//       join('\\b)|(\\b'),
//       concat('(\\b'),
//       flip(concat)('\\b)'),
//       (r: string) => new RegExp(r, 'g'),
//       flip(match)(document.body.innerHTML),
//       uniq,
//       filter(carrier.validator),
//       // objOf('trackingNumbers'),
//       // tap(x => console.log('x', x)),
//     )(carrier),
//     name: carrier.name,
//   }));

//   console.log('ccc', foo);
// });