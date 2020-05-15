import { TrackingMatchResult, StoredTrackingNumber, TrackingStorage } from '../common/types';
import { curry, prop, find, pipe, uniq, ifElse, evolve, mergeRight, identity, tap, map, of, unionWith, both, eqBy } from 'ramda';
import { log } from '../common/util';

const pendingTrackingNumbers: TrackingMatchResult[] = [];

const saveTracking = tracking => chrome.storage.local.set({ tracking }, () => {});

const refresh = x => identity;

const splitTrackingNumbers = (data: TrackingMatchResult[]): StoredTrackingNumber[] => data.map(row => row.trackingNumbers.map(
  trackingNumber => ({ courierCode: row.courierCode, trackingNumber: trackingNumber.replace(/[^a-zA-Z\d]/g, '') })
)).flat(Infinity);

const storeTrackingNumber = (response: TrackingMatchResult[]) => ({ tracking }: TrackingStorage) => pipe(
  splitTrackingNumbers,
  unionWith(both(eqBy(prop('courierCode')), eqBy(prop('trackingNumber'))), tracking),
  saveTracking,
)(response);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => changeInfo.status === 'complete' && tab.active &&
  chrome.tabs.query({ active: true, currentWindow: true, }, tabs =>
    tabs[0] && chrome.tabs.sendMessage(tabs[0].id, {}, (response: TrackingMatchResult[]) => {
      console.log('got', response);
      response && chrome.storage.local.get('tracking', storeTrackingNumber(response));
    })
  )
);
