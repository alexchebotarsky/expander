import './main.scss';
import {createPopper} from '@popperjs/core';
(function ($) {
  const arraySelector = (selector) =>
    $(selector).map(function () {
      if (this instanceof Array) return arraySelector(this).toArray();
      else if (this instanceof jQuery) return this.toArray();
      else if (this instanceof String) return $(this.toString()).toArray();
      else return this;
    });
  const expanders = {noClass: []};
  $.fn.expander = function (passedOptions = {}) {
    return this.each(function () {
      if ($(this).hasClass('expander-inited')) return;
      const wrapper = this;
      $(wrapper).addClass('expander-inited');
      const dataOptions = {};
      Object.keys($.fn.expander.defaults).forEach((key) => {
        if ($(this).attr('data-' + key) !== undefined) {
          dataOptions[key] = $(this).attr('data-' + key);
          if (!isNaN(dataOptions[key])) dataOptions[key] = Number(dataOptions[key]);
          switch (dataOptions[key]) {
            case 'true':
              dataOptions[key] = true;
              break;
            case 'false':
              dataOptions[key] = false;
              break;
          }
        }
      });
      const options = $.extend({}, $.fn.expander.defaults, dataOptions, passedOptions);
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
          if (passedOptions.opened !== true && dataOptions.opened !== true) {
            options.opened = false;
          }
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

          // Modes
          if (this.options.dropdown) {
            if (this.destroyTimeout) {
              clearTimeout(this.destroyTimeout);
              this.destroyTimeout = null;
            }
            if (!this.popper) {
              const {tooltip, btn} = this.dropdown;
              $(tooltip).css('display', 'block');
              const popperOptions = {
                placement: this.options.dropdown,
                ...this.options.popper,
              };
              this.popper = createPopper(btn, tooltip, popperOptions);
            }
          } else {
            $(this.options.body).stop().slideDown(this.options.animationDuration);
          }

          this.options.opened = true;
          $(this.wrapper).addClass('opened');
          if (this.options.onOpen) this.options.onOpen(event, this);
        },
        close({event = null, force = false}) {
          if (!this.options.closeable && !force) return;
          this.options.opened = false;

          // Modes
          if (this.options.dropdown) {
            if (this.popper) {
              this.destroyTimeout = setTimeout(() => {
                this.popper.destroy();
                this.popper = null;
                $(this.dropdown.tooltip).css('display', 'none');
              }, 300);
            }
          } else {
            $(this.options.body).stop().slideUp(this.options.animationDuration);
          }

          $(this.wrapper).removeClass('opened');
          if (this.options.onClose) this.options.onClose(event, this);
        },
        toggle({event, force = false}) {
          if (this.options.opened) this.close({event, force});
          else this.open({event, force});
          if (this.options.onToggle) this.options.onToggle(event, this);
        },
      };
      if (expander.options.class) {
        if (!expanders[expander.options.class]) {
          if (passedOptions.opened !== false && dataOptions.opened !== false) {
            expander.options.opened = true;
          }
          expanders[expander.options.class] = [expander];
        } else {
          expanders[expander.options.class].push(expander);
        }
      } else {
        expanders.noClass.push(expander);
      }
      const {body, toggle, open, close, dropdown, dropdownHoverable} = expander.options;
      // Modes
      if (dropdown) {
        $(wrapper).addClass('mode-dropdown');
        $(body).wrap('<div class="expander-dropdown"></div>');
        const tooltip = body.parent().get(0);
        const btn = toggle.get(0);
        expander.dropdown = {tooltip, btn};
        // Event listeners
        let allowClickTimeout, allowClick;
        const hovers = [btn];
        if (dropdownHoverable) hovers.push(tooltip);
        $(arraySelector(hovers))
          .on('click', (event) => {
            if (!allowClick) event.preventDefault();
          })
          .on('mouseenter', (event) => {
            allowClickTimeout = setTimeout(() => (allowClick = true), 50);
            expander.open({event});
          })
          .on('mouseleave', (event) => {
            if (allowClickTimeout) {
              clearTimeout(allowClickTimeout);
              allowClick = false;
            }
            expander.close({event});
          });
      } else {
        $(wrapper).addClass('mode-accordion');
        // Event listeners
        $(toggle).on('click', (event) => {
          if (options.preventDefault) event.preventDefault();
          expander.toggle({event});
        });
        $(open).on('click', (event) => {
          if (options.preventDefault) e.preventDefault();
          expander.open({event});
        });
        $(close).on('click', (event) => {
          if (options.preventDefault) e.preventDefault();
          expander.close({event});
        });
      }
      // First appearance
      if (expander.options.opened) expander.open({force: true});
      else expander.close({force: true});
      if (expander.options.onInit) expander.options.onInit(expander);
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
    dropdown: false,
    dropdownHoverable: true,
    popper: {},
  };
  $(window).one('load', () => {
    $('*[data-expander]').expander();
  });
})(jQuery);
