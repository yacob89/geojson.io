var importSupport = !!(window.FileReader),
    flash = require('./flash.js'),
    geocode = require('./geocode.js'),
    readFile = require('../lib/readfile.js'),
    zoomextent = require('../lib/zoomextent');

module.exports = function(context) {
    return function(selection) {
        selection.html('');

        var sel = selection
            .append('div')
            .attr('class', 'col12 center animate pad2y');

        if (importSupport) {
            var button = sel.append('a')
                .attr('href', '#')
                .attr('class', 'button icon plus col2 margin5 space-bottom')
                .text('Import')
                .on('click', function() {
                    d3.event.preventDefault();
                    fileInput.node().click();
                });

            var message = sel
                .append('div')
                .attr('class', 'col12 fl');

            message.append('p')
                .append('p')
                .text('GeoJSON, TopoJSON, KML, CSV, GPX and OSM XML supported. You can also drag & drop files.');

            var fileInput = message
                .append('input')
                .attr('type', 'file')
                .style('visibility', 'hidden')
                .style('position', 'absolute')
                .style('height', '0')
                .on('change', function() {
                    var files = this.files;
                    if (!(files && files[0])) return;
                    readFile.readAsText(files[0], function(err, text) {
                        readFile.readFile(files[0], text, onImport);
                    });
                });
        } else {
            sel.append('p')
                .attr('class', 'col12 pad1y')
                .text('Sorry, geojson.io supports importing GeoJSON, TopoJSON, KML, CSV, GPX, and OSM XML files, but ' +
                      'your browser isn\'t compatible. Please use Google Chrome, Safari 6, IE10, Firefox, or Opera for an optimal experience.');
        }

        function onImport(err, gj, warning) {
            if (err) {
                if (err.type === 'geocode') {
                    wrap.call(geocode(context), err.raw);
                } else if (err.message) {
                    flash(err.message)
                        .classed('error', 'true');
                }
            } else if (gj && gj.features) {
                context.data.mergeFeatures(gj.features);
                if (warning) {
                    flash(warning.message);
                } else {
                    flash('Imported ' + gj.features.length + ' features.')
                        .classed('success', 'true');
                }
                zoomextent(context);
            }
        }
    };
};
