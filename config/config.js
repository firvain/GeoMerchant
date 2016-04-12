'use strict';
var environment = process.env.NODE_ENV || 'development';
var config = {
  development: {
    connection: {
      user: 'etsipis',
      database: 'cyprus',
      password: 'TR81VH83YH1WrSqjeblH',
      port: 5432,
      host: '188.226.158.168',
      ssl: false,
      application_name: 'GeoMerchant',
      fallback_application_name: 'GeoMerchant'
    },
    auth0: {
      AUTH0_CLIENT_ID: '6hbMw33jaFwwnBLcd1IVcJFhGeqLNyZR',
      AUTH0_CLIENT_SECRET: 'GxdpBofr-UozXstRDKTiQRDWGTDrdmzQif9iq4lN4DbihxavbbWQqXjaMbL2mdIz',
      AUTH0_DOMAIN: 'terracognita.eu.auth0.com',
      AUTH0_CALLBACK_URL: 'http://127.0.0.1:3000/map/callback'
    }
  },
  production: {
    connection: {
      user: 'etsipis',
      database: 'cyprus',
      password: 'TR81VH83YH1WrSqjeblH',
      port: 5432,
      host: '127.0.0.1',
      ssl: false,
      application_name: 'GeoMerchant',
      fallback_application_name: 'GeoMerchant'
    },
    auth0: {
      AUTH0_CLIENT_ID: '6hbMw33jaFwwnBLcd1IVcJFhGeqLNyZR',
      AUTH0_CLIENT_SECRET: 'GxdpBofr-UozXstRDKTiQRDWGTDrdmzQif9iq4lN4DbihxavbbWQqXjaMbL2mdIz',
      AUTH0_DOMAIN: 'terracognita.eu.auth0.com',
      AUTH0_CALLBACK_URL: 'http://www.geomerchant.eu/map/callback'
    }
  }

};
if (environment === 'production') {
  module.exports = config.production;
} else {
  module.exports = config.development;
}
