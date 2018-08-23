var qs = require('qs-hash'),
    zoomextent = require('../lib/zoomextent'),
    flash = require('../ui/flash');

var dataURL;
const axios = require('axios');

const REMOTE_SERVER_URL = 'http://54.245.202.137';
//const REMOTE_SERVER_URL = 'http://192.168.1.11';

module.exports = function(context) {

    function success(err, d) {
        context.container.select('.map').classed('loading', false);

        var message,
            url = /(http:\/\/\S*)/g;

        if (err) {
            try {
                message = err.message || JSON.parse(err.responseText).message
                    .replace(url, '<a href="$&">$&</a>');
            } catch(e) {
                message = 'Sorry, an error occurred.';
            }
            return flash(context.container, message);
        }

        context.data.parse(d);

        if (!qs.stringQs(location.hash.substring(1)).map || mapDefault()) {
            zoomextent(context);
        }
    }

    function mapDefault() {
        return context.map.getZoom() == 2 || context.map.getCenter().equals(new L.LatLng(20, 0));
    }

    function inlineJSON(data) {
        try {
            context.data.set({
                map: JSON.parse(data)
            });
            location.hash = '';
            zoomextent(context);
        } catch(e) {
            return flash(context.container, 'Could not parse JSON');
        }
    }

    function loadUrl(data) {
        console.log('Data URL adalah: ', data);
        dataURL = data;
        d3.json(data)
            .header('Accept', 'application/vnd.geo+json')
            .on('load', onload)
            .on('error', onerror)
            .get();

        function onload(d) {
            context.data.set({ map: d });
            location.hash = '';
            zoomextent(context);
        }

        function onerror() {
            return flash(context.container, 'Could not load external file. External files must be served with CORS and be valid GeoJSON.');
        }
    }

    return function(query) {
        if (!query.id && !query.data) return;

        var oldRoute = d3.event ? qs.stringQs(d3.event.oldURL.split('#')[1]).id :
            context.data.get('route');

        if (query.data) {
            var type = query.data.match(/^(data\:[\w\-]+\/[\w\-]+\,?)/);
            if (type) {
                if (type[0] == 'data:application/json,') {
                    inlineJSON(query.data.replace(type[0], ''));
                } else if (type[0] == 'data:text/x-url,') {
                    loadUrl(query.data.replace(type[0], ''));
                }
            }
        } else if (query.id !== oldRoute) {
            context.container.select('.map').classed('loading', true);
            context.data.fetch(query, success);
        }
    };
};

module.exports.geturl = function(context) {
  console.log('Tes oper fungsi: ', dataURL);

  var filenameIndex = dataURL.lastIndexOf('/');
  var filename = dataURL.slice(filenameIndex + 1);

  var usernameIndex = dataURL.lastIndexOf('amazonaws.com');
  var username = dataURL.slice(usernameIndex + 14, filenameIndex);

  console.log('Index Filename: ', filenameIndex);
  console.log('String Filename: ', filename);

  console.log('Index Username: ', usernameIndex);
  console.log('String Username: ', username);

  axios
    .post(REMOTE_SERVER_URL + ':7555/api/normalupload', {
      username: username,
      filename: filename,
      geojson: context
    })
    .then(function(response) {
      console.log(response.data);
      if (response.data == 'success') {
        console.log('Server side converting success');
      }
    })
    .catch(function(error) {
      console.log('Server side converting error: ', error);
    });
};

module.exports.getfilename = function() {
    return dataURL;
};