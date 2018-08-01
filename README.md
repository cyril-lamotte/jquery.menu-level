# jQuery Menu Level

An accessible multi-level navigation for mobile.


## Features

* IE11+
* ARIA
* Back button
* A clone link of the parent link can be created inside de sublevel.


## Markup

```html
<script src="jquery.menu-level.js"></script>
```

```html
<nav class="nav" role="navigation">
  <ul>
    <li><a href="#">Lorem ipsum</a></li>
    <li><a href="#">Lorem ipsum</a></li>
    <li>
      <a href="#">Lorem ipsum</a>
      <ul>
        <li><a href="#">Lorem ipsum</a></li>
        <li><a href="#">Lorem ipsum</a></li>
        <li><a href="#">Lorem ipsum</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

## Theme

> [menu-level.scss](src/menu-level.scss)


## JavaScript

```js
$('.nav').menuLevel();
```

### Options

Options            | Type             | Description                             | Default
-------------------|------------------|-----------------------------------------|--------
prefix             | string           | Classes prefix                          | 'mlvl'
sublevel           | string           | CSS Selector for sublevel               | 'ul ul'
repeatParentInSub  | bool             | Create a button to go back in sublevels | true
backLabel          | bool or string   | Back button's label                     | 'parent' ('parent' or string)
backAriaLabel      | string           | Back button's aria label                | 'Retour'
onNav              | method           | Execute code after a level change       | function() {}


### Events

Events                   | Description
-------------------------|------------------------------------------------------------
go-to-first-panel.mlvl   | Hide all sublevels
destroy.mlvl             | Remove plugin
show.mlvl                | Show the sublevel (Apply to sublevels)
hide.mlvl                | Hide the sublevel (Apply to sublevels)
