var share = require('./share'),
    sourcepanel = require('./source.js'),
    flash = require('./flash'),
    zoomextent = require('../lib/zoomextent'),
    readFile = require('../lib/readfile');

module.exports = function fileBar(context) {

    function bar(selection) {

        var name = selection.append('div')
            .attr('class', 'col8 center pad1 small space strong quiet');

        var filename = name.append('span')
            .attr('class', 'filename')
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

        function sourceIcon(type) {
            if (type == 'github') return 'icon-github';
            else if (type == 'gist') return 'icon-github-alt';
            else return 'icon-file-alt';
        }

        function saveNoun(_) {

            // TODO Rework this when save is moved.
            nav.filter(function(b) {
                return b.title === 'Save';
            }).select('span.title').text(_);
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
                .classed('deemphasize', context.data.dirty);
            filetype
                .attr('href', data.url)
                .attr('class', sourceIcon(type));
            saveNoun(type == 'github' ? 'Commit' : 'Save');
        }

    }

    return bar;
};
