var importPanel = require('./import'),
    githubBrowser = require('github-file-browser')(d3),
    qs = require('qs-hash'),
    detectIndentationStyle = require('detect-json-indent');

module.exports = function(context) {

    function render(selection) {

        var container = d3.select('#add');
            container
                .html('')
                .classed('active', true);

        var sources = [{
            title: 'Import',
            alt: 'CSV, KML, GPX, and other filetypes',
            containerHeight: 'row6',
            action: clickImport
        }, {
            title: 'GitHub',
            alt: 'GeoJSON files in GitHub Repositories',
            authenticated: true,
            containerHeight: 'row10',
            action: clickGitHub
        }, {
            title: 'Gist',
            alt: 'GeoJSON files in GitHub Gists',
            authenticated: true,
            containerHeight: 'row10',
            action: clickGist
        }];

        var contain = container.append('div')
            .attr('class', 'col6 margin3 pad2y clearfix');

       var tabs = contain.append('div')
            .attr('class', 'tabs clearfix');

       var $sources = tabs
           .selectAll('a')
            .data(sources)
            .enter()
            .append('a')
            .attr('href', '#')
            .classed('disabled', function(d) {
                return d.authenticated && !context.user.token();
            })
            .attr('class', 'col4')
            .text(function(d) {
                return ' ' + d.title;
            })
            .attr('title', function(d) { return d.alt; })
            .on('click', function(d) {
                d3.event.preventDefault();
                if (d.authenticated && !context.user.token()) {
                    return alert('Log in to load GitHub files and Gists');
                }

                if (d.containerHeight) {
                    var current = container.attr('class').match(/row[0-9]+/);
                    if (current && current !== d.containerHeight) container.classed(current[0], false);
                    container.classed(d.containerHeight, true);
                }

                var that = this;
                $sources.classed('active', function() {
                    return that === this;
                });

                d.action.apply(this, d);
            });

        container.append('a')
            .attr('class', 'big quiet icon x pin-right')
            .attr('href', '#')
            .on('click', function() {
                d3.event.preventDefault();
                d3.select('.active.module').classed('active', false);
            });

        var $panes = container.append('div')
            .attr('class', 'fl col12 panes');

        function clickGitHub() {
            $panes
                .html('')
                .append('div')
                .attr('class', 'repos')
                .call(githubBrowser
                    .gitHubBrowse(context.user.token(), {
                        sort: function(a, b) {
                            return new Date(b.pushed_at) - new Date(a.pushed_at);
                        }
                    }).on('chosen', context.data.parse));
        }

        function clickImport() {
            $panes
                .html('')
                .append('div')
                .call(importPanel(context));
        }

        function clickGist() {
            $panes
                .html('')
                .append('div')
                .attr('class', 'browser pad1')
                .call(githubBrowser
                    .gistBrowse(context.user.token(), {
                        sort: function(a, b) {
                            return new Date(b.updated_at) - new Date(a.updated_at);
                        }
                    }).on('chosen', context.data.parse));
        }

        $sources.filter(function(d, i) { return !i; }).trigger('click');
    }

    return render;
};
