$(function(){

	//********************************** AOS initialization
    AOS.init({
		once : true,
		throttleDelay : 99,
		duration: 1000,
	});
	

	//********************************** 헤더 컨트롤 및 파라미터값 가져오기
	//	var vh = window.innerHeight * 0.01;
    //	document.documentElement.style.setProperty("--vh", +vh+'px');

    var $window = $(window)
    // $(".gnb > ul").clone().appendTo(".sitemap nav");
    
    // $(".gnb > ul > li").hover(function(){
    //     $('.header').addClass('on');
    //     $(this).find('.sub_depth').addClass('on');
    // }, function(){
    //     $(this).find('.sub_depth').removeClass('on');

	// 	if ($(".header_ui .search").hasClass("on")) {
	// 		$('.header').addClass('on');
	// 	} else {
	// 		$('.header').removeClass('on');
	// 	}
        
    // });
    
	// $(".icon > div").on("click", function(){
	// 	$(this).toggleClass("on");
	// 	$(this).children('img').toggleClass('on');
	// 	if($(".search").hasClass("on")){
	// 		$(".header .search input").val("");
	// 	}
	// 	if ($(".icon > div").hasClass("on") === true) {
	// 		$('.header').addClass("on");
	// 	} else { 
	// 		$('.header').removeClass("on");
	// 	}
	// });
	$(".side_nav").on("click", function(){
		$(".side_nav_wrap .bg").toggleClass("on");
	});
	

    function getParameter(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    var s_cate = getParameter("s_cate");
    console.log(s_cate)
    if(s_cate){
        $(".sub .lnb .w1400 > ul > li.lnb_depth p span").text(s_cate)
        $(".sub .lnb .w1400 > ul > li.lnb_depth2").hide()
    };


	//********************************** 메인 슬라이더
	var speed = 1400;
	var autoplaySpeed = 3000; 
	var slideWidth  = $(window).width();
	var w = slideWidth / 1.2 * -1;
	var mvSlide = $(".mv .slide_ctn");
	var mtSlide = $(".mv .slide_txt .w1565");
	var mvSlide2 = $(".mv2 .slide_ctn");
	var mtSlide2 = $(".mv2 .slide_txt .w1565");


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
					if(nextIndex == 1){
						
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
		$(".play .p_bar").animate({strokeDashoffset: "0"},autoplaySpeed )
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
		//한페이지에서 여러개 사용시 return '.부모클래스 [data-slick-index="'+n+'"]'
		}).join(',');
		$('.mv .slick_now').removeClass('slick_now');
		//한페이지에서 여러개 사용시  $('.부모 클래스 .slick_now').removeClass('slick_now');
		$(selectors).addClass('slick_now');
		/*$(this).find(".slick-slide .bg0" + nextSlide).css({
			'transform': 'translateX(' + (w * -1) + 'px)'
		})
		$(this).find(".slick-slide .bg0" + (nextSlide + 1)).css({
			'transform': 'translateX(0px)'
		})
		$(this).find(".slick-slide .bg0" + (nextSlide + 2)).css({
			'transform': 'translateX(' + w + 'px)'
		})
		if (nextSlide + 1 == slick.slideCount) {
			$(this).find(".slick-slide .bg01").css({
				'transform': 'translateX(' + w + 'px)'
			})
		}
		if (nextSlide == 0) {
			var last = slick.$slides.length
			$(this).find(".slick-slide .bg0"+last+"").css({
				'transform': 'translateX(' + (w * -1) + 'px)'
			})
		}*/
		$(".play .p_bar").stop()
		$(".play .p_bar").animate({strokeDashoffset: "116"},0)
		$(".mv .current").text("0" + (nextSlide + 1))

		var bgEle = $(this).find(".item").not(".slick-cloned").find(".bg0" + (nextSlide + 1))
		if(bgEle.find("video").length){
			var video = bgEle.find("img")[0]
			video.currentTime=0;
			video.play();
		}
	})
	
	mvSlide.on("afterChange", function (e, slick, currentSlide, nextSlide) {
		var bgEle = $(this).find(".item").not(".slick-cloned").find(".bg0" + (currentSlide + 1))
		var video = bgEle.find("img")[0]
		// autoplaySpeed = video.duration - img.currentTime;
		autoplaySpeed = 5000;
		mvSlide.slick('slickSetOption','autoplaySpeed', autoplaySpeed, true);
		$(".play .p_bar").animate({strokeDashoffset: "0"}, autoplaySpeed)
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
		var video = videoChk.find("img")[0]
		autoplaySpeed = video.duration - video.currentTime;
		mvSlide.slick('slickSetOption','autoplaySpeed', autoplaySpeed * 1000, true);
		
	}
	// $(".play").on("click", function(){
	// 	var videoChk = $(".mv .slick_now").not(".slick-cloned").find(".bg")
	// 	var video = videoChk.find("video")[0]
	// 	if(!$(this).hasClass("on")){
	// 		$(this).addClass("on")
	// 		$(this).children().next().html("<i class='xi-pause'></i>")
	// 		mvSlide.slick("slickPause");
	// 		video.pause();
	// 		$(".play .p_bar").stop().animate()
	// 	} else{
	// 		$(this).removeClass("on")
	// 		$(this).children().next().html("<i class='xi-play'></i>")
	// 		mvSlide.slick("slickPlay");
	// 		video.play();
	// 		play_bar(autoplaySpeed)
	// 	}
	// })

	$(".slide_btn > div").on("click", function(e){
		var name = e.currentTarget.className
		if(name == "prev" || name == "prev on"){
			$(this).parents().siblings(".slide_ctn").slick("slickPrev")
		} else{
			$(this).parents().siblings(".slide_ctn").slick("slickNext")
		}
	})


	//********************************** 유튜브 재생?
	var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/player_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		var player;
		function onYouTubeIframeAPIReady(){
			player = new YT.Player("player",{
				videoId: "YeUzlSyyaiM",
				width: '100%',
				height: '100%',
				playerVars:{
					'controls': 0, //플레이어 컨드롤러 표시여부
					'rel': 0, //연관동영상 표시여부
					'playsinline': 1, //ios환경에서 전체화면으로 재생하지 않게하는 옵션
					'autoplay': 0, 
					'loop':0,
					'mute':0,
					'showsearch':0,
					'modestbranding':0,
					'playlist': "YeUzlSyyaiM"
				}
			});
		}

		$(".play_v").on("click", function(){
			$(".stop_v").show()
			$(this).hide()
			$(".m_news .video_tit").hide();
			player.playVideo();
		})
		$(".stop_v").on("click", function(){
			$(".play_v").show()
			$(".m_news .video_tit").show();
			$(this).hide()
			player.stopVideo();
		})
		$(function(){
			$(".ctn .item").hover(function(){
				var idx = $(this).index();
				$(this).addClass("on")
				$(".bg_box .bg").eq(idx).addClass("on")
			}, function(){
				$(this).removeClass("on")
				$(".bg_box .bg").removeClass("on")
			})
		})

})