'use strict';

var fs = require('fs');

var inFileName;
var outFileName;
var isPretty = false;

inFileName = './client/data/sa2-2011-aust-001p.json';
outFileName = './client/data/sa2-2011-aust-001p-with-props.json';

// SA2 GeoJson

var geoJsonSa2 = require(inFileName);
var features = geoJsonSa2.features.map(function eachFeature(feature) {
  var props = {
    id: feature.properties.SA2_MAIN11,
    name: feature.properties.SA2_NAME11,
    stateId: feature.properties.STE_CODE11,
    area: feature.properties.ALBERS_SQM,
  };
  feature.properties = props;
  return feature;
});
geoJsonSa2.features = features;

fs.writeFile(
  outFileName,
  (isPretty ?
    JSON.stringify(geoJsonSa2, undefined, 2) :
    JSON.stringify(geoJsonSa2)),
  function onWroteFile(err) {
    if(err) {
        return console.log(err);
    }
    console.log('File write success - geoJsonSa2');
});

// State geoJson

inFileName = './client/data/ste-2011-aust-0001p.json';
outFileName = './client/data/ste-2011-aust-0001p-with-props.json';

var geoJsonSte = require(inFileName);
var featuresSte = geoJsonSte.features.map(function eachFeature(feature) {
  var props = {
    id: feature.properties.STE_CODE11,
    name: feature.properties.STE_NAME11,
    area: feature.properties.ALBERS_SQM,
  };
  feature.properties = props;
  return feature;
});
geoJsonSte.features = featuresSte;

fs.writeFile(
  outFileName,
  (isPretty ?
    JSON.stringify(geoJsonSte, undefined, 2) :
    JSON.stringify(geoJsonSte)),
  function onWroteFile(err) {
    if(err) {
        return console.log(err);
    }
    console.log('File write success - geoJsonSte');
});


// Dummy data

inFileName = './client/data/sa2-xxxx-aust-data.json';
outFileName = './client/data/sa2-xxxx-aust-data-clean.json';
var dataDummy = require(inFileName);
var key, val;
for (key in dataDummy) {
  if (dataDummy.hasOwnProperty(key)) {
    val = dataDummy[key];
    dataDummy[key] = val[0];
  }
}
fs.writeFile(
  outFileName,
  (isPretty ?
    JSON.stringify(dataDummy, undefined, 2) :
    JSON.stringify(dataDummy)),
  function onWroteFile(err) {
    if(err) {
        return console.log(err);
    }
    console.log('File write success - dataDummy');
});

// Schools time series data

var stateLetterCodeToStateId = {
  NSW: 1,
  VIC: 2,
  QLD: 3,
  SA: 4,
  WA: 5,
  TAS: 6,
  NT: 7,
  ACT: 8,
  OTHER: 9,
};
function getStateCodeFromLetterCode(code) {
  var code = code.toUpperCase();
  return stateLetterCodeToStateId[code];
}

inFileName = './client/data/ste-2016-2061-schools-data.json';
outFileName = './client/data/ste-2016-2061-schools-data-clean.json';
var dataSchools = require(inFileName);
var year, state;
var yearVal, yearStateVal;
var yearCode, stateCode;
for (year in dataSchools) {
  if (dataSchools.hasOwnProperty(year)) {
    yearVal = dataSchools[year];
    yearCode = year.split('-')[1];
    dataSchools[''+yearCode] = yearVal;
    dataSchools[year] = undefined;
    for (state in yearVal) {
      if (yearVal.hasOwnProperty(state)) {
        yearStateVal = yearVal[state];
        stateCode = getStateCodeFromLetterCode(state.split('.')[0]);
        yearVal[''+stateCode] = yearStateVal[0];
        yearVal[state] = undefined;
      }
    }
  }
}

fs.writeFile(
  outFileName,
  (isPretty ?
    JSON.stringify(dataSchools, undefined, 2) :
    JSON.stringify(dataSchools)),
  function onWroteFile(err) {
    if(err) {
        return console.log(err);
    }
    console.log('File write success - dataSchools');
});
