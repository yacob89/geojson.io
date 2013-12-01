var buttons = require('./ui/mode_buttons'),
    file_bar = require('./ui/file_bar'),
    dnd = require('./ui/dnd'),
    userUi = require('./ui/user'),
    layer_switch = require('./ui/layer_switch'),
    saver = require('./ui/saver.js');

module.exports = ui;

function ui(context) {
    function init(selection) {
        var container = selection
            .append('div')
            .attr('class', 'container');

        var map = container
            .append('div')
            .attr('class', 'map')
            .call(context.map)
            .call(layer_switch(context));

        context.container = container;

        return container;
    }

    function render(selection) {
        var container = init(selection);

        var edit = d3.select('#edit');

        var top = edit
            .append('div')
            .attr('class', 'col6 margin3 pad2y clearfix');

        var pane = edit
            .append('div')
            .attr('class', 'col8 margin2 row10 scroll');

        top
            .append('div')
            .attr('class', 'tabs clearfix')
            .call(buttons(context, pane));

        edit.append('a')
            .attr('class', 'big quiet icon x pin-right')
            .attr('href', '#')
            .on('click', function() {
                d3.event.preventDefault();
                d3.select('.active.module').classed('active', false);
            });

        container
            .append('div')
            .attr('class', 'col6 margin3 pin-top fill-white nav-bar')
            .call(file_bar(context));

        container
            .append('div')
            .attr('class', 'pin-top center fill-white round user-nav')
            .call(userUi(context));

        dnd(context);

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

        function saveAction() {
            if (d3.event) d3.event.preventDefault();
            saver(context);
        }

        d3.select(document).call(
            d3.keybinding('file_bar')
                .on('⌘+o', function() {
                    blindImport();
                    d3.event.preventDefault();
                })
                .on('⌘+s', saveAction)
                .on('esc', function() {
                    d3.select('.module.active').classed('active', false);
                }));
    }


    return {
        read: init,
        write: render
    };
}
