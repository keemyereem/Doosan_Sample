var YT = YT || null;

if(typeof console=="undefined"){ console = { log : function(){}, info : function(){}, warn : function(){}, error : function(){} }; }
(function(global, ui){
  'use strict';

  var _win = { h : 0, w : 0, scrolltop : 0, scrolldir : "", state : null, size : {header:0, footer:0, fixtop:0} };
  var _evt = {
    winclick : function(e){
      var target = e.target.nodeName==="A"||e.target.nodeName==="BUTTON" ? e.target : e.currentTarget, $target = $.$(target), $relele, uipop, toggleclass, blindtitle;
      uipop = target.getAttribute("data-uipop");
      toggleclass = target.getAttribute("data-toggleclass");
      if(toggleclass) $target.toggleClass(toggleclass);
      blindtitle = target.getAttribute("data-blind-title");
      if(blindtitle) _page.blindtitle.call(target, blindtitle);
      document.focusEl = target;

      if(uipop){
        if(uipop!="youtube") $relele = url2el(target, null);
        if(uipop=="youtube"){
          var summaryTxt = target.getAttribute("data-subject") || target.getAttribute("title") || "동영상", movid = "createPopVideo";
          var youtubeHtml = ['<div id="'+movid+'" class="pop-layer pop-video" data-uipopset="">',
            '  <button type="button" class="pop-btn-close pos-2 accessibility-btns" data-uipop="0" title="레이어팝업"><span class="blind">닫기</span></button>',
            '  <div class="video-in"><iframe style="width:100%; height:100%;" src="'+(target.getAttribute("data-url") || target.href)+'" title="'+summaryTxt+'" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe></div>',
            '  <button type="button" class="pop-btn-close pos-2" data-uipop="0"><span class="blind">닫기</span></button>',
            '</div>'].join('');
          _page.$body.append(youtubeHtml).promise().done(function(){
            $relele = $('#'+movid);
            $relele.uipop({callbackClose:function(){ $('#'+movid).closest(".uipop-container").remove(); }}).uipop("open");
          });
        }else if(uipop==0 || uipop==1){
          if(!$relele) $relele = $target.closest('[data-uipopset]');
          if($relele.length==0) $relele = null;
          if(!$relele && !window.parent.length) self.close();
          if($relele && uipop==0) $relele.uipop("close");
          if($relele && uipop==1) $relele.uipop("open");
        }else if(uipop!="" && uipop!=undefined){
          var url = target.getAttribute("href") || target.getAttribute("data-url");
          var _data = $jq.extend([], $target.data("uipop"));
          _data.unshift(url);
          $target.uipop({winpop:_data});
        }
        e.preventDefault();
      }
    },
    winresize : function(e, first){
      _win.h = _page.$win.height();
      _win.w = _page.$win.width();
      _win.size.header = _page.layout.$header?_page.layout.$header.height():0;
      _win.size.footer = _page.layout.$footer?_page.layout.$footer.height():0;
      swipeset.sizecheck(); //swipe tab
      
      var _ratio = _page.grid.ratio.el, _size, _ratio_$el;
      if(_ratio.length){
          for(i in _ratio){
            _ratio_$el = $(_ratio[i].gridoption.size.el);
            _size = [_ratio_$el.width(), _ratio_$el.height(), _ratio[i].gridoption.size.h/_ratio[i].gridoption.size.w, _ratio[i].gridoption.size.w/_ratio[i].gridoption.size.h];
            _ratio[i].style.width = _size[0]+"px";
            _ratio[i].style.height = (_size[0]*_size[2])+"px";
            _ratio[i].style.minWidth = (_size[1]*_size[3])+"px";
            _ratio[i].style.minHeight = _size[1]+"px";
          }
      }
    },
    winscroll : function(e, first){
      var curscrolltop = _page.$win.scrollTop(), _dir, _st;
      if(_win.scrolltop==curscrolltop) return false;
      _dir = _win.scrolltop>curscrolltop ? "up" : "down";
      if(!_page.$body.is("."+_dir)) _page.$body.removeClass(_dir=="up"?"down":"up").addClass(_dir);
      _win.scrolltop = curscrolltop;
      _win.scrolldir = _dir;
      _st = _win.scrolltop==1?0:_win.scrolltop;
      if(_st && _win.state != "min"){
        _page.layout.$header && _page.layout.$header.addClass("min");
        _win.state = "min";
      }else if(_win.scrolltop<=_win.size.fixtop && _win.state == "min"){
        _page.layout.$header && _page.layout.$header.removeClass("min");
        _win.state = null;
      }
      if(_st>_win.size.fixtop){
        _page.layout.$header && !_page.layout.$header.is(".fixed") && _page.layout.$header.addClass("fixed");
      }else{
        _page.layout.$header && _page.layout.$header.is(".fixed") && _page.layout.$header.removeClass("fixed");
      }
    },
    doc : function($wrap){
      $wrap.findFilter("input[data-delete='ipt']").off('focus.delbtn blur.delbtn propertychange.delbtn change.delbtn keyup.delbtn paste.delbtn input.delbtn').on('focus.delbtn blur.delbtn propertychange.delbtn change.delbtn keyup.delbtn paste.delbtn input.delbtn', function(e) {
        var $p = $.$(this).closest('[data-delete="wrap"]');
        if($.trim(this.value)=="") $p.removeClass("del-view"); else $p.addClass("del-view");
      }).trigger('blur.delbtn').each(function(){
        var _ = this, _$ = $.$(_), $p = _$.closest('[data-delete="wrap"]');
        $p.find('[data-delete="btn"]').off("click.delbtn").on("click.delbtn", function(e){ _.value=""; _$.focus().trigger('change'); return false; });
      });
      $wrap.findFilter("input[data-fakefile='file']").off('change.fakefile').on('change.fakefile', function() {
        var _ = this, _$ = $.$(_);
        _$.trigger('blur.delbtn');
        if($.trim(_.value)=="") _$.parent().removeClass("del-view"), _.$ipt && _.$ipt.val("");
        else _$.parent().addClass("del-view"), _.$ipt && _.$ipt.val(_.value.replace(/.*\\/,""));
      }).trigger('change.fakefile').each(function(){ this.$ipt = $.$(this).parent().find("input[data-fakefile='text']"); });
      $wrap.findFilter("input[data-variablenumber='this'], input[data-commanumber='this']").variableNumber('propertychange.variableNumber change.variableNumber keyup.variableNumber paste.variableNumber input.variableNumber');
    },
    init : function($wrap, isReInit){
      var _ = this;
      if(!$wrap) $wrap = _page.$body;
      _.doc($wrap); //form event
      if(!isReInit){
        _page.$body.off("click.linkHandler").off("click.linkHandler", "a, button, area").on("click.linkHandler", "a, button, area", _.winclick).off("focus.appFocus blur.appFocus", "input:not([type='checkbox']):not([type='radio']),select,textarea");
        _page.$win.off("resize.layoutsc orientationChange.layoutsc").on("resize.layoutsc orientationChange.layoutsc", _.winresize).trigger("resize.layoutsc", true).off("scroll.layoutsc").on("scroll.layoutsc", _.winscroll).trigger("scroll.layoutsc");
      }
      setTimeout(function(){ _page.$win.trigger("resize.layoutsc", true).trigger("scroll.layoutsc", true); }, 500);
    }
  };
  var _page = {
    $win : $(window), $html : null, $body : null, wintitle : "", scrollcontroller : null, msg : {selected : "선택됨"},
    docTitle : function(doctitle){
      var _winTitle = [doctitle];
      $.each($("[data-addtitle]"), function(){
        var t = this.getAttribute("data-addtitle");
        if(!t || t=="this"||t=="") t = $.$(this).text();
        _winTitle.push(t);
      });
      document.title = _winTitle.join(" > ");
    },
    blindtitle : function(blindid){
      if(!blindid) return;
      var blindtitleEle = document.getElementById(blindid);
      if(blindtitleEle){
        blindtitleEle.innerHTML = $.$(this).attr("title",_page.msg.selected).text();
        $('[data-blind-title="'+blindid+'"]').not(this).attr("title","");
      }
    },
    grid : {
      slide : {
        init : function(_this){
          var $wrap = $.$(_this);
          var _pagination = $wrap.find(".progressbar").length>0 ? { el: '.progressbar', type: 'progressbar'}: $wrap.find(".swiper-pagination[data-type='fraction']").length>0 ? { el: '.swiper-pagination', type: 'fraction'} : $wrap.find(".swiper-pagination").length>0 ? { el: '.swiper-pagination', clickable: true}: { el: null, type: null};
          var _nextEl = $wrap.find(".swiper-button-next").length>0 ? ".swiper-button-next": null;
          var _prevEl = $wrap.find(".swiper-button-prev").length>0 ? ".swiper-button-prev": null;
          var _options, _default = {
            speed: 600,
            slidesPerView: 'auto',
            pagination: _pagination,
            navigation: { nextEl: _nextEl, prevEl: _prevEl }
          };
          _options = $.extend(true, {}, _default, _this.gridoption.option||{});
          if(_options.initnum && _options.initnum=="center"){
            var _slidesPerView = _options.slidesPerView ? _options.slidesPerView : 1;
            _options.initialSlide = Math.floor(($wrap.find(".swiper-slide").length-_slidesPerView)/2);
          }
          _this.swiper = new Swiper(_this, _options);
        }
      },
      aniclass : {
        init : function(_this){
          var classname = _this.gridoption.classname || "ani-visible";
          new ScrollMagic.Scene({triggerElement: _this, triggerHook: 1}) /* duration: _win.h*2, offset: Math.floor(_win.h/2)*-1.5,  */
                .setClassToggle(_this, classname) // add class toggle
                .addTo(_page.scrollcontroller);
        }
      },
      gnbclass : {
        init : function(_this){
          if(!_this.gridoption.classname || !_page.layout.$header) return;
          var classname = _this.gridoption.classname, _$header = _page.layout.$header;
          _this.scene = new ScrollMagic.Scene({triggerElement: _this, triggerHook: 0, duration: _win.h})
          .addTo(_page.scrollcontroller)
          .on("enter leave", function (e) {
            var _isEnter = e.type == "enter";
            _$header.removeClass("normal trans trans-2");
            if(_isEnter) _$header.addClass(classname);
            _this.scene.duration(_win.h);
          });
        }
      },
      ratio : {
        el : [],
        init : function(_this){
          var isEl = false;
          for(i in this.el){
            if(this.el[i]==_this) return;
          }
          this.el.push(_this);
        }
      },
      pin : {
        init : function(_this){
          var $this = $.$(_this), isTrigger = _this.gridoption.trigger, _$triggerEl = isTrigger ? $this.closest(isTrigger) : $this;
          var classname = _this.gridoption.classname || "fixed";
          _this.scene = new ScrollMagic.Scene({triggerElement: _$triggerEl.get(0), triggerHook: 0, duration: isTrigger?_$triggerEl.height():null})
                .addTo(_page.scrollcontroller)
                .on("enter leave", function (e) {
                  var _isEnter = e.type == "enter";
                  if(_isEnter){
                    $this.replaceClass("(not\-fixed)",classname);
                    if(isTrigger) _this.scene.duration(_$triggerEl.get(0).offsetHeight);
                  }else{
                    $this.replaceClass("(fixed)","not-fixed").children().css("margin-top",0);
                    if(isTrigger) _this.scene.duration(_$triggerEl.get(0).offsetHeight);
                  }
                });
        }
      },
      init : function($wrap){
        if(!$wrap || $wrap.length==0) return;
        $.each($wrap, function(){
          var _this = this;
          _this.gridoption = $.$(_this).data("grid");
          if(_this.gridoption.case) _page.grid[_this.gridoption.case].init(_this);
        });
      }
    },
    reInit : function($wrap){
      var _ = _page, isReInit = true;
      if(!_.$body) return;
      if(!$wrap) $wrap = _.$body, isReInit = false;
      if(_win.h==0) _win.h = _page.$win.height(), _win.w = _page.$win.width();
      _player.init($wrap); //youtube 플레이어 셋

      $wrap.findFilter('[data-tab]').tab();
      $wrap.findFilter('[data-dropdown]').dropdown();
      _.grid.init($wrap.findFilter('[data-grid]'));
      swipeset.init($wrap.find('div[data-swipe]').not(".swipe-initialized")); //swipe tab
      setTimeout(function(){ $wrap.findFilter('dl[data-accordion], table[data-accordion], div[data-accordion], ul[data-accordion]').accordion(); }, 200);
      _evt.init($wrap, isReInit);
    },
    layout : {
      $header : null, $footer : null,
      menu : {
        active : null, clear : null, $nav : null,
        subShow : function(){
          var _ = _page.layout;
          clearTimeout(_.menu.clear);
          if(_.menu.active) _.menu.active.first().removeClass("active");
          _.$header.addClass("hover");
        },
        subHide : function(){
          var _ = _page.layout;
          clearTimeout(_.menu.clear);
          if(_.menu.active) _.menu.active.first().addClass("active");
          _.$header.removeClass("hover");
          //.$nav
        },
        hideTime : function(){
          var _ = _page.layout;
          clearTimeout(_.menu.clear);
          if(!_.menu.$nav.find(":focus").length) _.menu.clear = setTimeout(_.menu.subHide.bind(this),100);
        },
        _click : function($wrap, callback, e){ var _wrap = $wrap[0]; if(e.target !== _wrap && !$.contains(_wrap, e.target)) callback.call(this); },
        search : {
          $el : null,
          open : function(e){
            var _ = this;
            _.$header.addClass("opend-search");
            $(".wrap").off("click.allmenubodycheck").on("click.allmenubodycheck", _.menu._click.bind(_, _.menu.search.$el, _.menu.search.close)); //딤클릭시 닫힘
            e && e.preventDefault();
          },
          close : function(e){
            var _ = this;
            _.$header.removeClass("opend-search");
            $(".wrap").off("click.allmenubodycheck"); //딤클릭시 닫힘
            e && e.preventDefault();
          },
          toggle : function(e){
            var _ = this;
            if(_.$header.is(".opend-search")) _.menu.search.close.call(_);
            else _.menu.search.open.call(_);
            e && e.preventDefault();
          }
        },
        init : function(){
          var layout = _page.layout, _ = this;
          _.active = layout.menu.$nav.find(".active");
          if(!_.active) _.active = null;
          layout.$header.off("mouseenter.gnbhover mouseleave.gnbhover", ".dep").off("focus.gnbhover blur.gnbhover", "a, button")
            .on("mouseenter.gnbhover", ".dep", _.subShow).on("mouseleave.gnbhover", ".dep", _.hideTime).on("focus.gnbhover", ".nav a, .nav button", _.subShow).on("blur.gnbhover", ".nav a, .nav button", _.hideTime);
          layout.menu.search.$el = layout.$header.find(".head-search");
          layout.menu.search.$el.find(".toggle").click(layout.menu.search.toggle.bind(layout));
        }
      },
      init : function(){
        var _ = this;
        _.$header = $(".header");
        if(!_.$header.length){
          _.$header = null;
        }else{
          _.menu.$nav = _.$header.find(".nav");
          if(!_.menu.$nav.length) _.menu.$nav = null;
          else _.menu.init();
        }
        _.$footer = $(".footer");
        if(!_.$footer.length) _.$footer = null;
        _win.size.header = _.$header?_.$header.height():0;
        _win.size.fixtop = _.$header?_.$header.offset().top:0;
        _win.size.footer = _.$footer?_.$footer.height():0;
        $(".vis").addClass("ani"); //비주얼 등장 모션
      }
    },
    init : function(){
      var _ = this;
      _.docTitle(document.title);
      _.scrollcontroller = new ScrollMagic.Controller();
      _.layout.init();
      _.reInit();
    }
  };

  $(document).ready(function(){
    _page.$html= $("html");
    _page.$body = $("body");
    _page.init();
  });

  var _player = {
    nowPlayer : null,
    evt : {
      oncanplay : function(){
        this.isready = true;
        if(!this.aborted){
          this.playVideo = function(){ this.play(); };
          this.stopVideo = function(){ this.pause(); this.currentTime = 0; };
          this.pauseVideo = function(){ this.pause(); };
          //this.play();
          //if(_.nowPlayer==this) this.play();
          //else this.pause();
        }
      },
      onerror : function(){ this.aborted = true; },
      onplay : function(){  /* this.muted = false; */ _player.nowPlayer = this, this.$wrap.addClass("playing"); },
      onpause : function(){ /* $target.removeClass("playing"); */ },
      onplayend : function(){ this.$wrap.removeClass("playing"); },
      onPlayerReady : function(event){
        $(event.target.h.offsetParent).addClass("ready");
        event.target.setPlaybackQuality('hd720');
        if(_player.nowPlayer===true) _player.nowPlayer = event.target;
        if(_player.nowPlayer && _player.nowPlayer==event.target) event.target.playVideo();
      },
      onPlayerStateChange : function(event){
        if(event.target.h.offsetParent){
          var $now = $(event.target.h.offsetParent), _now = $now.get(0);
          if( event.data === 1 ) _player.nowPlayer = _now.ytplay, $now.addClass("playing"); // 재생중
          if( event.data === 5 || event.data === 2 ) $now.removeClass("playing"); // 정지
          if( event.data === 0 ){
            $now.removeClass("playing"); // 종료
            //if(_now.ismain) $(".intro-tab [data-act='tab']").eq(1).trigger("click.tab");
          }
        }
      }
    },
    set : {
      mp4 : function(video, conf){
        var _ = _player, $video = $.$(video), _default, _conf;
        video.aborted = false;
        video.$wrap = $video.parent();
        _default = { canplay: _.evt.oncanplay, play: _.evt.onplay, ended: _.evt.onplayend, pause: _.evt.onpause, error: _.evt.onerror };
        _conf = $.extend({}, _default, conf||{});

        $video.off(_conf).on(_conf);
      },
      isYtAPI : false,
      YTAPI: function() {
        _player.set.isYtAPI = true;
        var tag = document.createElement('script'),
             firstScriptTag = document.getElementsByTagName('script')[0];
        tag.src = "https://www.youtube.com/iframe_api";
        tag.classList.add('ytapi');
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      },
      yt : function(video, conf){
        if(!_player.set.isYtAPI || !(YT && YT.Player)){
          if(!_player.set.isYtAPI) _player.set.YTAPI();
          setTimeout(_player.set.yt.bind(this, video, conf), 100);
          return false;
        }
        var _ = _player, _default, _conf, _video;
        _default = {
          playerVars: { autoplay:0, loop:0, controls:0, mute:0, playsinline:1, hd:1, vq:"hd720", wmode:"opaque", enablejsapi:1, modestbranding:1, disablekb:1, fs:0, showinfo:0, rel:0, autohide:1 },
          events: {
            onReady: _.evt.onPlayerReady,
            onStateChange: _.evt.onPlayerStateChange
          }
        };
        _conf = $.extend(true, {}, _default, conf||{});
        if(_conf.playerVars.loop) _conf.playerVars.playlist = _conf.videoId;
        var _p = video.parentNode;
        _p.ytplay = new YT.Player(video, _conf);
        if(_conf.togglebtn) _conf.togglebtn.onclick = function(e){ return _p.ytplay && _p.ytplay.playVideo && _p.ytplay.playVideo(); };
      }
    },
    init : function($wrap){
      $wrap.findFilter("[data-player]").each(function(){
        var $this = $.$(this), $p = $this.parent();
        var _conf = $.extend({}, $this.data("player"));
        if(_conf.videoId){
          var btn = $p.find(".playbtn");
          $p[0].ismain = $this.closest(".main-section").length;
          if(btn.length>0) _conf.togglebtn = btn[0];
          _player.set.yt(this, _conf);
        }
      });
    }
  };

  //public - common
  ui._win = _win;
  ui.reInit = _page.reInit;
  ui.loading = {
    $obj : null, objhtml : '<div class="loading visible"><div class="ui-spinner"><div class="spinner-blade"></div><div class="spinner-blade"></div><div class="spinner-blade"></div><div class="spinner-blade"></div><div class="spinner-blade"></div><div class="spinner-blade"></div><div class="spinner-blade"></div><div class="spinner-blade"></div><div class="spinner-txt">Loading...</div></div></div>',
    enable : function(){
      if(!this.$obj){
        this.$obj = $(this.objhtml);
        $("body").prepend(this.$obj);
      }else{ this.$obj.addClass("visible"); }
    },
    disable : function(){
      this.$obj&&this.$obj.removeClass("visible");
    }
  };

})(this, this.ui = this.ui || {});