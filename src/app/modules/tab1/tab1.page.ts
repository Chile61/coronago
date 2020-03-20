import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {




    function ll(msg) {

        console.error('BLC', msg);

    }


    const initPeriParams = {
      "request": true,
      "restoreKey": "cotrack"
    };

    const advertParams = {

        "services":["1234"], //iOS
        // "service":"1234", //Android
        "name":"Hello World",
    };


    var serviceParams = {
        service: "C95A3B73-6E97-44CB-BC5C-8CD86468B001",
        characteristics: [
            {
                uuid: "C95A3B73-6E97-44CB-BC5C-8CD86468B021",
                permissions: {
                    read: true,
                    write: true,
                    //readEncryptionRequired: true,
                    //writeEncryptionRequired: true,
                },
                properties : {
                    read: true,
                    writeWithoutResponse: true,
                    write: true,
                    notify: true,
                    indicate: true,
                    //authenticatedSignedWrites: true,
                    //notifyEncryptionRequired: true,
                    //indicateEncryptionRequired: true,
                }
            }
        ]
    };



    document.addEventListener('deviceready', () => {


        ll('INIT PERI...');

        bluetoothle.initializePeripheral((initRes) => {

                ll('INIT RES');
                ll('ADDING SERVICE');

                bluetoothle.addService(
                    (succResp) => {console.error('BLC success', succResp)},
                    (errResp) => {console.error('BLC', 'error', errResp)},
                    serviceParams);


                bluetoothle.startAdvertising(
                    (succResp) => {console.error('BLC ADV success', succResp)},
                    (errResp) => {console.error('BLC ADV error', errResp)},
                    advertParams);


            },
            (errResp) => {console.error('BLC PERI error', errResp)},
            initPeriParams);

    });








  }

}
