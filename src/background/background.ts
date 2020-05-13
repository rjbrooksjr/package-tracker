import { TrackingMatchResult, StoredTrackingNumbers } from "../common/types";
import { curry, prop, concat, pipe, uniq, ifElse, evolve, mergeRight, identity, tap, map } from "ramda";

const saveTracking = curry((callback, tracking) => chrome.storage.local.set({ tracking }, callback));

const refresh = x => identity;

const storeTrackingNumber = curry((response: TrackingMatchResult[], storage: StoredTrackingNumbers) => pipe(
  map((r: TrackingMatchResult) =>
    ifElse(
      prop('courierCode'),
      identity,
      mergeRight(({ [r.courierCode]: r.trackingNumbers }))
    )(storage)
  ),
  tap(console.log),
  saveTracking,
)(response));

// https://ramdajs.com/repl/?v=0.27.0#?const%20d%20%3D%20%7B%20usps%3A%20%5B1%2C%202%5D%20%7D%3B%0A%0AObject.keys%28d%29.map%28%0A%20%20carrier%20%3D%3E%20d%5Bcarrier%5D.map%28%28trackingNumber%29%20%3D%3E%0A%20%20%20%20%28%7Bcarrier%2C%20trackingNumber%7D%29%0A%20%20%29%0A%29%3B%0A%0A
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => changeInfo.status === 'complete' && tab.active &&
  chrome.tabs.query({ active: true, currentWindow: true, }, tabs =>
    tabs[0] && chrome.tabs.sendMessage(tabs[0].id, {}, (response: TrackingMatchResult[]) => {
      console.log('got', response);
      response && chrome.storage.local.get('tracking', storeTrackingNumber(response));
    })
  )
);
