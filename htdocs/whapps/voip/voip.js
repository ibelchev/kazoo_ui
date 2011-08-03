// This is the VoIP Services base application
winkstart.module('voip', 'voip', {
        css: {
                voip: 'voip.css'
        },
        templates: {
                voip: 'voip.html'
        },

        resources: {
            "shared_auth": {
                url: winkstart.apps['voip']['api_url'] + '/shared_auth', //'http://apps002-dev-ord.2600hz.com:8000/v1/shared_auth',
                contentType: 'application/json',
                verb: 'PUT'
            },
        },
 
        subscribe: {
            'voip.activate' : 'activate'
        }
    },
    function() {
        var THIS = this;

        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'voip' });
    },
    {
        initialized :   false,
        modules :       ['account', 'media', 'device', 'callflow', 'conference', 'user', 'vmbox', 'menu', 'registration', 'resource', 'timeofday'],
        
        activate: function() {
            var THIS = this;

            if(winkstart.apps['voip']['auth_token']) {
                winkstart.registerResources(this.__whapp, this.config.resources);

                //TODO: dynamic realm
                var form_data = { 'shared_token': winkstart.apps['voip']['auth_token'], 'realm': 'testxav.pbx.2600hz.com' };
                var rest_data = {};
                rest_data.crossbar = true;
                rest_data.data = form_data;

                winkstart.putJSON('shared_auth', rest_data, function (json, xhr) {
                    winkstart.apps['voip']['auth_token'] = json.auth_token;
                    if (!THIS.initialized) {

                        // Load the modules
                        $.each(THIS.modules, function(k, v) {
                            winkstart.module.loadModule('voip', v, function() {
                                this.init(function() {
                                    winkstart.log('VoIP: Initialized ' + v);
                                });
                            });
                        });
                        
                        // Display the navbar
                        $('#ws-content').empty();
                        THIS.templates.voip.tmpl({}).appendTo( $('#ws-content') );

                        // Link the main buttons
                        $('.options #users').click(function() {
                            winkstart.publish('user.activate');
                        });

                        $('.options #devices').click(function() {
                            winkstart.publish('device.activate');
                        });

                        $('.options #users').click(function() {
                            winkstart.publish('user.activate');
                        });

                        $('.options #auto_attendant').click(function() {
                            winkstart.publish('menu.activate');
                        });

                        $('.options #ring_groups').click(function() {
                            winkstart.publish('callflow.activate');
                        });

                        $('.options #conferences').click(function() {
                            winkstart.publish('conference.activate');
                        });

                        $('.options #registrations').click(function() {
                            winkstart.publish('registration.activate');
                        });

                        $('.options #stats').click(function() {
                            winkstart.publish('stats.activate');
                        });

                        $('.options #time_of_day').click(function() {
                            winkstart.publish('timeofday.activate');
                        });
                        
                        THIS.initialized = true;
                    }
                });
            
            }

            //winkstart.registerResources(this.config.resources);

            //winkstart.publish('layout.updateLoadedModule', {label: 'Device Management', module: this.__module});

        }
    }
);
