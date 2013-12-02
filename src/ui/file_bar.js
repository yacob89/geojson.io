var share = require('./share'),
    sourcepanel = require('./source.js'),
    flash = require('./flash'),
    zoomextent = require('../lib/zoomextent'),
    readFile = require('../lib/readfile');

module.exports = function fileBar(context) {

    function bar(selection) {

        var name = selection.append('div')
            .attr('class', 'col8 center pad1 small space strong quiet');

        var filename = name.append('a')
            .attr('class', 'quiet')
            .attr('href', '#')
            .text('unsaved');

        var link = name.append('a')
            .attr('target', '_blank')
            .attr('class', 'icon share')
            .attr('href', '#')
            .classed('active', true)
            .on('click', function() {
                d3.event.preventDefault();
                activeDrawer();
                context.container.call(share(context));
            });

        var actions = [{
            title: 'Edit',
            klass: 'pencil col6',
            action: function() {
                d3.select('#edit').classed('active', true);
            }
        }, {
            title: 'Add',
            klass: 'plus col6',
            action: function() {
                context.container.call(sourcepanel(context));
            }
        }];

        function activeDrawer() {
            d3.select('.module.active').classed('active', false);
        }

        var nav = selection.append('div')
            .attr('class', 'col4 row1 pill unround')
            .selectAll('a')
            .data(actions)
            .enter()
            .append('a')
            .attr('href', '#')
            .text(function(d) { return d.title; })
            .attr('class', function(d) {
                return d.klass + ' icon button';
            })
            .on('click', function(d) {
                d3.event.preventDefault();

                activeDrawer();
                d.action.apply(this, d);
            });

        context.dispatch.on('change.filebar', onchange);

        function onchange(d) {
            var data = d.obj,
                type = data.type,
                path = data.path;
            filename
                .text(path ? path : 'unsaved')
                .attr('href', data.url)
                .attr('target', '_blank')
                .classed('deemphasize', context.data.dirty);
        }

    }

    return bar;
};
