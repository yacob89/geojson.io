var message = require('./message');

function flash(txt) {
    'use strict';

    var $flash = d3.select('#flash');
    var msg = message($flash);

    if (txt) msg.select('.content').html(txt);

    setTimeout(function() {
        $flash.classed('active', false);
    }, 5000);

    return msg;
}

module.exports = flash;
