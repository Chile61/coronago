import { Injectable } from '@angular/core';
import _ from 'lodash';
import {CgPeripheral} from './cg-peripheral.class';
import to from 'await-to-js';
import {CdvBluetoothLeService} from './cdv-bluetooth-le.service';
import {CgAdvertisementScannerService} from './cg-advertisement-scanner.service';
import {CgAdvertisementFactoryService} from './cg-advertisement-factory.service';
import {CgPeripheralManagerService} from './cg-peripheral-manager.service';
import {CgUserManagerService} from './cg-user-manager.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BleScanCycleManagerService {


    private nearbyUserListUpdatedSubject$ = new Subject();
    public nearbyUserListUpdated$ = this.nearbyUserListUpdatedSubject$.asObservable();


  constructor(
      private cGAdvertisementScannerService: CgAdvertisementScannerService,
      private cGAdvertisementFactoryService: CgAdvertisementFactoryService,
      private cgPeripheralManagerService: CgPeripheralManagerService,
      private cgUserManagerService: CgUserManagerService

  ) { }

  public startScanCycle(): void {



      this.cgPeripheralManagerService.peripheralsUpdated$
          .subscribe(async ( periByAddr ) => {
              try {

                  console.error('ffr', '--------------------------------------------------');
                  console.error('ffr', 'PERIPHERALS');
                  console.error('ffr', '--------------------------------------------------');
                  _.each(periByAddr, (peri: CgPeripheral, addr) => {
                      console.error(
                          'ffr', 'peri#', addr,
                          'seen', peri.getLastSeenReadableSec(), 'secs ago',
                          JSON.stringify(peri), peri.getUserId());

                  });



                  console.error('ffr', '--------------------------------------------------');
                  console.error('ffr', 'DROP OLD PERIPHERAL ENTRIES');
                  console.error('ffr', '--------------------------------------------------');
                  const peris: CgPeripheral[] = _.values(periByAddr);
                  for (let i = 0, ii = peris.length; i < ii; i += 1) {
                      const peri = peris[i];
                      const maxPeripheralAgeMs = 200 * 1000;
                      if (peri.isOlderThenMs(maxPeripheralAgeMs)) {
                          console.error('ffr', 'Dropping peripheral ', peri.address);
                          await this.cgPeripheralManagerService.dropPeripheralByAddress(peri.address);
                      }
                  }


                  console.error('ffr', '--------------------------------------------------');
                  console.error('ffr', 'RETRIEVING USER ID');
                  console.error('ffr', '--------------------------------------------------');
                  for (let i = 0, ii = peris.length; i < ii; i += 1) {
                      const peri = peris[i];

                      await peri.retrieveUserId();

                      if (peri.didExtractUserId()) {
                          this.cgUserManagerService.createOrUpdateUser(peri);
                      }

                  }


                  console.error('ffr', '--------------------------------------------------');
                  console.error('ffr', 'Drop DEAD USERS');
                  console.error('ffr', '--------------------------------------------------');

                  const maxAgeSec = 3 * 60;
                  this.cgUserManagerService.dropUsersOlderThanSec(maxAgeSec);



                  console.error('ffr', '--------------------------------------------------');
                  console.error('ffr', 'USER STATUS CURRENT');
                  console.error('ffr', '--------------------------------------------------');

                  const cgUsers = this.cgUserManagerService.getUsers();
                  console.error('ffr', this.cgUserManagerService.getUsers(), JSON.stringify( this.cgUserManagerService.getUsers() ) );


                  this.nearbyUserListUpdatedSubject$.next(cgUsers);


              } catch (e) {
                  console.error('ffr', 'error', JSON.stringify(e));
                  console.error(e);
              }
          });


      this.cGAdvertisementScannerService.startScanningForCgAdvertisement();


      setInterval( async () => {
          const [err, advResponse] = await to(CdvBluetoothLeService.isAdvertising());
          console.error('ffr', 'isAdvertising?', JSON.stringify(err), JSON.stringify(advResponse));
      }, 5000);


      this.cGAdvertisementScannerService.cgScanCycleWorthOfScanResps$
          .subscribe( async (scanResponses: []) => {
              console.error('ffr', 'scan responses coutn', scanResponses.length);

              if (scanResponses && scanResponses.length) {

                  let addrs = _.map(scanResponses, 'address');
                  addrs = _.uniq(addrs);
                  console.error('ffr', 'got scan responses', JSON.stringify(addrs));


                  this.cgPeripheralManagerService.feedWithScanResponses(scanResponses);

              }

          });

  }

}
