import {createPopper} from '@popperjs/core';
(function ($) {
  const arraySelector = (selector) =>
    $(selector).map(function () {
      if (this instanceof Array) return arrayionize(this).toArray();
      else if (this instanceof jQuery) return this.toArray();
      else if (this instanceof String) return $(this.toString()).toArray();
      else return this;
    });
  const expanders = {noClass: []};
  $.fn.expander = function (passedOptions = {}) {
    return this.each(function () {
      const wrapper = this;
      const options = $.extend({}, $.fn.expander.defaults, passedOptions);
      options.body = arraySelector(options.body).add($(this).find('*[data-body]'));
      options.toggle = arraySelector(options.toggle).add($(this).find('*[data-toggle]'));
      options.open = arraySelector(options.open).add($(this).find('*[data-open]'));
      options.close = arraySelector(options.close).add($(this).find('*[data-close]'));
      switch ($(this).data('expander')) {
        case 'opened':
          if (passedOptions.opened !== false) options.opened = true;
          break;
        case 'closed':
          if (passedOptions.opened !== true) options.opened = false;
          break;
        default:
          if (!passedOptions.class) options.class = $(this).data('expander') || false;
          if (passedOptions.opened !== true) options.opened = false;
      }
      const expander = {
        wrapper,
        options,
        open({event, force = false}) {
          if (this.options.class) {
            expanders[this.options.class].forEach(
              (item) => item !== expander && item.close({force: true})
            );
          }
          this.options.opened = true;
          $(this.options.body).stop().slideDown(this.options.animationDuration);
          $(this.wrapper).addClass('opened');
          this.options.onOpen && this.options.onOpen(event, this);
        },
        close({event = null, force = false}) {
          if (!this.options.closeable && !force) return;
          this.options.opened = false;
          $(this.options.body).stop().slideUp(this.options.animationDuration);
          $(this.wrapper).removeClass('opened');
          this.options.onClose && this.options.onClose(event, this);
        },
        toggle({event, force = false}) {
          if (this.options.opened) this.close({event});
          else this.open({event});
          this.options.onToggle && this.options.onToggle(event, this);
        },
      };
      if (expander.options.class) {
        if (!expanders[expander.options.class]) {
          if (passedOptions.opened !== false) expander.options.opened = true;
          expanders[expander.options.class] = [expander];
        } else {
          expanders[expander.options.class].push(expander);
        }
      } else {
        expanders.noClass.push(expander);
      }
      const {toggle, open, close} = expander.options;
      // Event listeners
      $(toggle).on('click', (event) => {
        options.preventDefault && event.preventDefault();
        expander.toggle({event});
      });
      $(open).on('click', (event) => {
        options.preventDefault && e.preventDefault();
        expander.open({event});
      });
      $(close).on('click', (event) => {
        options.preventDefault && e.preventDefault();
        expander.close({event});
      });
      // First appearance
      if (expander.options.opened) expander.open({force: true});
      else expander.close({force: true});
      expander.options.onInit && expander.options.onInit(expander);
    });
  };
  $.fn.expander.defaults = {
    opened: false,
    class: false,
    closeable: true,
    preventDefault: true,
    onOpen: false,
    onClose: false,
    onToggle: false,
    onInit: false,
    animationDuration: 300,
    body: [],
    toggle: [],
    open: [],
    close: [],
  };
  $(window).one('load', () => {
    $('*[data-expander]').expander();
  });
})(jQuery);
