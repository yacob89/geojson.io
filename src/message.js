function message(selection) {
    'use strict';

    selection
        .html('')
        .classed('active', true);

    selection.append('a')
        .attr('href', '#')
        .attr('class', 'icon x pin-right quiet pad1')
        .on('click', function() {
            d3.event.preventDefault();
            selection.classed('active', false);
        });

    selection.append('div')
        .attr('class', 'content pad1 small strong quiet');

    return selection;
}

module.exports = message;
