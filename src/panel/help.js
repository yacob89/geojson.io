var fs = require('fs');

module.exports = function(context) {

    function render(selection) {
        var area = selection
            .html('')
            .append('div')
            .attr('class', 'pad2 col8 margin2 row7 scroll keyline-all prose')
            .html(fs.readFileSync('data/help.html'));
    }

    render.off = function() {
    };

    return render;
};
