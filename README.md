ui-iframe
==========

A core JavaScript dynamic iframe which automatically grows/shrinks to accommodate height adjustments of its contents - appearing seamless and without the need of scrollbars

### Implementation

These 2 lines of code will insert a dynamic iframe into the DOM. The iframe is created wherever this script is added.
Reference the content to be loaded into the iframe via the data-url attribute. This can be local or remote content.
```html
<script src="js/dynamic.iframe.js" data-url="embedded.html"></script>
<noscript><iframe src="embedded.html" frameborder="0"></iframe></noscript>
```

Within the embedded HTML, add the following line of code to the end of the body tag.
```html
<script src="js/dynamic.iframe.handler.js"></script>
```

### Examples
http://ui.developedby.me/iframe/
