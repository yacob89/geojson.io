var shpwrite = require('shp-write'),
    clone = require('clone'),
    topojson = require('topojson'),
    saveAs = require('filesaver.js'),
    tokml = require('tokml');

module.exports.topo = topo;
module.exports.geoJSON = geoJSON;
module.exports.kml = kml;
module.exports.shp = shp;

function topo(context) {
    var content = JSON.stringify(topojson.topology({
        collection: clone(context.data.get('map'))
    }, {'property-transform': allProperties}));

    saveAs(new Blob([content], {
        type: 'text/plain;charset=utf-8'
    }), 'map.topojson');

    analytics.track('download/topojson');
}

function geoJSON(context) {
    if (d3.event) d3.event.preventDefault();
    var content = JSON.stringify(context.data.get('map'));
    var meta = context.data.get('meta');
    saveAs(new Blob([content], {
        type: 'text/plain;charset=utf-8'
    }), (meta && meta.name) || 'map.geojson');
    analytics.track('download/geojson');
}

function kml(context) {
    if (d3.event) d3.event.preventDefault();
    var content = tokml(context.data.get('map'));
    var meta = context.data.get('meta');
    saveAs(new Blob([content], {
        type: 'text/plain;charset=utf-8'
    }), 'map.kml');
    analytics.track('download/kml');
}

function shp(context) {
    if (d3.event) d3.event.preventDefault();
    d3.select('.map').classed('loading', true);
    try {
        shpwrite.download(context.data.get('map'));
    } finally {
        d3.select('.map').classed('loading', false);
    }
    analytics.track('download/shp');
}

function allProperties(properties, key, value) {
    properties[key] = value;
    return true;
}
