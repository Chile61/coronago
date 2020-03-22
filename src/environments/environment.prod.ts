import { environmentBase } from './environment-base';

const environmentProduction = {
    production: true,
    baseUrl: '',
    apiBaseUrl: 'https://sinux.de'
};

export const environment = Object.assign({}, environmentBase, environmentProduction);
