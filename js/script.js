$(document).ready(function () {
    // element references
    const $htmlEl        = $('html');
    const $siteBody      = $('body');
    const $preloader     = $('#preloader');
    const $header        = $('.s-header');
    const $intro         = $('#intro');
    const $toggleButton  = $('.s-header__menu-toggle');
    const $mainNavWrap   = $('.s-header__nav');
    const $sections      = $('.target-section');
    const $folioLinks    = $('.folio-list__item-link');
    const $swiperContainer = $('.s-testimonials__slider');

    /* preloader */
    if ($preloader.length) {
        // adding "ss-preload" class to <html>
        $htmlEl.addClass('ss-preload');

        // when the entire page has finished loading...
        $(window).on('load', function () {
            // removing "ss-preload" and add "ss-loaded" on <html>
            $htmlEl.removeClass('ss-preload').addClass('ss-loaded');

            // listening for transitionend event on #preloader
            $preloader.on('transitionend', function (e) {
                if ($(e.target).is($preloader)) {
                    $siteBody.addClass('ss-show');
                    $preloader.hide();
                    // unbind this transitionend event if it should only fire once
                    $preloader.off(e.type);
                }
            });
        });
    }

    /* move Header on Scroll */
    if ($header.length && $intro.length) {
        let triggerHeight;

        // slight delaying so #intro is fully loaded and height is accurate
        setTimeout(function () {
            triggerHeight = $intro.outerHeight() - 170;
        }, 300);

        // updating header classes on scroll
        $(window).on('scroll', function () {
            const scrollPos = $(window).scrollTop();

            if (scrollPos > triggerHeight) {
                $header.addClass('sticky');
            } else {
                $header.removeClass('sticky');
            }

            if (scrollPos > triggerHeight + 20) {
                $header.addClass('offset');
            } else {
                $header.removeClass('offset');
            }

            if (scrollPos > triggerHeight + 150) {
                $header.addClass('scrolling');
            } else {
                $header.removeClass('scrolling');
            }
        });
    }

    /* Mobile Menu Toggle */
    if ($toggleButton.length && $mainNavWrap.length) {
        // toggling mobile menu
        $toggleButton.on('click', function (e) {
            e.preventDefault();
            $toggleButton.toggleClass('is-clicked');
            $siteBody.toggleClass('menu-is-open');
        });

        // closing menu when clicking a link on mobile
        $mainNavWrap.find('a').on('click', function () {
            if (window.matchMedia('(max-width: 900px)').matches) {
                $toggleButton.toggleClass('is-clicked');
                $siteBody.toggleClass('menu-is-open');
            }
        });

        // resetting open menu if window resizes above 900px
        $(window).on('resize', function () {
            if (window.matchMedia('(min-width: 901px)').matches) {
                if ($siteBody.hasClass('menu-is-open')) {
                    $siteBody.removeClass('menu-is-open');
                }
                if ($toggleButton.hasClass('is-clicked')) {
                    $toggleButton.removeClass('is-clicked');
                }
            }
        });
    }

    /* Highlight Active Menu Link on Scroll */
    if ($sections.length) {
        const onScroll = function () {
            const scrollY = $(window).scrollTop();

            $sections.each(function () {
                const $section      = $(this);
                const sectionHeight = $section.outerHeight();
                const sectionTop    = $section.offset().top - 50;
                const sectionId     = $section.attr('id');
                const $navLink      = $(`.s-header__nav a[href*='${sectionId}']`);

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    $navLink.parent().addClass('current');
                } else {
                    $navLink.parent().removeClass('current');
                }
            });
        };

        // attaching scroll handler
        $(window).on('scroll', onScroll);
    }

    /* Lightbox for Folio Items */
    if ($folioLinks.length) {
        const modals = [];

        // creating and storing each basicLightbox instance
        $folioLinks.each(function () {
            const $link          = $(this);
            const modalSelector  = $link.attr('href'); // e.g. "#modal-01"
            const modalContentEl = $(modalSelector).get(0); // DOM element

            console.log(modalSelector, modalContentEl);

            const instance = basicLightbox.create(modalContentEl, {
                onShow: (inst) => {
                    // attaching ESC key listener when lightbox is shown
                    $(document).on('keydown.lightbox', function (evt) {
                        if (evt.key === 'Escape') {
                            inst.close();
                        }
                    });
                },
                onClose: () => {
                    // cleanup ESC listener when lightbox is closed
                    $(document).off('keydown.lightbox');
                }
            });

            modals.push(instance);
        });

        // showing the matching lightbox on click
        $folioLinks.on('click', function (e) {
            e.preventDefault();
            const index = $folioLinks.index(this);
            modals[index].show();
        });
    }

    /* Swiper Initialization */
    if ($swiperContainer.length) {
        new Swiper($swiperContainer[0], {
            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            breakpoints: {
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                801: {
                    slidesPerView: 2,
                    spaceBetween: 50
                },
                1181: {
                    slidesPerView: 3,
                    spaceBetween: 48
                }
            }
        });
    }
});