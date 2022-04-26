

$(window).on('scroll', function() {
	const st = $(window).scrollTop();
	const detail_sec1 = $('.section1').offset().top - 400;
	const detail_sec2 = $('.section2').offset().top - 600;
	const detail_sec3_1 = $('.detail #content .section3 .gal_inner').offset().top - 600;
	const detail_sec3_2 = $('.detail #content .section3 .gal_inner2').offset().top - 600;

	if (st > detail_sec1) {
		$('.detail .section1').addClass('a_on');
	} 
    if (st > detail_sec2) {
		$('.detail .section2').addClass('a_on');
	}
    if (st > detail_sec3_1) {
		$('.detail #content .section3 .gal_inner').addClass('a_on');
	}
	if (st > detail_sec3_2) {
		$('.detail #content .section3 .gal_inner2').addClass('a_on');
	}

});
    
          

