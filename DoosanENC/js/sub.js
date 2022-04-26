$(window).on('scroll', function() {
	const st = $(window).scrollTop();

    var sub_sec1 = $('.sub01 #content .section1').offset().top - 400;
    var sub_sec2 = $('.sub01 #content .section2').offset().top - 400;


    if (st > sub_sec1) {
        $('.sub01 .content').addClass('a_on');
        $('.sub01 .section1').addClass('a_on');

    }
    if (st > sub_sec2) {
        $('.sub01 .section2').addClass('a_on');
        
    }

});
    