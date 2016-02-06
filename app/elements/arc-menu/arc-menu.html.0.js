<<<<<<< HEAD:app/elements/arc-menu/arc-menu.html.0.js

=======
<dom-module id="arc-menu">
    <template>
        <style>
        :host {
            display: block;
        }
        
        .sublist {
            padding-left: 20px;
            padding-right: 20px;
        }
        </style>
        <paper-menu selected="{{hash}}" attr-for-selected="data-place" on-tap="_itemTap">
            <paper-item data-place="#RequestPlace:default">Request</paper-item>
            <paper-item data-place="#SocketPlace:default">Socket</paper-item>
            <paper-submenu>
                <paper-item class="menu-trigger">Projects</paper-item>
                <paper-menu class="menu-content sublist" selected="{{hash}}" attr-for-selected="data-place" on-tap="_itemTap">
                    <template is="dom-if" if="{{!hasProjects}}">
                        <paper-item>No projects here</paper-item>
                    </template>
                    <template is="dom-repeat" items="{{projects}}" sort="{{computeSort(projects)}}">
                        <paper-item data-place$="{{_computeEnpointParameter(item.id)}}">{{item.name}}</paper-item>
                    </template>
                </paper-menu>
            </paper-submenu>
            <paper-item data-place="#SavedPlace:default">Saved</paper-item>
            <template is="dom-if" if="{{!noHistory}}">
                <paper-item data-place="#HistoryPlace:default">History</paper-item>
            </template>
            <paper-item data-place="#SettingsPlace:view">Settings</paper-item>
            <paper-item data-place="#AboutPlace:view">About</paper-item>
        </paper-menu>
    </template>
    <script>
>>>>>>> hotfix-db:RestClient/dev/components/arc-menu/arc-menu.html
    Polymer({
        is: 'arc-menu',
        properties: {
            route: String,
            baseUrl: String,
            _historyObserver: {
                type: Function,
                value: function() {
                    return this._onStorageChange.bind(this);
                }
            },
            projects: Array,
            noHistory: {
                type: Boolean,
                value: false
            },
            hasProjects: {
                type: Boolean,
                value: false,
                computed: '_computeHasProjects(projects.*)'
            }
        },
        ready: function() {
            try {
                this._observeHistoryEnabled();
                this._updateHistoryStatus();
            } catch (e) {
                console.error('Error occurred constructing the arc-menu', e);
                ga('legacy.send', 'exception', {
                    'exDescription': 'arc-menu::ready::' + e.message,
                    'exFatal': false
                });
            }
        },
        attached: function() {
            //this._restoreProjects();
            console.info('arc-menu has been attached');
        },
        
        _itemTap: function(e) {
            e = Polymer.dom(e);
            if (e.rootTarget.dataset.place) {
                page(e.rootTarget.dataset.place);
            }
        },
        _restoreProjects: function() {
            try {
                arc.app.db.projects.list()
                    .then(function(list) {
                        this.projects = list;
                    }.bind(this));
            } catch (e) {
                console.error('Error setting up storage listener', e);
                ga('legacy.send', 'exception', {
                    'exDescription': 'arc-menu::_restoreProjects::' + e.message,
                    'exFatal': false
                });
            }
        },
        _observeHistoryEnabled: function() {
            try {
                chrome.storage.onChanged.addListener(this._historyObserver);
            } catch (e) {
                console.error('Error setting up storage listener', e);
                ga('legacy.send', 'exception', {
                    'exDescription': 'arc-menu::_observeHistoryEnabled::' + e.message,
                    'exFatal': false
                });
            }
        },
        computeSort: function(projects) {
            return function(a, b) {
                if (!a || !b) {
                    return 1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name === b.name) {
                    return 0;
                }
            };
        },
        _computeEnpointParameter: function(id) {
            return this.baseUrl + 'project/' + id;
        },
        /** 
         * Update project name in the UI.
         *
         * @param {Number} projectId A project id from the database
         * @param {String} projectName Project new name
         */
        updateProjectName: function(projectId, projectName) {
            if (this.project === null) {
                console.warn('Trying to update a project name when project list is empty. ' +
                    'Try insert new project first.');
                return;
            }
            var context = this;
            this.projects.forEach(function(project, i) {
                if (project.id === projectId) {
                    context.set('projects.' + i + '.name', projectName);
                }
            });
        },
        /**
         * Add newly created project to the list.
         *
         * @param {Number} projectId Database id for the project
         */
        appendProject: function(projectId) {
            arc.app.db.projects.getProject(projectId)
                .then(function(project) {
                    if (project === null) {
                        console.warn('No project found for given ID ', projectId);
                        return;
                    }
                    this.push('projects', project);
                }.bind(this));
        },
        /**
         * Remove project from the UI.
         */
        removeProject: function(projectId) {
            if (this.project === null) {
                console.warn('Trying to remove a project when project list is empty. ' +
                    'Try insert new project first.');
                return;
            }
            var context = this;
            this.projects.forEach(function(project, i) {
                if (project.id === projectId) {
                    context.splice('projects', i, 1);
                }
            });
        },

        _updateHistoryStatus: function() {
            try {
                chrome.storage.sync.get({
                    HISTORY_ENABLED: true
                }, function(result) {
                    if (!result.HISTORY_ENABLED) {
                        this.noHistory = true;
                    } else {
                        this.noHistory = false;
                    }
                });
            } catch (e) {
                console.error('Error setting up storage listener', e);
                ga('legacy.send', 'exception', {
                    'exDescription': 'arc-menu::_updateHistoryStatus::' + e.message,
                    'exFatal': false
                });
            }
        },

        _onStorageChange: function(change) {
            var keys = Object.keys(change);
            if (keys.indexOf('HISTORY_ENABLED') !== -1) {
                if (!change.HISTORY_ENABLED.newValue) {
                    this.noHistory = true;
                } else {
                    this.noHistory = false;
                }
            }
        },

        _computeHasProjects: function() {
            if (this.projects && this.projects.length) {
                return true;
            }
            return false;
        }
    });
    