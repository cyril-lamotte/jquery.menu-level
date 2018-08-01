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

      // Wrap all levels.
      // and add class on parents.
      $element
        .addClass('mlvl')
        .wrapInner('<div class="' + plugin.class + '__level ' + plugin.class + '__level--top"></div>')
        .find(plugin.settings.sublevel)
          .wrap('<div class="' + plugin.class + '__level"></div>')
        .end()
          .find(plugin.selector + '__level').prev()
            .addClass(plugin.class + '__parent');

      // Save levels.
      plugin.settings.$topLevel = $(plugin.selector + '__level--top');
      plugin.settings.$subLevels = plugin.settings.$topLevel.find(plugin.selector + '__level');

      // Links with sublevel.
      plugin.settings.$menuTriggers = $element.find(plugin.selector +'__parent');

      // Create back buttons.
      $.each(plugin.settings.$subLevels, function(i, el) {

        var $sub = $(this);
        var backLabel = '';

        // Create clone links.
        if (plugin.settings.repeatParentInSub) {

          // Create new li.
          $('<li class="' + plugin.class + '__clone-item"></li>').prependTo($sub.find('> ul'));

          $sub.prev().clone().prependTo($sub.find('> ul > li.' + plugin.class + '__clone-item'))
            .removeClass('active ' + plugin.selector + '__parent')
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
        }


        $sub.prepend('<button type="button" class="' + plugin.class + '__back"><span class="' + plugin.class + '__back-icon"></span><span>' + backLabel + '</span></button>');



      });


      // "Back" buttons.
      plugin.settings.$backBtns = $element.find('button.' + plugin.class + '__back');

      // Hide sublevels.
      plugin.settings.$subLevels.addClass(plugin.class + '__level--is-hidden');

      // Attach events.
      setEvents();

    };


    // Attach events
    var setEvents = function() {

      // Show.
      plugin.settings.$subLevels.on('show.mlvl', function(event) {

        event.stopPropagation();
        $(this).removeClass(plugin.class + '__level--is-hidden');

        // Update height of element.
        plugin.settings.$topLevel.css({'height':  $(this).height()});
        plugin.settings.onNav();

      });

      // Hide current level.
      plugin.settings.$subLevels.on('hide.mlvl', function(event, options) {

        event.stopPropagation();
        $(this).addClass(plugin.class + '__level--is-hidden');

        // Update height of parent element.
        var $parent = $(this).parents(plugin.selector + '__level').first();
        var height = $parent.height();

        if ($parent[0] == plugin.settings.$topLevel[0] || options && options.first) {
          height = 'auto';
        }

        plugin.settings.$topLevel.css({'height': height});
        plugin.settings.onNav();

      });

      // Level's triggers.
      plugin.settings.$menuTriggers.on('click.mlvl', function (event) {
        event.preventDefault();
        $(this).next().trigger('show.mlvl');
      });

      // Back.
      plugin.settings.$backBtns.on('click.mlvl', function (event) {
        $(this).parent().trigger('hide.mlvl');
      });

      // Show the first level.
      $element.on('go-to-first-panel.mlvl', function() {
        plugin.settings.$subLevels.filter(':not(.mlvl__level--is-hidden)').trigger('hide.mlvl', {'first': true});
      });

      // Destroy plugin.
      $element.on('destroy.mlvl', function() {

        $element.off(plugin.selector);
        plugin.settings.$subLevels.off(plugin.selector);
        $element.find(plugin.selector + '__level--top > ul').unwrap();
        $element.find(plugin.selector + '__back, ' + plugin.selector + '__clone-item').remove();
        $element.find(plugin.selector + '__level > div, ' + plugin.selector + '__level > ul').unwrap();
        plugin.settings.$menuTriggers.removeClass(plugin.class + '__parent').off(plugin.selector);
        $.removeData($element[0], 'menuLevel');

      });

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
