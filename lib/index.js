var isBrowser = (typeof window !== 'undefined');
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
                }
            },

            diffDomChildren: function() {
                var oldChildren = this.domChildren;
                var newChildren = Array.prototype.slice.call(this.refs[reference].getDOMNode().children);

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
                    new: newChildren,
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
                setTimeout(function() {
                    this.forceUpdate();
                }.bind(this), 0);
            }
        };
    };
}

module.exports = PackeryMixin();
