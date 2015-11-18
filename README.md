React Packery Mixin
===================

#### Introduction:
A mixin for React.js to use Metafizzy Packery (Also available as a [component](https://github.com/eiriklv/react-packery-component) - you should use that instead!)

#### Which version should I use?
React Packery Mixin 0.2.x is compatible with React 0.14 and above only. For older versions of React, use a 0.1.x version of React Packery Mixin.

#### Usage:

* The mixin is bundled with packery, so no additional dependencies needed!
* You can optionally include Packery as a script tag as an override
`<script src='//cdnjs.cloudflare.com/ajax/libs/packery/1.3.0/packery.pkgd.min.js' />`

* To use the mixin
 * require the mixin
 * pass a reference and a packery options object
 * make sure you use the same reference as `ref` in your component
 * if you need to - access the packery object through `this.packery` in your component

* example use in code

```js
/** @jsx React.DOM */

'use strict';

var React = require('react');

var PackeryMixin = require('react-packery-mixin');

var packeryOptions = {
    transitionDuration: 0
};

module.exports = React.createClass({
    displayName: 'SomeComponent',

    mixins: [PackeryMixin('packeryContainer', packeryOptions)],

    render: function () {
        var childElements = this.props.elements.map(function(element){
           return (
                <div className="someclass">
                    {element.name}
                </div>
            );
        });

        return (
            <div ref="packeryContainer">
                {childElements}
            </div>
        );
    }
});
```

# License information (Metafizzy)

## Commercial license

Packery may be used in commercial projects and applications with the one-time purchase of a commercial license. If you are paid to do your job, and part of your job is implementing Packery, a commercial license is required.

http://packery.metafizzy.co/license.html

For non-commercial, personal, or open source projects and applications, you may use Packery under the terms of the [GPL v3 License](http://choosealicense.com/licenses/gpl-v3/). You may use Packery for free.

---

Copyright (c) 2014 Metafizzy
