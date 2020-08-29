(function ($) {
    "use strict";
 
    var $wn = $(window);
 
    $wn.on('elementor/frontend/init', function () {
        // Medizco Doctors
        elementorFrontend.hooks.addAction('frontend/element_ready/medizco-doctors.default', function ( $scope ) {
            var $medizco_doctors_slider = $scope.find('.medizco_doctors_slider'),
                $medizco_doctors_filter = $scope.find('.medizco_doctors_filter');

            // Slider
            if ( $medizco_doctors_slider.length ) {
                $medizco_doctors_slider.slick({
                    rtl: $medizco_doctors_slider.data('rtl'),
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    autoplay: true,
                    autoplaySpeed: 8000,
                    arrows: false,
                    dots: true,
                    responsive: [{
                            breakpoint: 1025,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1
                            }
                        }
                    ]
                });
            }

            // Filter
            if ( $medizco_doctors_filter.length ) {
                var mixer = mixitup( $medizco_doctors_filter.children('.filter_items')[0] );

                $medizco_doctors_filter.on('click', '.filter_nav', function () {
                    $(this).children(':first-child').removeClass('active');
                });
            }
        });


        // Medizco Services Carousel
        elementorFrontend.hooks.addAction('frontend/element_ready/medizco-services-carousel.default', function ( $scope ) {
            var $carousels_wrap = $scope.find('.medizco_services_carousels'),
                $main_carousel = $carousels_wrap.children('.carousel_main'),
                $thumbs_carousel = $carousels_wrap.children('.carousel_thumbs');

            var mainCarousel = new Swiper($main_carousel[0], {
                speed: 800,
                loop: true,
                loopedSlides: 5,
                slidesPerView: 1,
                initialSlide: 2
            });

            var thumbsCarousel = new Swiper($thumbs_carousel[0], {
                speed: 800,
                loop: true,
                loopedSlides: 5,
                initialSlide: 2,
                centeredSlides: true,
                slidesPerView: 5,
                spaceBetween: 10,
                breakpoints: {
                    767: {
                        slidesPerView: 3
                    }
                }
            });

            $thumbs_carousel.on('click', '.swiper-slide', function () {
                var $el = $(this),
                    indx = $el.data('swiper-slide-index');

                thumbsCarousel.slideToLoop( indx, 800, false );
            });

            mainCarousel.controller.control = thumbsCarousel;
            thumbsCarousel.controller.control = mainCarousel;
        });
    });
 }(jQuery));
 