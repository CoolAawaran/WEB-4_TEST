const siteData = require("../data/NHSiteData");
const provinceAndTerritoryData = require("../data/provinceAndTerritoryData");

let sites = [];

function initialize() {
  return new Promise((resolve, reject) => {
    siteData?.forEach(site => {
      let siteWithProvinceOrTerritory = { ...site, provinceOrTerritoryObj: provinceAndTerritoryData.find(provOrTerr => provOrTerr.code == site.provinceOrTerritoryCode) }
      sites.push(siteWithProvinceOrTerritory);
      resolve();
    });
  });

}

function getAllSites() {
  return new Promise((resolve, reject) => {
    resolve(sites);
  });
}

function getSiteById(id) {

  return new Promise((resolve, reject) => {
    let foundSite = sites.find(s => s.siteId == id);

    if (foundSite) {
      resolve(foundSite)
    } else {
      reject("Unable to find requested site");
    }
  });
}

function getSitesByProvinceOrTerritoryName(name) {

  return new Promise((resolve, reject) => {
    let foundSites = sites.filter(s => s.provinceOrTerritoryObj.name.toUpperCase().includes(name.toUpperCase()));

    if (foundSites.length > 0) {
      resolve(foundSites)
    } else {
      reject("Unable to find requested sites");
    }
  });

}

function getSitesByRegion(region) {

  return new Promise((resolve, reject) => {
    let foundSites = sites.filter(s => s.provinceOrTerritoryObj.region.toUpperCase().includes(region.toUpperCase()));

    if (foundSites.length > 0) {
      resolve(foundSites)
    } else {
      reject("Unable to find requested sites");
    }
  });

}


module.exports = { initialize, getAllSites, getSiteById, getSitesByRegion, getSitesByProvinceOrTerritoryName }


