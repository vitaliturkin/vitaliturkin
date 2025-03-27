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
    const $alertBoxes    = $('.alert-box');
    const $triggers      = $('.smoothscroll');

    /*=============================================
    =            1. Preloader                     =
    =============================================*/
    if ($preloader.length) {
        // Adding "ss-preload" class to <html>
        $htmlEl.addClass('ss-preload');

        // When the entire page has finished loading...
        $(window).on('load', function () {
            // Remove "ss-preload" and add "ss-loaded" on <html>
            $htmlEl.removeClass('ss-preload').addClass('ss-loaded');

            // Listen for transitionend event on #preloader
            $preloader.on('transitionend', function (e) {
                if ($(e.target).is($preloader)) {
                    $siteBody.addClass('ss-show');
                    $preloader.hide();
                    // Unbind this transitionend event if it should only fire once
                    $preloader.off(e.type);
                }
            });
        });
    }

    /*=============================================
    =    2. Move Header on Scroll                 =
    =============================================*/
    if ($header.length && $intro.length) {
        let triggerHeight;

        // Slight delaying so #intro is fully loaded and height is accurate
        setTimeout(function () {
            triggerHeight = $intro.outerHeight() - 170;
        }, 300);

        // Updating header classes on scroll
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

    /*=============================================
    =       3. Mobile Menu Toggle                =
    =============================================*/
    if ($toggleButton.length && $mainNavWrap.length) {
        // Toggling mobile menu
        $toggleButton.on('click', function (e) {
            e.preventDefault();
            $toggleButton.toggleClass('is-clicked');
            $siteBody.toggleClass('menu-is-open');
        });

        // Closing menu when clicking a link on mobile
        $mainNavWrap.find('a').on('click', function () {
            if (window.matchMedia('(max-width: 900px)').matches) {
                $toggleButton.toggleClass('is-clicked');
                $siteBody.toggleClass('menu-is-open');
            }
        });

        // Resetting open menu if window resizes above 900px
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

    /*=============================================
    =  4. Highlight Active Menu Link on Scroll    =
    =============================================*/
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

        // Attach scroll handler
        $(window).on('scroll', onScroll);
    }

    /*=============================================
    =         5. Lightbox for Folio Items         =
    =============================================*/
    if ($folioLinks.length) {
        const modals = [];

        // Creating and storing each basicLightbox instance
        $folioLinks.each(function () {
            const $link          = $(this);
            const modalSelector  = $link.attr('href'); // e.g. "#modal-01"
            const modalContentEl = $(modalSelector).get(0); // DOM element

            console.log(modalSelector, modalContentEl);

            const instance = basicLightbox.create(modalContentEl, {
                onShow: (inst) => {
                    // Attach ESC key listener when lightbox is shown
                    $(document).on('keydown.lightbox', function (evt) {
                        if (evt.key === 'Escape') {
                            inst.close();
                        }
                    });
                },
                onClose: () => {
                    // Cleanup ESC listener when lightbox is closed
                    $(document).off('keydown.lightbox');
                }
            });

            modals.push(instance);
        });

        // Showing the matching lightbox on click
        $folioLinks.on('click', function (e) {
            e.preventDefault();
            const index = $folioLinks.index(this);
            modals[index].show();
        });
    }

    /*=============================================
    =         6. Swiper Initialization           =
    =============================================*/
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

    /*=============================================
    =     7. Alert Boxes (Close on Click)        =
    =============================================*/
    if ($alertBoxes.length) {
        $alertBoxes.each(function() {
            const $thisBox = $(this);

            $thisBox.on('click', function(e) {
                // Checking if click happened on the .alert-box__close element
                if ($(e.target).is('.alert-box__close')) {
                    e.stopPropagation();
                    $thisBox.addClass('hideit');

                    setTimeout(function() {
                        $thisBox.hide();
                    }, 500);
                }
            });
        });
    }
});