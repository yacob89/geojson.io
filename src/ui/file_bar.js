var share = require('./share'),
    sourcepanel = require('./source.js'),
    flash = require('./flash'),
    zoomextent = require('../lib/zoomextent'),
    readFile = require('../lib/readfile'),
    saver = require('../ui/saver.js');

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
            title: 'Save',
            icon: 'floppy',
            action: saveAction
        }, {
            title: 'Add',
            icon: 'plus',
            action: function() {
                context.container.call(sourcepanel(context));
            }
        }, {
            title: 'New',
            icon: 'plus',
            action: function() {
                window.open('/#new');
            }
        }];

        function activeDrawer() {
            d3.select('.nav-bar').classed('active', false);
        }

        function saveAction() {
            if (d3.event) d3.event.preventDefault();
            saver(context);
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
            .attr('class', 'col4 row1')
            .selectAll('a')
            .data(actions)
            .enter()
            .append('a')
            .attr('href', '#')
            .text(function(d) { return d.title; })
            .attr('class', function(d) {
                return d.icon + ' icon button unround';
            })
            .on('click', function(d) {
                d3.event.preventDefault();

                // TODO Kill this line when the title is removed
                if (d.title !== 'Save') activeDrawer();
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

        function blindImport() {
            var put = d3.select('body')
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
                    put.remove();
                });
            put.node().click();
        }

        function onImport(err, gj, warning) {
            if (gj && gj.features) {
                context.data.mergeFeatures(gj.features);
                if (warning) {
                    flash(context.container, warning.message);
                } else {
                    flash(context.container, 'Imported ' + gj.features.length + ' features.')
                        .classed('success', 'true');
                }
                zoomextent(context);
            }
        }

        d3.select(document).call(
            d3.keybinding('file_bar')
                .on('⌘+o', function() {
                    blindImport();
                    d3.event.preventDefault();
                })
                .on('⌘+s', saveAction));
    }

    return bar;
};
