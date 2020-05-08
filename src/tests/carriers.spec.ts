import 'mocha';
import * as usps from '../../external/tracking_number_data/couriers/usps.json';
import { Carrier } from '../common/types';
import { expect } from 'chai';
import { mod10, getSerialData } from '../common/util';

const carriers = [usps];

carriers.map((carrier: Carrier) => {
  describe(carrier.name, () => {
    carrier.tracking_numbers.map(trackingNumber => {
      describe(trackingNumber.name, () => {
        it('Validates valid tracking numbers', done => {
          trackingNumber.test_numbers.valid.map(n => {
            const serialData = getSerialData(n, trackingNumber);
            expect(mod10(serialData)).to.be.true;
          });
          done();
        });
        it('Does not validate invalid tracking numbers', done => {
          trackingNumber.test_numbers.invalid.map(n => {
            const serialData = getSerialData(n, trackingNumber);
            expect(mod10(serialData)).to.be.false;
          });
          done();
        });
      });
    });
  });
});
