# expander

See 💥[demo](https://goodleby.github.io/expander/demo/)💥 for visual examples.

Lightweight jQuery plugin for creating expanding blocks, so called accordions and/or dropdowns.

## How to install?

- Add `.css` file to `head` tag

  ```html
  <link href="yourPath/jquery.expander.min.css" rel="stylesheet" />
  ```

- Add `.js` file somewhere after **your jQuery** file

  ```html
  <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>

  <script src="yourPath/jquery.expander.min.js"></script>
  ```

## How to use?

- Firstly, we need structure we can work with

```html
<div class="accordion">
  <div class="accordion__head">Click for more info</div>
  <div class="accordion__body">
    Here's more info. Click heading again in order to close this content.
  </div>
</div>
```

- Secondly, we can init it either using javascript:

```javascript
$('.accordion').expander({
  toggle: '.accordion__head',
  body: '.accordion__body',
});
```

**Note:** You can pass just selector (as you've seen above), array of selectors or jQuery collection, all those methods will work fine.

- Or we can do the same by adding `data` attributes in the HTML:

```html
<div class="accordion" data-expander>
  <div class="accordion__head" data-toggle>Click for more info</div>
  <div class="accordion__body" data-body>
    Here's more info. Click heading again in order to close this content.
  </div>
</div>
```

**Note:** You can mix both methods any way you want. For example you can add `data-toggle` and `data-body` in HTML and just call function like:

```javascript
$('.accordion').expander();
```

This will init expander and settings `toggle` and `body` will be set from HTML.

- Success! Our expander is good to go :)

## How to connect expanders in one accordion?

In order to connect expanders in an accordion there are two methods:

- You can pass value to `data-expander`, like that `data-expander="my-class"`. So all expanders that have this particular class `my-class` will act as an accordion together.

- Or you can set `class` setting in javascript (read about customizing below), so all expanders affected will act as an accordion together. Example:

```javascript
$('.accordion').expander({
  toggle: '.accordion__head',
  body: '.accordion__body',
  class: 'my-class',
});
```

## How to customize?

- You can pass an object with additional options to the function, like that:

```javascript
$('.accordion').expander({
  toggle: '.accordion__head',
  body: '.accordion__body',
  animationDuration: 150,
  opened: true,
});
```

- Or you can add data attributes at HTML. Simply add `data-` before the option you want to set.

```html
<div class="accordion" data-expander data-animationDuration="150" data-opened="false">
  ...
</div>
```

**_Notes:_**

- Settings set in javascript will **override** options set by data attributes.

- In example above `data-expander` is used, but if you wish you can set options using data attributes, and init the block using javascript.

- Default settings are stored in `$.fn.expander.defaults` so you can change them, if you wish.

These are default options:

```javascript
$.fn.expander.defaults = {
  // Initial state of the expander
  opened: false,

  // Expander's connection with other expanders.
  // Used in order to create accordion.
  class: false,

  // Whether user can close the expander clicking on it's `toggle` or `close` elements.
  // Note: If it's an accordion, expanding other accordion elements still will be able to close it.
  closeable: true,

  // Whether to prevent default action clicking on `toggle`, `open` or `close`.
  // For example if it's a link, and default action is prevented browser won't open the link.
  preventDefault: true,

  // Callback will be fired when expander is opened.
  // Gets two arguments: event and expander (object with methods and options connected to the expander)
  onOpen: null,

  // Callback will be fired when expander is closed.
  // Gets two arguments: event and expander (object with methods and options connected to the expander)
  onClose: null,

  // Callback will be fired when expander is toggled.
  // Gets two arguments: event and expander (object with methods and options connected to the expander)
  onToggle: null,

  // Callback will be fired once expander is loaded.
  // Gets one arguments: expander (object with methods and options connected to the expander)
  onInit: null,

  // Speed of open/close animation
  animationDuration: 300,

  // Elements that will be shown/hidden
  // Can be: single selector, array of selectors, single element, array of elements, jQuery collection
  body: [],

  // Elements that will toggle shown/hidden states
  // Can be: single selector, array of selectors, single element, array of elements, jQuery collection
  toggle: [],

  // Elements that will toggle to shown state
  // Can be: single selector, array of selectors, single element, array of elements, jQuery collection
  open: [],

  // Elements that will toggle to closed state
  // Can be: single selector, array of selectors, single element, array of elements, jQuery collection
  close: [],

  // Whether expander is a dropdown (considered as completely different mode).
  dropdown: false,
};
```

## Tip

- You can customize your expander using **CSS classes** given by the plugin, for instance: `.opened`, `.mode-dropdown`, `.mode-accordion`, etc.
