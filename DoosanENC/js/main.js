
$(function(){
	//********************************** AOS initialization
    AOS.init({
		once : true,
		throttleDelay : 99,
		duration: 1000,
	});

	/* ----------sub ----------------- */


	// var isVisible = false;
	
	$(window).on('scroll', function() {
		/* header */
		const st = $(window).scrollTop();
		if (st>=100){
			$('.header').addClass('on'); 
		} else{
			$('.header').removeClass('on');
		}
		

	});

	//********************************** 메인 슬라이더
	var speed = 1400;
	var autoplaySpeed = 5000; 
	var slideWidth  = $(window).width();
	var w = slideWidth / 1.2 * -1;
	var mvSlide = $(".mv .slide_ctn");
	var mtSlide = $(".mv .slide_txt .w1565");


	//풀페이지 부수기 (커스텀 앵커시)
	var fullPageCreated = false;
	var resizeControl = false;
	createFullpage();
	fullResize();
	function createFullpage() {
		 if (fullPageCreated === false) {
			 fullPageCreated = true;
			 $("#fullpage").fullpage({
				onLeave: function(index, nextIndex, direction){
					var idx = nextIndex - 1;
					$(".section:eq("+idx+")").addClass("a_on");
					$('.header').addClass('on'); 
					if(nextIndex == 1){
						$('.header').removeClass('on'); 
					}
					if(nextIndex == 4){
						$('.header').removeClass('on'); 
					}
					if(nextIndex == 6){
						$('.header').removeClass('on'); 
					}
					if(nextIndex == 7){
						$('.footer').removeClass('on'); 
					}
				},
			})
		}
	}
	var control02 = true;
		function fullResize(){
			if($(window).width() <= 1200){
				fullPageCreated = false;
				control02 = true;
				 if(!resizeControl){
					$.fn.fullpage.destroy('all');
					resizeControl = true;
					console.log(resizeControl)
					$(".section").removeClass("a_on");
					$(window).scroll(function(){
						var windowH = $(this).height();
						var percentage = windowH * 80 / 100;
						var windowS = $(this).scrollTop() + percentage 
						$(".ani").each(function(){
							var thisTop = $(this).offset().top;						
							if (thisTop < windowS) {
								$(this).addClass("m_ani");
							}
						});
					})
				 }
			}else {
				createFullpage();
				resizeControl = false;
				if ($(window).width() >= 1200 && control02){
					control02 = false;
					$.fn.fullpage.moveTo('page01', 0);
					$(".ani").removeClass("m_ani")
				}
			}
		}

	var timer = null;
	$(window).on("load resize", function(e){
		clearTimeout(timer);
		timer = setTimeout(resizeM , 150)

		slideWidth  = $(window).width();
		top(slideWidth)
		w = slideWidth / 1.2 * -1
		//chkW(w)

		if(slideWidth > 620){
			$(".m_sup .bot .slide_borad .item").hover(function(){
				$(".m_sup .bot .slide_borad .item").removeClass("on")
				$(this).addClass("on")
			})
		} else{
			$(".m_sup .bot .slide_borad .item").off("mouseenter mouseleave")
		}
	})
	function resizeM(){
		fullResize();
	}
	
	

	mvSlide.on("init", function(e, slick){
		var count = slick.slideCount;
		$(".mv .all").text("0"+count)
		//chkW(w)
		$(".play .p_bar").animate({strokeDashoffset: "0"},autoplaySpeed)
	})
	mvSlide.slick({ //비주얼
		arrows:false,
		speed: speed,
		pauseOnHover:false,
		pauseOnFocus:false,
		autoplay:true,
		fade:true,
		autoplaySpeed:autoplaySpeed,
		asNavFor: mtSlide
	})
	mtSlide.slick({ //텍스트
		arrows:false,
		speed: speed,
		fade:true,
		asNavFor: mvSlide
	})

	mvSlide.on("beforeChange", function (e, slick, currentSlide, nextSlide) {
		mvSlide.slick("setPosition");
		var count = slick.slideCount;
		var selectors = [nextSlide, nextSlide - count, nextSlide + count].map(function(n){
		return '.mv [data-slick-index="'+n+'"]'
		}).join(',');
		$('.mv .slick_now').removeClass('slick_now');
		$(selectors).addClass('slick_now');
		$(".play .p_bar").stop().animate({strokeDashoffset: "140"},0)
		$(".mv .current").text("0" + (nextSlide + 1))

		var bgEle = $(this).find(".item").not(".slick-cloned").find(".bg0" + (nextSlide + 1))
		if(bgEle.find("video").length){
			var video = bgEle.find("video")[0]
			video.currentTime=0;
			video.play();
		}
	})
	
	mvSlide.on("afterChange", function (e, slick, currentSlide, nextSlide) {
		var bgEle = $(this).find(".item").not(".slick-cloned").find(".bg0" + (currentSlide + 1))
		var video = bgEle.find("video")[0]
		autoplaySpeed = video.duration - video.currentTime;
		mvSlide.slick('slickSetOption','autoplaySpeed', autoplaySpeed * 1000, true);
		$(".play .p_bar").animate({strokeDashoffset: "0"}, autoplaySpeed * 1000)
	})
	$('.mv').find($('.slick-slide[data-slick-index="0"]')).addClass('slick_now');
	function top(slideWidth){
		if(slideWidth > 1200){
			$(".footer .top_btn").off().on("click",function(){
				$.fn.fullpage.moveTo(1);
			})
		} else{
			$(".footer .top_btn").off().on("click", function(){
				$("html,body").animate({scrollTop: 0},600)
			})
		}
	}

	function play_bar(autoplaySpeed){
		var videoChk = $(".mv .slick_now").not(".slick-cloned").find(".bg")
		var video = videoChk.find("video")[0]
		autoplaySpeed = video.duration - video.currentTime;
		mvSlide.slick('slickSetOption','autoplaySpeed', autoplaySpeed * 1000, true);
		$(".play .p_bar").stop().animate({strokeDashoffset: "0"}, autoplaySpeed * 1000, function(){
				autoplaySpeed = video.duration;
		});
	}
	$(".play").on("click", function(){
		var videoChk = $(".mv .slick_now").not(".slick-cloned").find(".bg")
		var video = videoChk.find("video")[0]
		if(!$(this).hasClass("on")){
			$(this).addClass("on")
			$(this).children().next().html("<i class='xi-play'></i>")
			mvSlide.slick("slickPause");
			video.pause();
			$(".play .p_bar").stop().animate()
		} else{
			$(this).removeClass("on")
			$(this).children().next().html("<i class='xi-pause'></i>")
			mvSlide.slick("slickPlay");
			video.play();
			play_bar(autoplaySpeed)
		}
	})

	$(".slide_btn > div").on("click", function(e){
		var name = e.currentTarget.className
		if(name == "prev" || name == "prev on"){
			$(this).parents().siblings(".slide_ctn").slick("slickPrev")
		} else{
			$(this).parents().siblings(".slide_ctn").slick("slickNext")
		}
	})


	$(".m_pro .slide_ctn").on("init", function(e, slick){
		var count = slick.slideCount;
		$(".num_box .all").text("0"+count)
	}).slick({
		arrows:false,
		speed: 200,
		pauseOnHover:false,
		pauseOnFocus:false,
		autoplay:true,
		autoplaySpeed:5000,
		swipe:false,
		dotsClass:"dot",
	}).on("beforeChange", function (e, slick, currentSlide, nextSlide) {
		var count = slick.slideCount;
		$(".m_pro .slide_dots .dot").removeClass("on")
		$(".m_pro .slide_dots .dot").eq(nextSlide).addClass("on")
		$(".m_pro .sub_txt .txt").removeClass("on")
		$(".m_pro .sub_txt .txt").eq(nextSlide).addClass("on")
		$(".num_box .current").text("0" + (nextSlide + 1))
	})

	$(".m_pro .slide_wrap .slide_ui .slide_dots .dot").hover(function(){
		var idx = $(this).index() - 1;
		$(".m_pro .slide_wrap .slide_ui .slide_dots .dot").removeClass("on")
		$(this).addClass("on")
		$(".num_box .current").text("0" + (idx + 1))
		$(".m_pro .slide_ctn").slick("setPosition");
		$(".m_pro .slide_ctn").slick("slickGoTo", idx)
		$(".m_pro .slide_ctn").slick("slickPause");
	},function(){
		$(".m_pro .slide_wrap .slide_ui .slide_dots .dot").removeClass("on")
		$(".m_pro .slide_ctn").slick("slickPlay")
	})




	$(".m_val .slide_ctn").slick({
		infinite:false,
		arrows:false,
		speed: 800,
		pauseOnHover:false,
		pauseOnFocus:false,
		slidesToShow:4,
		slidesToScroll:1,
		responsive: [
			{
			  breakpoint: 1200,
			  settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
			  }
			},
			{
			  breakpoint: 900,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			  }
			}
		]
	}).on("beforeChange", function (e, slick, currentSlide, nextSlide) {
		var count = slick.slideCount;
		var selectors = [nextSlide, nextSlide - count, nextSlide + count].map(function(n){
		return '.m_val [data-slick-index="'+n+'"]'
		//한페이지에서 여러개 사용시 return '.부모클래스 [data-slick-index="'+n+'"]'
		}).join(',');
		$('.m_val .slick_now').removeClass('slick_now');
		//한페이지에서 여러개 사용시  $('.부모 클래스 .slick_now').removeClass('slick_now');
		$(selectors).addClass('slick_now');
	}).on("afterChange",function (e, slick, currentSlide, nextSlide) {
		var index = $(this).find(".slick-active:last-child").data("slick-index")
		if(slick.$slides.length -1 == index){
			$(".m_val .slide_btn .prev").fadeIn()
			$(".m_val .slide_btn .next").fadeOut()
		} else{
			$(".m_val .slide_btn .prev").fadeIn()
			$(".m_val .slide_btn .next").fadeIn()
		}
		if(currentSlide == 0){
			$(".m_val .slide_btn .next").fadeIn()
			$(".m_val .slide_btn .prev").fadeOut()
		}
		
	})
	$('.m_val').find($('.slick-slide[data-slick-index="0"]')).addClass('slick_now');





	$(".mv .slide_wrap .slide_txt .item p").each(function(){
		console.log($(this))
		$(this).find("span").each(function(i){
			var i = i / 20
			$(this).css("animation-delay", i+"s")
		})
	})
	

