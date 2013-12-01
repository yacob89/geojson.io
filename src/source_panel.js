var verticalPanel = require('./vertical_panel'),
    gist = require('./source/gist'),
    github = require('./source/github'),
    importPanel = require('./import_panel').importPanel,
    githubBrowser = require('github-file-browser')(d3),
    detectIndentationStyle = require('detect-json-indent');

module.exports = sourcePanel;

function sourcePanel(updates) {
    function panel(selection) {
        selection
            .html('')
            .classed('active', true);

        var sources = [
            {
                title: 'Import',
                alt: 'CSV, KML, GPX, and other filetypes',
                action: clickImport
            },
            {
                title: 'GitHub',
                alt: 'GeoJSON files in GitHub Repositories',
                action: clickGitHub
            },
            {
                title: 'Gist',
                alt: 'GeoJSON files in GitHub Gists',
                action: clickGist
            }
        ];

        selection.append('a')
            .attr('class', 'big quiet icon close pin-right')
            .attr('href', '#')
            .on('click', function() {
                d3.event.preventDefault();
                d3.select('.nav-bar').classed('active', true);
                d3.select('.module.active').classed('active', false);
            });

        var $top = selection
            .append('div')
            .attr('class', 'col12 pad2y clearfix');

       var $sources = $top.append('div')
            .attr('class', 'tabs col6 margin3 clearfix')
            .selectAll('a')
            .data(sources)
            .enter()
            .append('a')
            .attr('href', '#')
            .attr('class', 'col4')
            .attr('title', function(d) { return d.alt; })
            .text(function(d) { return d.title; })
            .on('click', clickSource);

        function clickSource(d) {
            var that = this;
            $sources.classed('active', function() {
                return that === this;
            });
            d.action.apply(this, d);
        }

        var $subpane = selection.append('div')
            .attr('class', 'subpane');

        function clickGitHub() {
            $subpane
                .html('')
                .append('div')
                .attr('class', 'repos')
                .call(githubBrowser
                    .gitHubBrowse(localStorage.github_token)
                        .on('chosen', gitHubChosen));

            function gitHubChosen(d) {
                var hash = github.urlHash(d);
                location.hash = hash.url;
            }
        }

        function clickImport() {
            $subpane
                .html('')
                .append('div')
                .call(importPanel, updates);

            function gitHubChosen(d) {
                var hash = github.urlHash(d);
                location.hash = hash.url;
            }
        }

        function clickGist() {
            $subpane
                .html('')
                .append('div')
                .attr('class', 'browser pad1')
                .call(githubBrowser
                    .gistBrowse(localStorage.github_token)
                        .on('chosen', gistChosen));

            function gistChosen(d) {
                var hash = gist.urlHash(d);
                location.hash = hash.url;
            }
        }

        $sources.filter(function(d, i) { return !i; }).trigger('click');
    }

    return panel;
}
