(function( $ ){

  'use strict';

  /**
  * jQuery plugin menuLevel v1.1.0.
  */

  $.menuLevel = function(element, options) {

    // Default options.
    var defaults = {
      prefix: 'mlvl',
      sublevel: 'ul ul',
      repeatParentInSub: true,
      backLabel: 'parent',
      backAriaLabel: 'Retour',
      onNav: function() {}
    };

    var plugin = this,
        $element = $(element);

    plugin.settings = {};

    plugin.init = function() {

      // Include user's options.
      plugin.settings = $.extend({}, defaults, options);

      // Shortcuts for class & selector.
      plugin.class = plugin.settings.prefix;
      plugin.selector = '.' + plugin.settings.prefix;

      initHTML();
      initElementsShortcuts();
      initLevelsHTML();

      removeKeyboardFocusable();
      setLevelsEvents();
      setOtherEvents();

    };


    // Add markup and classes.
    var initHTML = function() {

      // Wrap all levels.
      // and add class on parents.
      $element
        .addClass('mlvl')
        .wrapInner('<div class="' + plugin.class + '__level ' + plugin.class + '__level--top"></div>')
        .find(plugin.settings.sublevel)
          .wrap('<div class="' + plugin.class + '__level ' + plugin.class + '__level--is-hidden" aria-hidden="true"></div>')
        .end()
          .find(plugin.selector + '__level').prev()
            .addClass(plugin.class + '__parent');

    };


    // Save shortcuts variables.
    var initElementsShortcuts = function() {

      // Save levels.
      plugin.$topLevel = $(plugin.selector + '__level--top');
      plugin.$subLevels = plugin.$topLevel.find(plugin.selector + '__level');

      // Links with sublevel.
      plugin.$menuTriggers = $element.find(plugin.selector +'__parent');

    };


    // Keyboard management.
    // Make all links unfocusable (except the first level).
    var removeKeyboardFocusable = function() {

      plugin.$subLevels
        .find('a, button')
          .attr('tabindex', '-1');

    };


    // Add markup and classes.
    var initLevelsHTML = function() {

      $.each(plugin.$subLevels, function(i, el) {

        var $sub = $(this);
        var backLabel = '';
        var backAriaLabel = plugin.settings.backAriaLabel;

        // Create clone links.
        if (plugin.settings.repeatParentInSub) {

          // Create new li.
          $('<li class="' + plugin.class + '__clone-item"></li>').prependTo($sub.find('> ul'));

          $sub.prev().clone().prependTo($sub.find('> ul > li.' + plugin.class + '__clone-item'))
            .removeClass(plugin.class + '__parent')
            .addClass(plugin.class + '__parent-clone');
        }

        // If there is no back label, get parent's label.
        if (plugin.settings.backLabel == 'parent') {
          backLabel = $sub.parents(plugin.selector + '__level').first().prev().text();

          if (!backLabel) {
            backLabel = 'Menu principal';
          }

        } else {
          backLabel = plugin.settings.backLabel;
          backAriaLabel = '';
        }

        // Create back buttons.
        $sub.prepend('<button type="button" class="' + plugin.class + '__back" aria-label="' + backAriaLabel + ' ' + backLabel + '"><span class="' + plugin.class + '__back-icon" aria-hidden="true"></span><span>' + backLabel + '</span></button>');

      });

      // Accessibility, parents sould be buttons.
      plugin.$menuTriggers
        .attr('role', 'button')
        .attr('aria-expanded', false);

      // "Back" buttons.
      plugin.$backBtns = $element.find('button.' + plugin.class + '__back');

    };


    // Remove focus on other levels and add focus on current level.
    var manageFocus = function($sub) {

      // Keyboard management : Remove focusable on all levels.
      $element.find('a, button').attr('tabindex', '-1');


      // In this case, we go the parent level.
      if ($sub.hasClass('mlvl__level--is-hidden')) {
        $sub = getParentLevel($sub);
      }

      // Make this level focusable.
      $sub.find('> button, > ul > li > a')
        .removeAttr('tabindex');

      // And move focus to first element.
      $sub.find('> button, > ul > li > a').first().focus();

    };


    // Get the parent level.
    var getParentLevel = function($sub) {
      return $sub.parents(plugin.selector + '__level').first();
    };


    // Attach levels events.
    var setLevelsEvents = function() {

      // Show.
      plugin.$subLevels.on('show.mlvl', function(event) {

        var $sub = $(this);

        event.stopPropagation();

        $sub
          .removeClass(plugin.class + '__level--is-hidden')
          .attr('aria-hidden', false)
          .prev()
            .attr('aria-expanded', true);

        // Update height of element.
        plugin.$topLevel.css({'height':  $sub.height()});

      }).on('transitionend', function(event) {

        // Do after CSS animation.
        event.stopPropagation();
        manageFocus($(this));
        plugin.settings.onNav();

      }).on('hide.mlvl', function(event, options) {

        // Hide current level.

        var $sub = $(this);

        event.stopPropagation();
        $sub
          .addClass(plugin.class + '__level--is-hidden')
          .attr('aria-hidden', true)
          .prev()
            .attr('aria-expanded', false);

        // Update height of parent element.
        var $parent = getParentLevel($sub);
        var height = $parent.height();

        if ($parent[0] == plugin.$topLevel[0] || options && options.first) {
          height = 'auto';
        }

        plugin.$topLevel.css({'height': height});

      });

    };


    // Attach buttons and global events.
    var setOtherEvents = function() {

      // Level's triggers.
      plugin.$menuTriggers.on('click.mlvl', function (event) {
        event.preventDefault();
        $(this).next().trigger('show.mlvl');
      });


      // Back.
      plugin.$backBtns.on('click.mlvl', function (event) {
        $(this).parent().trigger('hide.mlvl');
      });


      // Show the first level.
      $element.on('go-to-first-panel.mlvl', function() {
        plugin.$subLevels.filter(':not(.mlvl__level--is-hidden)').trigger('hide.mlvl', {'first': true});
      });


      // Destroy plugin.
      $element.on('destroy.mlvl', function() {
        destroy();
      });

    }


    // Remove all plugin HTML, class and events.
    var destroy = function() {

      $element.off(plugin.selector);
      plugin.$subLevels.off(plugin.selector);
      $element.find(plugin.selector + '__level--top > ul').unwrap();
      $element.find(plugin.selector + '__back, ' + plugin.selector + '__clone-item').remove();
      $element.find(plugin.selector + '__level > div, ' + plugin.selector + '__level > ul').unwrap();
      plugin.$menuTriggers.removeClass(plugin.class + '__parent').off(plugin.selector);
      $.removeData($element[0], 'menuLevel');

    };

    plugin.init();

  };


  $.fn.menuLevel = function(options) {

    return this.each(function() {

      if (undefined === $(this).data('menuLevel')) {
        var plugin = new $.menuLevel(this, options);
        $(this).data('menuLevel', plugin);
      }

    });

  };


})( jQuery );