/* ----------------------------------------------------------------------------- */


	$('.section3 .tab li').click(function(){
		var idx = $('.section3 .tab li').index(this)+1;

		$('.section3 .tab li').removeClass('on');
		$(this).addClass('on');
		// $('.bot > div').css({'display':'none'});
		// $('.bot_cont0' + idx).css({'display':'block'});
		$('.bot > div').removeClass('on');
		$('.bot_cont0' + idx).addClass('on');

		console.log($('.bot_cont0' + idx));
		console.log(idx);

	});
	$('.section3 .slide_wrap').slick({
		slidesToShow: 2,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		prevArrow: $('.prev'), 
		nextArrow: $('.next'),
	});
	$('.section3 .left .btn div').click(function(){
		$('.section3 .left .btn div').removeClass('on');
		$(this).addClass('on');
	});

	$('.m_val .cont li').eq(0).hover(function(){
		$('.m_val').addClass('bg01');
	},function(){
		$('.m_val').removeClass('bg01');
	});
	$('.m_val .cont li').eq(1).hover(function(){
		$('.m_val').addClass('bg02');
	},function(){
		$('.m_val').removeClass('bg02');
	});
	$('.m_val .cont li').eq(2).hover(function(){
		$('.m_val').addClass('bg03');
	},function(){
		$('.m_val').removeClass('bg03');
	});
	$('.m_val .cont li').eq(3).hover(function(){
		$('.m_val').addClass('bg04');
	},function(){
		$('.m_val').removeClass('bg04');
	});


	
	function s5Progress(index) {
		var count = $s5_slider.slick('getSlick').slideCount;
		
		if (index > ((count - 1) / 2)) {
			index = index - 4;
		}
		var s5_calc = ((index + 1) / (count / 2)) * 100;
		$s5_progressBar
		.css('background-size', s5_calc + '% 100%')
		.attr('aria-valuenow', s5_calc );
		console.log(s5_calc);
	};

	
	var $s5_slider = $('.section5 .slider_wrap');
	var $s5_progressBar = $('.section5 .slider_nav .progress');
	var $s5_progressBarLabel = $( '.section5 .slider_nav .sr-only' );
	
	
	$s5_slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {   
		s5Progress(nextSlide);
	});
	
	$s5_slider.slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		infinite: true,
		swipeToSlide: true,
		cssEase: 'ease-out',
		centermode: true,
		// variableWidth: true,
    	// adaptiveHeight: true,
		prevArrow: $('.section5 .slider_btn .prev'), 
		nextArrow: $('.section5 .slider_btn .next'),
	})
	//$s5_slider.slick('slickAdd',"<div style='width:0'></div>");
	s5Progress(0);







	function s6Progress(index) {
		var calc = ((index + 1) / ($slider.slick('getSlick').slideCount)) * 100;
		$progressBar
		  .css('background-size', calc + '% 100%')
		  .attr('aria-valuenow', calc );
	  }
	  
	  var $slider = $('.section6 .slider_wrap');
	  var $progressBar = $('.section6 .progress');
	  var $progressBarLabel = $( '.section6 .slider__label' );
	  
	  $slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {   
		s6Progress(nextSlide);
	  });
	  
	  
	  $slider.slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		infinite: true,
		cssEase: 'ease-out',
		prevArrow: $('.section6 .nav_btn .prev'), 
		nextArrow: $('.section6 .nav_btn .next'),
	});
	  
	s6Progress(0);
	  
