import { Injectable } from '@angular/core';
import _ from 'lodash';
// import {CORONA_GO_BLE_SERVICE_UUID_PREFIX} from './cdv-bluetooth-le-config';


@Injectable({
  providedIn: 'root'
})
export class CgServiceMatcherService {

  constructor() { }

  // public static matchServiceUuidReturnUser(serviceUuidByteArray): number[]{
  //
  //     const doesStartWithPrefix = _.every(
  //         CORONA_GO_BLE_SERVICE_UUID_PREFIX,
  //         (b, idx) => serviceUuidByteArray[idx] === b);
  //
  //     if (doesStartWithPrefix) {
  //         const userIdByteArray = serviceUuidByteArray.slice(CORONA_GO_BLE_SERVICE_UUID_PREFIX.length);
  //         return userIdByteArray;
  //     } else {
  //         return null;
  //     }
  //
  // }

}
