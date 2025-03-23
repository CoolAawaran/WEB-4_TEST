const siteData = require("./modules/data-service");
const path = require("path");
const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

// app.use(express.static('public')); // causing tailwindCSS not working on vercel.com
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render("home");
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get("/sites", async (req,res)=>{
  let sites;
  try{
    if(req.query.region){
      sites = await siteData.getSitesByRegion(req.query.region);
    }else if(req.query.provinceOrTerritory){
      sites = await siteData.getSitesByProvinceOrTerritoryName(req.query.provinceOrTerritory);
    }else{
      sites = await siteData.getAllSites();
    }

    res.render("sites", {sites})
  }catch(err){
    res.status(404).render("404", {message: err});
  }
});

app.get("/sites/:id", async (req,res)=>{
  
  try{
    let site = await siteData.getSiteById(req.params.id);
    // res.send(site);
    if(site)
      res.render("site", {site});
    else 
      res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for. "});
  }catch(err){
    res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for. "});
  }
});

app.use((req, res, next) => {
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});

siteData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});