/* --------------------------------------------- 기업 sub ----------------------------------------------------- */
	// setTimeout(function () {
	// 	$('.sub_visual').addClass('a_on');
	// }, 1);


	var controller = new ScrollMagic.Controller();

	// 상단 비주얼 타이틀
	new ScrollMagic.Scene({
		triggerElement: "#content",
		triggerHook: 'onEnter',
		duration: '100%'
	})
		.setTween('.vi_tit', {
			y: '-300%',
			opacity: 0.1,
		})
		.addTo(controller);

	// 상단 비주얼 dim
	new ScrollMagic.Scene({
		triggerElement: "#content",
		triggerHook: 'onEnter',
		// triggerHook: 'onLeave',
		duration: '100%'
	})
		.setTween('.visual_dim', {
			opacity: 1,
			ease: Linear.easeNone
		})
		.addTo(controller);

	return controller;

})

// $(window).scroll(function(){
// 	var wst = $(window).scrollTop();
// 	detailScroll();
// });

// function detailScroll(){
// 	var detail_s1 = $('.detail .section1').offset().top - 600 ;
// 	var detail_s2 = $('.detail .section2').offset().top - 600 ;
// 	var detail_s3 = $('.detail .section3').offset().top - 600 ;
// 	console.log('wst = ' + st);
// 	console.log('s1 = ' + detail_s1);
// 	console.log('s2 = ' + detail_s2);
// 	console.log('s3 = ' + detail_s3);
// 	if (wst > detail_s1) {
// 		$('.detail .section1').addClass('a_on');
// 	} else if (wst > detail_s2 ){
// 		$('.detail .section2').addClass('a_on');
// 	} else if (wst > detail_s3){
// 		$('.detail .section3').addClass('a_on');
// 	}
// };

// scrollMotion();
// function scrollMotion(){
// 	//var
// 	var wW = $(window).width();
// 	var wH = $(window).height();
// 	var scTop = $(window).scrollTop();

// 	var $detailbox01 = $(".detail .section1");
// 	var $detailbox02 = $(".detail .section2");
// 	var $detailbox03 = $(".detail .section3");


// 	//scroll
// 	var scrollDetect = function(){
// 		scTop = $(window).scrollTop();
// 		winH = top.window.innerHeight;

// 		if($detailbox01.offset().top < (scTop+winH*0.5)){
// 			$detailbox01.addClass("a_on");
// 			alert('section1');
// 		}
// 		if($detailbox02.offset().top < (scTop+winH*0.5)){
// 			$detailbox02.addClass("a_on");
// 		}
// 		if($detailbox03.offset().top < (scTop+winH*0.5)){
// 			$detailbox03.addClass("a_on");
// 		}

// 	};

	// setTimeout(function () {
	// 	$('.sub_visual').addClass('a_on');
	// }, 1);

// 	$(window).on("scroll", function(){
// 		scrollDetect();
// 	}).trigger("scroll");


		  
// };
