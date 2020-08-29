(function ($) {
    "use strict";

    var $wn = $(window),
        $doc = $(document);

    $(function () {
        /* ----------------------------------------------------------- */
        /* Sticky
        /* ----------------------------------------------------------- */
        var $navbarSticky = $('.navbar-sticky');

        if ( $navbarSticky.length ) {
            var $wpadminbar = $('#wpadminbar'),
                navbarStickyOffset = $wpadminbar.length ? $wpadminbar.outerHeight() : 0;

            $navbarSticky.sticky({
                zIndex: 999,
                topSpacing: navbarStickyOffset
            });
        }

        
        /* ----------------------------------------------------------- */
        /* Header Menu
        /* ----------------------------------------------------------- */
        var $navbarNav = $('.navbar-nav');

        if ( $navbarNav.length ) {
            $navbarNav.on('click', '> li > .dropdown-toggle', function() {
                if ( $(window).width() > 991 ) {
                    window.location.href = this.href;
                }
            });
        }


        /* ----------------------------------------------------------- */
        /* Services CTA
        /* ----------------------------------------------------------- */
        var $select2Wrap = $('.select2_wrap .mf-input-select');

        if ( 'undefined' !== typeof $.fn.select2 && $select2Wrap.length ) {
            $select2Wrap.each(function () {
                var $el = $(this);

                $el.children('option:first-child').attr('selected', 'selected');

                $el.select2({
                    minimumResultsForSearch: -1,
                    dropdownParent: $el.parent()
                });
            });
        }


        /* ----------------------------------------------------------- */
        /* Timetable
        /* ----------------------------------------------------------- */
        var $timetableSelect = $('.mptt-navigation-select');

        if ( 'undefined' !== typeof $.fn.select2 && $timetableSelect.length ) {
            $timetableSelect.select2({
                minimumResultsForSearch: -1,
                dropdownParent: $timetableSelect.parent()
            });
        }

        
        /* ----------------------------------------------------------- */
        /* Back to top
        /* ----------------------------------------------------------- */
        $(window).on('scroll', function () {
            if ( $(window).scrollTop() > $(window).height() ) {
                $('.BackTo').fadeIn('slow');
            } else {
                $('.BackTo').fadeOut('slow');
            }
        });

        $('body, html').on('click', '.BackTo', function (e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: 0
            }, 800);
        });
    });

    $wn.on('load', function () {
        /* ----------------------------------------------------------- */
        /* Preloader
        /* ----------------------------------------------------------- */
        var $preloader = $('.medizco-preloder');

        if ( $preloader.length ) {
            $preloader.fadeOut();
        }
    });
}(jQuery));
