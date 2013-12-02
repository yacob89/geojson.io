module.exports = function(context) {
    return function(e) {
        var sel = d3.select(e.popup._contentNode);

        sel.selectAll('.cancel')
            .on('click', function() {
                d3.event.preventDefault();
                clickClose();
            });

        sel.selectAll('.save')
            .on('click', function() {
                d3.event.preventDefault();
                saveFeature();
            });

        sel.selectAll('.add')
            .on('click', function() {
                d3.event.preventDefault();
                addRow();
            });

        sel.selectAll('.delete-invert')
            .on('click', function() {
                d3.event.preventDefault();
                removeFeature();
            });

        function clickClose() {
            context.map.closePopup(e.popup);
        }

        function removeFeature() {
            if (e.popup._source && context.mapLayer.hasLayer(e.popup._source)) {
                context.mapLayer.removeLayer(e.popup._source);
                context.data.set({map: context.mapLayer.toGeoJSON()}, 'popup');
            }
        }

        function losslessNumber(x) {
            var fl = parseFloat(x);
            if (fl.toString() === x) return fl;
            else return x;
        }

        function saveFeature() {
            var obj = {};
            sel.selectAll('tr').each(collectRow);
            function collectRow() {
                if (d3.select(this).selectAll('input')[0][0].value) {
                    obj[d3.select(this).selectAll('input')[0][0].value] =
                        losslessNumber(d3.select(this).selectAll('input')[0][1].value);
                }
            }
            e.popup._source.feature.properties = obj;
            context.data.set({map: context.mapLayer.toGeoJSON()}, 'popup');
            context.map.closePopup(e.popup);
        }

        function addRow() {
            var row = sel.select('ul')
                .append('li')
                .attr('class', 'col12');

            row.append('input')
                .attr('placeholder', 'Key')
                .attr('class', 'col6')
                .attr('type', 'text');

            row.append('input')
                .attr('placeholder', 'Value')
                .attr('class', 'col6')
                .attr('type', 'text');
        }
    };
};
