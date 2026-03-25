/**
 * Single source of truth for API catalog table, API details, and credential `api` column names.
 * My API keys / API key approvals use the same `name` values as catalog rows.
 */

const DESC = 'Description of the API product.';

/**
 * @typedef {object} ApiCatalogProduct
 * @property {string} name — Catalog list title & navigation key (must match credential `api`)
 * @property {string} productDisplayName — Shown in API details “API product name”
 * @property {string} version
 * @property {string} owner
 * @property {string} lifecycle — Production | Staging | Testing
 * @property {string} catalogStatus — Published | Active | Draft | Retired | Deprecated
 * @property {string} description
 * @property {string} tag
 * @property {string} created
 * @property {string} baseUrl
 * @property {string} specUrl
 * @property {string} docUrl
 * @property {string} approval
 * @property {{ tier: string, rateLimit: string }[]} planTiers
 * @property {string} [slug] — for OpenAPI mock
 */

/** @type {ApiCatalogProduct[]} */
export const API_CATALOG_PRODUCTS = [
  {
    name: 'Flight API',
    productDisplayName: 'Air Flight API',
    version: 'V1',
    owner: 'John Doe',
    lifecycle: 'Production',
    catalogStatus: 'Published',
    description: DESC,
    tag: 'Business',
    created: 'Jan 24, 2026 10:15',
    baseUrl: 'http://smartairline.api.com/flightapi',
    specUrl: 'https://Smartairline.com/flightapi/v1',
    docUrl: 'https://docexample/v1',
    approval: 'Need manual approval',
    planTiers: [
      { tier: 'Bronze', rateLimit: '100/day' },
      { tier: 'Silver', rateLimit: '1000/day' },
      { tier: 'Gold', rateLimit: '10000/day' }
    ],
    slug: 'flight-api'
  }
];

/** Ordered names — use for credential `api` field (same order as products). */
export const CATALOG_PRODUCT_NAMES = API_CATALOG_PRODUCTS.map((p) => p.name);

export function getCatalogProductByName(name) {
  return API_CATALOG_PRODUCTS.find((p) => p.name === name) || null;
}

/** Rows for API catalog table (legacy portal list; model still used by API details). */
export function getCatalogTableRows() {
  return API_CATALOG_PRODUCTS.map((p, i) => ({
    id: `catalog-${i}`,
    name: p.name,
    version: p.version,
    owner: p.owner,
    lifecycle: p.lifecycle,
    status: p.catalogStatus,
    description: p.description,
    tag: p.tag,
    created: p.created
  }));
}
