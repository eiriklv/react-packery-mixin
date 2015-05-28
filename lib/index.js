var isBrowser = (typeof document !== 'undefined');
var Packery = isBrowser ? window.Packery || require('packery') : null;
var imagesloaded = isBrowser ? require('imagesloaded') : null;

function PackeryMixin() {
    return function(reference, options) {
        return {
            packery: false,

            domChildren: [],

            initializePackery: function(force) {
                if (!this.packery || force) {
                    this.packery = new Packery(this.refs[reference].getDOMNode(), options);
                    this.domChildren = this.getNewDomChildren();
                }
            },

            getNewDomChildren: function () {
                var node = this.refs[reference].getDOMNode();
                var children = options.itemSelector ? node.querySelectorAll(options.itemSelector) : node.children;

                return Array.prototype.slice.call(children);
            },

            diffDomChildren: function() {
                var oldChildren = this.domChildren;
                var newChildren = this.getNewDomChildren();

                var removed = oldChildren.filter(function(oldChild) {
                    return !~newChildren.indexOf(oldChild);
                });

                var added = newChildren.filter(function(newChild) {
                    return !~oldChildren.indexOf(newChild);
                });

                var moved = [];

                if (removed.length === 0) {
                    moved = oldChildren.filter(function(child, index) {
                        return index !== newChildren.indexOf(child);
                    });
                }

                this.domChildren = newChildren;

                return {
                    old: oldChildren,
                    'new': newChildren,
                    removed: removed,
                    added: added,
                    moved: moved
                };
            },

            performLayout: function() {
                var diff = this.diffDomChildren();

                if (diff.removed.length > 0) {
                    this.packery.remove(diff.removed);
                    this.packery.reloadItems();
                }

                if (diff.added.length > 0) {
                    this.packery.appended(diff.added);
                }

                if (diff.moved.length > 0) {
                    this.packery.reloadItems();
                }

                this.packery.layout();
            },

            imagesLoaded: function() {
                imagesloaded(this.refs[reference].getDOMNode(), function(instance) {
                    this.packery.layout();
                }.bind(this));
            },

            componentDidMount: function() {
                if (!isBrowser) return;

                this.initializePackery();
                this.performLayout();
                this.imagesLoaded();
            },

            componentDidUpdate: function() {
                if (!isBrowser) return;

                this.performLayout();
                this.imagesLoaded();
            },

            componentWillReceiveProps: function() {
                this._timer = setTimeout(function() {
                    this.packery.reloadItems();
                    this.forceUpdate();
                }.bind(this), 0);
            },

            componentWillUnmount: function() {
                clearTimeout(this._timer);
            }
        };
    }
}

module.exports = PackeryMixin();
