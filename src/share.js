var gist = require('./source/gist');

module.exports = share;

function facebookUrl(_) {
    return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(_);
}

function twitterUrl(_) {
    return 'https://twitter.com/intent/tweet?source=webclient&text=' + encodeURIComponent(_);
}

function emailUrl(_) {
    return 'mailto:?subject=' + encodeURIComponent('My Map on geojson.io') +
        '&body=Here\'s the link: ' + encodeURIComponent(_);
}

function downloadGeoJSON(features) {
    var content = JSON.stringify({
        type: 'FeatureCollection',
        features: features
    }, null, 4);

    if (content) {
        saveAs(new Blob([content], {
            type: 'text/plain;charset=utf-8'
        }), 'map.geojson');
    }
}

function share(container, features) {
    'use strict';
    var container = d3.select('#share');
    container
        .html('')
        .classed('active', true);

    var selection = container
        .append('div')
        .attr('class', 'col6 margin3 pad4y clearfix');

    var networks = [
        {
            title: 'Twitter',
            klass: 'twitter col4',
            url: twitterUrl(location.href)
        },
        {
            title: 'Facebook',
            klass: 'facebook col4',
            url: facebookUrl(location.href)
        },
        {
            title: 'Email',
            klass: 'mail col4',
            url: emailUrl(location.href)
        }
    ];

    var shareLinks = selection
        .append('div')
        .attr('class', 'clearfix pill col8 space-bottom');

    shareLinks
        .selectAll('.network')
        .data(networks)
        .enter()
        .append('a')
        .attr('target', '_blank')
        .attr('class', function(d) { return d.klass + ' icon button'; })
        .attr('href', function(d) { return d.url; })
        .text(function(d) { return d.title; });

    var download = selection
        .append('a')
        .attr('href', '#')
        .attr('class', 'icon down button loud col3 margin1')
        .text('Download')
        .on('click', function() {
            d3.event.preventDefault();
            downloadGeoJSON(features);
        });

    var fieldset = selection
        .append('fieldset')
        .attr('class', 'with-icon col8');

    fieldset
        .append('span')
        .attr('class', 'icon share');

    var embed_html = fieldset
        .append('input')
        .attr('type', 'text')
        .attr('readonly', true)
        .attr('class', 'col12')
        .attr('placeholder', 'Embed HTML')
        .on('click', function() {
            this.select();
        });

    fieldset
        .append('p')
        .text('Use the URL to embed the map on an HTML page.')
        .attr('class', 'pad1y small')

    selection.append('a')
        .attr('class', 'big quiet icon close pin-right')
        .attr('href', '#')
        .on('click', function() {
            d3.event.preventDefault();
            d3.select('.nav-bar').classed('active', true);
            d3.select('.active.module').classed('active', false);
        });

    gist.saveBlocks(JSON.stringify({
        type: 'FeatureCollection',
        features: features
    }), function(err, res) {
        if (err) return;
        if (res) {
            embed_html.property('value',
                '<iframe frameborder="0" width="100%" height="300" ' +
                'src="http://bl.ocks.org/d/' + res.id + '"></iframe>');
        }
    });
}
