var table = require('../panel/table'),
    json = require('../panel/json'),
    help = require('../panel/help');

module.exports = function(context, pane) {
    return function(selection) {

        var mode = null;

        var buttonData = [{
            title: ' Table',
            alt: 'Edit feature properties in a table',
            behavior: table
        }, {
            title: ' JSON',
            alt: 'JSON Source',
            behavior: json
        }, {
            title: ' Help',
            alt: 'Help',
            behavior: help
        }];

        var tabs = selection
            .selectAll('a')
            .data(buttonData)
            .enter()
            .append('a')
            .attr('href', '#')
            .text(function(d) { return d.title; })
            .attr('title', function(d) { return d.alt; })
            .attr('class', 'col4')
            .on('click', function(d) {
                d3.event.preventDefault();

                var that = this;
                tabs.classed('active', function() {
                    return that === this;
                });

                if (mode) mode.off();
                mode = d.behavior(context);
                pane.call(mode);
            });

        d3.select(tabs.node()).trigger('click');
    };
};
