var smartZoom = require('../lib/smartzoom.js');

module.exports = function(context) {

    function search(selection) {
        var bounds = context.mapLayer.getBounds();
        var data = context.data;

        var query = new RegExp(prompt('Search for a feature:'), 'i');
        var matches = [];

        context.mapLayer.eachLayer(function(l) {
            var values = d3.map(l.feature.properties).values();
            var match = function(value) {
                return query.test(value);
            }
            if (values.filter(match).length) matches.push(l);
        });

        if (matches.length === 0) {
            console.log('No matches found.');
        }
        else if (matches.length === 1) {
            smartZoom(context.map, matches[0], bounds);
            matches[0].openPopup();
        } else {
            console.log(matches);
        }
    }

    d3.select(document).call(
        d3.keybinding()
            .on('⌘+f', search));

    return search;
};
