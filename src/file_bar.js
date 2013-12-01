var share = require('./share');

function fileBar(updates) {
    var event = d3.dispatch('source', 'save', 'share');

    function bar(selection) {
        updates.on('sourcechange', onSource);

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
                event.share();
            });

        var actions = [
            {
                title: 'Save',
                klass: 'col6 floppy keyline-right',
                action: function() {
                    event.save();
                }
            },
            {
                title: 'Add',
                klass: 'plus col6',
                action: function() {
                    d3.event.preventDefault();
                    event.source();
                }
            }
        ];

        var nav = selection.append('div')
            .attr('class', 'col4 row1')
            .selectAll('button')
            .data(actions)
            .enter()
            .append('a')
            .attr('href', '#')
            .attr('class', function(d) { return d.klass + ' icon button unround'; })
            .text(function(d) { return d.title; })
            .on('click', function(d) {
                d3.event.preventDefault();
                if (d.title !== 'Save') activeDrawer();
                d.action.apply(this, d);
            });

        function activeDrawer() {
            d3.select('.nav-bar').classed('active', false);
        }

        function sourceUrl(d) {
            switch(d.type) {
                case 'gist':
                    return d.data.html_url;
                case 'github':
                    return 'https://github.com/' + d.data.id;
            }
        }

        function saveNoun(_) {
            nav.filter(function(b) {
                return b.title === 'Save';
            }).select('span.title').text(_);
        }

        function onSource(d) {
            filename.text(d.name);
            saveNoun(d.type === 'github' ? 'Commit' : 'Save');

            // TODO Revise the url in the attribution
            // if (sourceUrl(d)) sourceUrl(d)
        }
    }

    return d3.rebind(bar, event, 'on');
}

module.exports = fileBar;
