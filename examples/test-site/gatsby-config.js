const express = require('express');

const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `.env.${activeEnv}`,
});

const SITEURL = process.env.SITE_URL;
const API_BASE_URL_REAL = 'https://cx9d95owmh.execute-api.ap-southeast-1.amazonaws.com/dev/content/v1/imodium/au/en';
const API_BASE_URL_MOCK = 'http://localhost:3000';
const API_BASE_URL = process.env.HEADLESS_API_MOCK === '1'
  ? API_BASE_URL_MOCK : API_BASE_URL_REAL;

const apiResource = (name, path, entityLevel) => ({
  url: `${API_BASE_URL}/${path}`,
  method: 'get',
  headers: {
    'x-api-key': process.env.HEADLESS_API_KEY,
  },
  name,
  entityLevel: entityLevel || undefined,
  enableDevRefresh: true,
});

// Gatsby plugins list.
const plugins = [
  {
    resolve: 'gatsby-source-apiserver',
    options: {
      entitiesArray: [
        apiResource('nav', 'navigation/main-menu'),
        // apiResource('tacos', 'taco-list/home-sections'),
        // apiResource('productTacos', 'taco-list/homepage-product'),
        apiResource('pages', 'pages', 'data'),
      ],
    },
  },
  {
    resolve: 'gatsby-plugin-compile-es6-packages',
    options: {
      modules: ['@bodiless/gatsby-theme-bodiless'],
    },
  },
  '@bodiless/gatsby-theme-bodiless',
  '@bodiless/gatsby-plugin-ssi',
  {
    resolve: 'gatsby-plugin-canonical-urls',
    options: {
      siteUrl: SITEURL,
    },
  },
  {
    resolve: 'gatsby-plugin-sitemap',
  },
];

const tagManagerEnabled = (process.env.GOOGLE_TAGMANAGER_ENABLED || '1') === '1';
if (tagManagerEnabled) {
  /**
   * Google Tag Manager plugin.
   */
  plugins.push({
    resolve: 'gatsby-plugin-google-tagmanager',
    options: {
      id: process.env.GOOGLE_TAGMANAGER_ID || 'GTM-XXXXXXX',
      // datalayer to be set before GTM is loaded
      // should be an object or a function that is executed in the browser
      // Defaults to null
      // Specify optional GTM environment details.
      // gtmAuth: 'YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING',
      // gtmPreview: 'YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME',
      dataLayerName: 'globalDataLayer',
    },
  });
}

const robotsTxtPolicy = [
  {
    userAgent: '*',
    allow: '/',
  },
];
process.env.ROBOTSTXT_POLICY = JSON.stringify(robotsTxtPolicy);

module.exports = {
  developMiddleware: app => {
    app.use('/___docs', express.static('doc', { fallthrough: false }));
  },
  siteMetadata: {
    siteUrl: SITEURL,
  },
  plugins,
};
