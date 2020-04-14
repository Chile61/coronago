import { environmentBase } from './environment-base';

const environmentProduction = {
    production: true,
    apiBaseUrl: 'https://api.corona-go.de',
    pauseBetweenScanCyclesSec: 60
};

export const environment = Object.assign({}, environmentBase, environmentProduction);
