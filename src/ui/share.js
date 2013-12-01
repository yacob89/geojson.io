var gist = require('../source/gist');
var download = require('../download');

module.exports = share;

function facebookUrl(_) {
    return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(_);
}

function twitterUrl(_) {
    return 'https://twitter.com/intent/tweet?source=webclient&text=' + encodeURIComponent(_);
}

function emailUrl(_) {
    return 'mailto:?subject=' + encodeURIComponent('My Map on geojson.io') + '&body=Here\'s the link: ' + encodeURIComponent(_);
}

function share(context) {
    return function(selection) {
        var container = d3.select('#share');
        container
            .html('')
            .classed('active', true);

        var sel = container.append('div')
            .attr('class', 'col6 margin3 pad4y clearfix');

        var networks = [{
            title: 'Twitter',
            klass: 'twitter col4',
            url: twitterUrl(location.href)
        }, {
            title: 'Facebook',
            klass: 'facebook col4',
            url: facebookUrl(location.href)
        }, {
            title: 'Email',
            klass: 'mail col4',
            url: emailUrl(location.href)
        }];

        var shareGroup = sel
            .append('div')
            .attr('class', 'clearfix col8 pad2r');

        var shareLinks = shareGroup
            .append('div')
            .attr('class', 'clearfix pill col12 space-bottom');

        shareLinks
            .selectAll('.network')
            .data(networks)
            .enter()
            .append('a')
            .attr('target', '_blank')
            .text(function(d) { return d.title; })
            .attr('class', function(d) { return d.klass + ' icon button'; })
            .attr('href', function(d) { return d.url; });

        var fieldset = shareGroup
            .append('fieldset')
            .attr('class', 'with-icon col12');

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
            .text('Use the url to embed the map on an html page.')
            .attr('class', 'pad1y small');

        var downloadActions = [{
            title: 'GeoJSON',
            action: function() {
                context.container.call(download.geoJSON(context));
            }
        }, {
            title: 'TopoJSON',
            action: function() {
                context.container.call(download.topo(context));
            }
        }, {
            icon: 'icon-code',
            title: 'KML',
            action: function() {
                context.container.call(download.kml(context));
            }
        }];

        if (typeof ArrayBuffer !== 'undefined') {
            downloadActions.push({
                title: 'Shapefile (beta)',
                action: function() {
                    context.container.call(download.shp(context));
                }
            });
        }

        var downloadGroup = sel
            .append('div')
            .attr('class', 'col4 pill')
            .selectAll('a')
            .data(downloadActions)
            .enter()
            .append('a')
            .attr('class', 'download button loud icon down col12')
            .attr('href', '#')
            .text(function(d) { return d.title; })
            .on('click', function(d) {
                d3.event.preventDefault();
                d.action.apply(this, d);
            });

        sel.append('a')
            .attr('class', 'big quiet icon x pin-right')
            .attr('href', '#')
            .on('click', function() {
                d3.event.preventDefault();
                d3.select('.active.module').classed('active', false);
            });

        gist.saveBlocks(context.data.get('map'), function(err, res) {
            if (err) return;
            if (res) {
                embed_html.property('value',
                    '<iframe ' +
                    'src="http://bl.ocks.org/d/' + res.id + '" ' +
                    'frameborder="0" width="100%" height="300">' +
                    '</iframe>');
            }
        });
    };
}
