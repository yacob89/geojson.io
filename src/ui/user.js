var saver = require('../ui/saver.js');

module.exports = function(context) {
    return function(selection) {
        function nextLogin() {
            name
                .text('Anon')
                .attr('href', '#')
                .on('click', login)
                .on('mouseover', function() {
                    name.text('login');
                })
                .on('mouseout', function() {
                    name.text('Anon');
                });
        }

        var actions = [{
            title: 'Save',
            klass: 'floppy round-left keyline-right',
            action: saveAction
        }, {
            title: 'New',
            klass: 'plus',
            action: function() {
                window.open('/#new');
            }
        }];

        var actionLinks = selection.append('div')
            .attr('class', 'col6 keyline-right user-actions')
            .selectAll('a')
            .data(actions)
            .enter()
            .append('a')
            .attr('href', '#')
            .attr('data-original-title', function(d) {
                return d.title;
            })
            .on('click', function(d) {
                d3.event.preventDefault();
                d.action.apply(this, d);
            })
            .attr('class', function(d) {
                return d.klass + ' icon quiet pad1 col6';
            })
            .call(bootstrap.tooltip().placement('bottom'));

        var name = selection.append('a')
            .attr('class', 'col6 quiet truncate small strong pad1')
            .attr('href', '#');

        function nextLogout() {
            name
                .on('click', logout)
                .on('mouseover', function() {
                    name.text('logout');
                })
                .on('mouseout', function() {
                    context.user.details(function(err, d) {
                        if (err) return;
                        name.text(d.login);
                    });
                });
        }

        function login() {
            d3.event.preventDefault();
            context.user.authenticate();
        }

        function logout() {
            d3.event.preventDefault();
            context.user.logout();
            nextLogin();
        }

        function saveAction() {
            saver(context);
        }

        nextLogin();

        if (context.user.token()) {
            context.user.details(function(err, d) {
                if (err) return;
                name.text(d.login);
                nextLogout();
            });
        }
    };
};
