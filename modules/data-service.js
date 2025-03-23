require('dotenv').config();
const Sequelize = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false // Optional: turn on if debugging SQL
  }
);

// Define Models
const ProvinceOrTerritory = sequelize.define('ProvinceOrTerritory', {
  code: { type: Sequelize.STRING, primaryKey: true },
  name: Sequelize.STRING,
  type: Sequelize.STRING,
  region: Sequelize.STRING,
  capital: Sequelize.STRING
}, { timestamps: false });

const Site = sequelize.define('Site', {
  siteId: { type: Sequelize.STRING, primaryKey: true },
  site: Sequelize.STRING,
  description: Sequelize.TEXT,
  date: Sequelize.INTEGER,
  dateType: Sequelize.STRING,
  image: Sequelize.STRING,
  location: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  designated: Sequelize.INTEGER,
  provinceOrTerritoryCode: Sequelize.STRING
}, { timestamps: false });

// Define relationship
Site.belongsTo(ProvinceOrTerritory, {
  foreignKey: 'provinceOrTerritoryCode'
});

// Initialize DB
function initialize() {
  return sequelize.sync();
}

// Get all sites (with province info)
function getAllSites() {
  return Site.findAll({ include: [ProvinceOrTerritory] });
}

// Get single site by ID
function getSiteById(id) {
  return Site.findAll({
    include: [ProvinceOrTerritory],
    where: { siteId: id }
  }).then(data => {
    if (data.length > 0) return data[0];
    else throw "Unable to find requested site";
  });
}

// Get sites by province/territory name (case-insensitive match)
function getSitesByProvinceOrTerritoryName(name) {
  return Site.findAll({
    include: [ProvinceOrTerritory],
    where: {
      '$ProvinceOrTerritory.name$': {
        [Sequelize.Op.iLike]: `%${name}%`
      }
    }
  }).then(data => {
    if (data.length > 0) return data;
    else throw "Unable to find requested sites";
  });
}

// Get sites by region
function getSitesByRegion(region) {
  return Site.findAll({
    include: [ProvinceOrTerritory],
    where: {
      '$ProvinceOrTerritory.region$': region
    }
  }).then(data => {
    if (data.length > 0) return data;
    else throw "Unable to find requested sites";
  });
}

// Get all provinces/territories (for dropdown in Add Site form)
function getAllProvincesAndTerritories() {
  return ProvinceOrTerritory.findAll();
}

// Add a new site
function addSite(siteData) {
  return Site.create(siteData);
}

// Export all functions
module.exports = {
  initialize,
  getAllSites,
  getSiteById,
  getSitesByProvinceOrTerritoryName,
  getSitesByRegion,
  getAllProvincesAndTerritories,
  addSite
};
