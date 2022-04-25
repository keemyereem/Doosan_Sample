$(function() {
    //	var vh = window.innerHeight * 0.01;
    //	document.documentElement.style.setProperty("--vh", +vh+'px');
    
        var $window = $(window)
        $(".gnb > ul").clone().appendTo(".sitemap nav");
    
        $(".gnb > ul > li").hover(function(){
            $(this).children().next().stop().slideDown()
        }, function(){
            $(this).children().next().stop().slideUp()
        })
        
        $(".close").on("click", function(){
            if($(window).width() < 1200){
                $("body").css("overflowY","scroll")
            }
            $(".sitemap").removeClass("on")
            $(".sitemap nav > ul > li").removeClass("on")
            $(".sitemap nav > ul > li > a").next().stop().slideUp()
            $(".sitemap nav > ul > li > ul > li > span").next().stop().slideUp()
        })
        $(".m_btn").on("click", function(){
            if($(window).width() < 1200){
                $("body").css("overflowY","hidden")
            }
            $(".sitemap").addClass("on")
        })
    
        $(".header_ui .search").on("click", function(){
            $(".header_ui .search").toggleClass("on")
            $(".header .search_box").stop().slideToggle()
            if($(".header_ui .search").hasClass("on")){
                $(".header .search_box input").val("")
            }
        })
    
        $(".footer .top_btn").on("click", function(){
            $("html,body").animate({scrollTop: 0},600)
        })
        
        $(".wrap, .sub").on("click", function(){
            if($(".header_ui .search").hasClass("on")){
                $(".header_ui .search").removeClass("on")
                $(".header .search_box").stop().slideUp()
                $(".header .search_box input").val("")
            }
        })
        $(".page_btn ul li").hover(function(){
            var img = $(this).find("img");
            if(img.size()){
                img.attr("src", img.attr("src").replace("_off","_on"))
            }
        },function(){
            var img = $(this).find("img");
            if(img.size()){
                img.attr("src", img.attr("src").replace("_on","_off"))
            }
        })
    
        $window.on("load resize", function(){
            if($window.width() > 1200){
                 hoverGnb()
            } else{
                
                console.log(1)
                clickGnb()
            }
            
        })
        function hoverGnb(){
            $(".sitemap nav > ul > li > a").off("click")
            $(".sitemap nav > ul > li > ul > li > span").off("click")
            $(".sitemap nav > ul > li > ul > li > span").next().stop().slideDown()
            $(".sitemap nav > ul > li").hover(function(){
                var idx = $(this).index();
                if($window.width() > 1200){
                    $(".sitemap .left_bg").css({
                        backgroundImage: "url(/img/common/sitemap0"+(idx + 1)+".jpg)"
                    })
                } else{
                    $(".sitemap .left_bg").css({
                        backgroundImage: "url(/img/common/m_sitemap0"+(idx + 1)+".jpg)"
                    })
                }
                
                $(this).addClass("on")
                $(this).children().next().stop().fadeIn().css("display", "inline-block");
                
            }, function(){
                $(this).removeClass("on")
                $(this).children().next().stop().fadeOut()
            })
        }
    
        function clickGnb(){
            $(".sitemap nav > ul > li").off("mouseenter mouseleave")
            $(".sitemap nav > ul > li > a").off().on("click", function(e){
                e.preventDefault();
                var idx = $(this).parent().index();
                if($(this).children().size() == 1){
                    e.preventDefault();
                }
                if($window.width() > 1200){
                    $(".sitemap .left_bg").css({
                        backgroundImage: "url(/img/common/sitemap0"+(idx + 1)+".jpg)"
                    })
                } else{
                    $(".sitemap .left_bg").css({
                        backgroundImage: "url(/img/common/m_sitemap0"+(idx + 1)+".jpg)"
                    })
                }
                $(this).parent().toggleClass("on")
                $(".sitemap nav > ul > li > a").not(this).parent().removeClass("on")
                $(this).next().stop().slideToggle().css("display", "inline-block");
                $(".sitemap nav > ul > li > a").not(this).next().stop().slideUp()
            })
    
            $(".sitemap nav > ul > li > ul > li > a").off().on("click", function(e){
                if($(this).next().size() == 1){
                    e.preventDefault();
                }
                $(this).next().stop().slideToggle().css("display", "inline-block");
                $(".sitemap nav > ul > li > ul > li > span").not(this).next().stop().slideUp()
            })
        }
        
        window.onpageshow = function(event) {
            if ( event.persisted || (window.performance && window.performance.navigation.type == 2)) {
                $("input, textarea").val("");
                $("input:checkbox").attr("checked", false);
            }
        }
    
        //�쒕툕 lnb
        $(".sub .lnb .w1400 ul li p").on("click", function(){
            $(this).next().stop().slideToggle()
            $(".sub .lnb .w1400 ul li p").not(this).next().stop().slideUp()
        })
    
        //�쒕툕�섏씠吏�
        for (var i = 1; i <= 5; i++) {
            $(".gnb .sub_depth0"+ i).clone().appendTo(".lnb .lnb_depth0"+ i +" nav");
        };	
    
        var $winUrl = location.pathname;
        lnbFn($(".gnb .sub_depth > li"));
    
        function lnbFn(obj){
            obj.find("a").each(function(){
                $menuUrl01= $(this).attr("href");
                $res = $menuUrl01.split("/");
                var resLast = $res[$res.length-1];
                if ($winUrl.match(resLast)){
                    $(this).parent().addClass("on");
                    $(this).parent().parent().clone().appendTo('.lnb_depth2 nav')
                    if($(this).parents().hasClass("chk")){
                        var text2 = $(this).text()
                        var text1 = $(this).parents(".chk").children("a").text()
                        $(".sub .lnb .w1400 > ul > li.lnb_depth p span").text(text1)
                        $(".sub .lnb .w1400 > ul > li.lnb_depth2 p span").text(text2)
                    } else{
                        var text2 = $(this).text()
                        $(".sub .lnb .w1400 > ul > li.lnb_depth p span").text(text2)
                        $(".sub .lnb .w1400 > ul > li.lnb_depth2").hide()
                    }
                }
            });
        }
        //�뚮씪誘명꽣媛�
        function getParameter(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
        var s_cate = getParameter("s_cate");
        console.log(s_cate)
        if(s_cate){
            $(".sub .lnb .w1400 > ul > li.lnb_depth p span").text(s_cate)
            $(".sub .lnb .w1400 > ul > li.lnb_depth2").hide()
        }
        
    }); 