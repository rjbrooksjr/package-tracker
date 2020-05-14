import { TrackingMatchResult, StoredTrackingNumber } from "../common/types";
import { curry, prop, find, pipe, uniq, ifElse, evolve, mergeRight, identity, tap, map, whereEq, unionWith, both, eqBy } from "ramda";
import { log } from "../common/util";

const saveTracking = tracking => chrome.storage.local.set({ tracking }, () => {});

const refresh = x => identity;

const splitTrackingNumbers = (data: TrackingMatchResult[]): StoredTrackingNumber[] => data.map(row => row.trackingNumbers.map(
  trackingNumber => ({ courierCode: row.courierCode, trackingNumber: trackingNumber.replace(/[^a-zA-Z\d]/g, '') })
)).flat(Infinity);

const storeTrackingNumber = curry((response: TrackingMatchResult[], storage: StoredTrackingNumber[]) => pipe(
  splitTrackingNumbers,
  // not workin'
  // https://ramdajs.com/repl/?v=0.27.0#?const%20storage%20%3D%20%5B%0A%20%20%7B%20%22courierCode%22%3A%20%22usps%22%2C%20%22trackingNumber%22%3A%20%22123%22%20%7D%0A%5D%3B%0A%0Aconst%20entries%20%3D%20%5B%7B%20%22courierCode%22%3A%20%22usps%22%2C%20%22trackingNumber%22%3A%20%22456%22%20%7D%2C%20%7B%20%22courierCode%22%3A%20%22usps%22%2C%20%22trackingNumber%22%3A%20%22123%22%20%7D%5D%3B%0A%0Aconst%20l1%20%3D%20%5B%7Ba%3A%201%7D%2C%20%7Ba%3A%202%7D%5D%3B%0Aconst%20l2%20%3D%20%5B%7Ba%3A%201%7D%2C%20%7Ba%3A%204%7D%5D%3B%0AunionWith%28both%28eqBy%28prop%28%27courierCode%27%29%29%2C%20eqBy%28prop%28%27trackingNumber%27%29%29%29%2C%20storage%2C%20entries%29%3B
  unionWith(both(eqBy(prop('courierCode')), eqBy(prop('trackingNumber'))), log('storage', storage)),
  tap(console.log),
  saveTracking,
)(response));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => changeInfo.status === 'complete' && tab.active &&
  chrome.tabs.query({ active: true, currentWindow: true, }, tabs =>
    tabs[0] && chrome.tabs.sendMessage(tabs[0].id, {}, (response: TrackingMatchResult[]) => {
      console.log('got', response);
      response && chrome.storage.local.get('tracking', storeTrackingNumber(response));
    })
  )
);
