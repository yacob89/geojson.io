var verticalPanel = require('./vertical_panel'),
    gist = require('./source/gist'),
    github = require('./source/github'),
    importPanel = require('./import_panel').importPanel,
    githubBrowser = require('github-file-browser')(d3),
    detectIndentationStyle = require('detect-json-indent');

module.exports = sourcePanel;

function sourcePanel(updates) {

    function panel(selection) {

        if (!selection.classed('active')) return hidePanel();

        var sources = [
            {
                title: 'Import',
                alt: 'CSV, KML, GPX, and other filetypes',
                icon: 'icon-cog',
                action: clickImport
            },
            {
                title: 'GitHub',
                alt: 'GeoJSON files in GitHub Repositories',
                icon: 'icon-github',
                action: clickGitHub
            },
            {
                title: 'Gist',
                alt: 'GeoJSON files in GitHub Gists',
                icon: 'icon-github-alt',
                action: clickGist
            }
        ];

        selection
            .html('')
            .classed('active', false);

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

        $top.append('div')
            .attr('class', 'col2')
            .append('div')
            .attr('class', 'pad1 center clickable')
            .on('click', hidePanel)
            .append('span')
            .attr('class', function(d) {
                return 'icon-remove';
            });

        function hidePanel(d) {
            selection.classed('active', true);
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
                hidePanel();
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
                hidePanel();
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
                hidePanel();
            }
        }

        $sources.filter(function(d, i) { return !i; }).trigger('click');
    }

    return panel;
}
