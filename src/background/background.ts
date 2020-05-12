import { TrackingMatchResult, StoredTrackingNumbers } from "../common/types";
import { curry, prop, concat, pipe, uniq, ifElse, evolve, mergeRight, identity, tap } from "ramda";

const save = curry((callback, key, value) => chrome.storage.local.set({tracking: { [key]: value }}, callback));

const refresh = x => identity;

const storeTrackingNumber = curry((response: TrackingMatchResult, storage: StoredTrackingNumbers) => pipe(
  tap(x => console.log('here', response, storage)),
  ifElse(
    prop(response.courierCode),
    evolve({ [response.courierCode]: pipe(concat(response.trackingNumbers), uniq)}),
    mergeRight({ [response.courierCode]: response.trackingNumbers})
  ),
  tap(console.log),
  save(refresh, response.courierCode),
)(storage));

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => changeInfo.status === 'complete' && tab.active &&
  chrome.tabs.query({ active: true, currentWindow: true, }, tabs =>
    tabs[0] && chrome.tabs.sendMessage(tabs[0].id, {}, response => {
      console.log('got' + response);
      // this is spawning race conditions
      response && response.map(r => chrome.storage.local.get('tracking', storeTrackingNumber(r)));
    })
  )
);
