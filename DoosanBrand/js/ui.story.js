
function check_hanlder() {
  if ($('.sec-ani').hasClass('active')) {
    $('.square').removeClass('on left');
    $('.letter').removeClass('on');
    // $('.letter_container').removeClass('fadeOut');

  } else {
    $('.square').addClass('on');

    const animated = document.querySelector('.square.on');
      animated.addEventListener('animationend', () => {
        $('.square.on').addClass('left');
        setTimeout(() => {
          $('.letter').addClass('on');
        }, 100);
        // $('.letter_container').addClass('stop');
        

      });
  }
} check_hanlder();
//브랜드
var _story = {
  $wrap : null, $section : null, isWheelAni : false, _$oldsection : null, scrollcontroller : null, $header : null, topheight : 504,
  viewcheck : function($this){
    if(!$this) return false;
    var st = ui._win.scrolltop, et = $this.offset().top, eh = $this.innerHeight(), eb = et + eh, isview;
    isview = _story.topheight-5<st && et < st+ui._win.h && st+(ui._win.h/4) < eb;
    return [isview, Math.min(isview?(st-et)/eh:1, 1), isview? st-et : 0, isview? eb-st : 0];
  },

  wheelAction : function(type){
    var _ = this, $cur, $next, curpos, pos, delay = 0, timemax = 1000;

    $cur = _.$section.filter(".active");
    check_hanlder();

    if($cur.length==0 && _._$oldsection && ui._win.scrolltop >= _.topheight) {
      $cur = _._$oldsection;
    } else if($cur.length==0 && (ui._win.scrolltop > _.topheight-10 && ui._win.scrolltop < _.topheight+10)) {
      $cur = _.$section.eq(0);
    } else if($cur.length>1) {
      $cur = $cur.last();
    }

    if(!$cur.length && ui._win.scrolltop < _.topheight) {
      curpos = 0, timemax = 600, delay = 0;
      $next = type=="next" ? _.$section.eq(0) : _.$vis;
    } else {
      curpos = $cur.offset().top || 0;
      $next = type=="next" ? $cur.next() : $cur.prev();
    }

    if ($next&&$next.length) {
      pos = $next.offset().top;
    } else if(type=="next") {
      pos = _.$footer.offset().top, timemax = 600, delay = 0;
    } else {
      pos = -1;
    }

    if(type=="prev" && curpos < ui._win.scrolltop) {
      pos = curpos;
    }

    if(pos < 0 && type=="prev" && ui._win.scrolltop > 0) {
      pos = 0, timemax = 600, delay = 0;
    }

    if(pos > -1) {
      if($next.is(".sec") && pos < ui._win.scrolltop) { 
        delay = 1000;
      }
      if($next.is(".sec-2") && pos > ui._win.scrolltop) {
        delay = 1000;
      }
      if($next.is(".sec-2") && pos < ui._win.scrolltop) {
        if(!$next.is(".active")) {
          $next.children().css({"position":"relative"});
        }
      }
      $("html, body").stop().animate({scrollTop: pos}, {
        "duration":timemax-delay,"easing":"easeInOutQuad"}).animate({scrollTop: pos}, {

          "duration":delay,"easing":"linear",
          complete:function(){ 
            $next.children().removeAttr("style"); 
            _.isWheelAni = false; 

          }
        });
    } else {
      _.isWheelAni = false;
    }
  },

  wheel : function(timegap, e) {
    var _ = this;
    if(ui._win.h < 660) return true;
    var _timegap = (new Date()).getTime(), isPass = _timegap-timegap;
    timegap = _timegap;
    if(!(_.isWheelAni || isPass<200)){
      var E = e.originalEvent;
      var delta = (E.detail) ? E.detail * -40 : (E.wheelDelta ? E.wheelDelta : E.deltaY*-1);
      _.isWheelAni = true;
      if(delta > 0) _.wheelAction.call(_, "prev");
      else if(delta < 0) _.wheelAction.call(_, "next");
    }
    e && e.preventDefault && e.preventDefault();
  },
  evt : function(){
    var _ = this, timegap = (new Date()).getTime(), classname = {cur:"active", old:"active-out", prev:"active-prev", next:"active-next"}, oldclassname = "active-old", $oldactive, $active;

    var reclass = function(){
      var _cur, iswrapview, ishistoryview, isactive = false;
      iswrapview = _story.topheight-5<ui._win.scrolltop;
      if(iswrapview && !_.$wrap.is("."+classname.cur)){
        _.$wrap.addClass(classname.cur);
        $oldactive = null;
      }else if(!iswrapview && _.$wrap.is("."+classname.cur)){
        _.$wrap.removeClass(classname.cur);
      }

      _.$section.each(function(iiii){
        var $this = $.$(this), isview = _.viewcheck($this);
        if(isview[0] && !isactive){
          isactive = true;
          if(!$this.is("."+classname.cur)){
            $this.addClass(classname.cur).removeClass(classname.old);
            if($active && !$active.is($this)) $oldactive = $active;
            $active = $this;
          }
        }else{
          if($this.is("."+classname.cur) && !$this.is("."+classname.old)) $this.addClass(classname.old);
          else if($this.is("."+classname.old) && !($oldactive && $oldactive.is($this))) $this.removeClass(classname.old);
          if($this.is("."+classname.cur)) $this.removeClass(classname.cur);
        }
      });
      if(_.$wrap.is(".is-first")) _.$wrap.removeClass("is-first");
    };

    $(window).off("resize.storyActive orientationChange.storyActive").on("resize.storyActive orientationChange.storyActive", reclass).trigger("resize.storyActive", true).off("scroll.storyActive").on("scroll.storyActive", reclass).trigger("scroll.storyActive");
    $("#wrap").off('mousewheel.sectionJump DOMMouseScroll.sectionJump').on('mousewheel.sectionJump DOMMouseScroll.sectionJump', _.wheel.bind(_, timegap));
  },
  init : function($wrap){
    if(!$wrap.length) return;
    var _ = this;
    _.$header = $(".header");
    _.$footer = $(".footer");
    _.scrollcontroller = new ScrollMagic.Controller();
    _.$wrap = $wrap.addClass("is-first");
    _.$section = _.$wrap.children();
    _.$vis = $(".bg-brand");
    _.evt();
  }
};


$(document).ready(function(){
  _story.init($(".story-cont"));


  $('.story-cont .sec-5 .slider_wrap').slick({
		slidesToShow: 2,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		infinite: false,
		cssEase: 'ease-out',
		arrows: false,
	});
  
  $('.sub .sec-6 .s6_tab li').click(function(){
		var idx = $('.sub .sec-6 .s6_tab li').index(this)+1;
		console.log(idx);
		$('.sub .sec-6 .s6_tab li').removeClass('on');
		$(this).addClass('on');
		$('.sub .sec-6 .right > div').removeClass('on');
		$('.sub .sec-6 .right > .item0' + idx).addClass('on');

	});


	setTimeout(function () {
		$('.vis').addClass('a_on');
	}, 1);


		if($('.ani-2').hasClass('active')){
      $(this).addClass('a_on');
    }

    var s5 = $('.story-cont .sec-5');

    // $(window).scroll(function(e){
    //     if(s5.offset().top !== 0){
    //         if(!s5.hasClass('shadow')){
    //             $('.header').addClass('shadow');
    //         }
    //     }else{
    //       $('.header').removeClass('shadow');
    //     }
    // });

});


