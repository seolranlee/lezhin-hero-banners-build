var sliderUtil = (function($) {
  var defaults = {
    selector: null,
    indicator: true,
    navigation: true,
    easing: "linear",
    duration: 200,
    speed: 1000,
    loop: true,
    autoSlide: false,
    currentDeviceType: "desktop"
  };

  var sliderUtil = function(spec) {
    var that = {};
    that.settings = $.extend({}, defaults, spec);

    var selector = that.settings.selector;
    var indicator = that.settings.indicator;
    var navigation = that.settings.navigation;
    var easing = that.settings.easing;
    var duration = that.settings.duration;
    var speed = that.settings.speed;
    var loop = that.settings.loop;
    var autoSlide = that.settings.autoSlide;
    var currentDeviceType = that.settings.currentDeviceType;

    var sliderWrap = selector.parent();
    var sliderWidth = sliderWrap.width();
    var numbers = selector.find("li").length;

    var count = 0;
    var autoSliderId;

    //tocuhEvent
    var touchTarget = selector;
    var isTouchStart = false;
    var sx,
      sy,
      dx,
      dy,
      ox = 0,
      oy = 0;

    var sensitiveX = 40;

    //터치관련
    var onTouchStart = function(e) {
      if (isTouchStart || count >= numbers || count < 0) return;

      var orig = e.originalEvent,
        touchPoints =
          typeof orig.changedTouches !== "undefined"
            ? orig.changedTouches
            : [orig];
      var chromePointerEvents = typeof PointerEvent === "function";
      if (chromePointerEvents) {
        if (orig.pointerId === undefined) {
          return;
        }
      }
      if (touchPoints.length > 1) {
        e.preventDefault();
        return;
      }

      isTouchStart = true;

      sx = touchPoints[0].pageX;
      sy = touchPoints[0].pageY;

      dx = ox;
      dy = oy;
    };

    var onTouchMove = function(e) {
      if (isTouchStart) {
        var orig = e.originalEvent,
          touchPoints =
            typeof orig.changedTouches !== "undefined"
              ? orig.changedTouches
              : [orig];

        dx = touchPoints[0].pageX - sx + ox;
        dy = touchPoints[0].pageY - sy + oy;

        if (loop) {
          deltaX = -(sliderWidth * (count + 1) - dx);
        } else {
          deltaX = -(sliderWidth * count - dx);
        }

        if (Math.abs(dx) > Math.abs(dy) && e.cancelable) {
          e.preventDefault();
          e.stopPropagation();
          selector.css({
            "-webkit-transform": `translateX(${deltaX}px)`,
            transition: "all ease-out 0s"
          });
        }
      }
    };

    var onTouchEnd = function(e) {
      if (isTouchStart) {
        if (dx > sensitiveX) that.movePrev();
        else if (dx < -sensitiveX) that.moveNext();
        else that.goToSlide(count + 1);

        if ((!loop && count + 1 >= numbers) || (!loop && count <= 0))
          that.goToSlide(count + 1);

        isTouchStart = false;
      }
    };

    var attachTouchEvent = function() {
      touchTarget.on("touchstart MSPointerDown pointerdown", onTouchStart);
      touchTarget.on("touchmove MSPointerMove pointermove", onTouchMove);
      touchTarget.on("touchend MSPointerUp pointerup", onTouchEnd);
    };

    var detachTouch = function() {
      touchTarget.off("touchstart MSPointerDown pointerdown", onTouchStart);
      touchTarget.off("touchmove MSPointerMove pointermove", onTouchMove);
      touchTarget.off("touchend MSPointerUp pointerup", onTouchEnd);
    };

    var moveSlide = function(moveDis, time) {
      if (time === undefined) time = duration;
      selector.css({
        "-webkit-transform": `translateX(-${moveDis}px)`,
        transition: `all ${easing} ${time / 1000}s`
      });
    };

    var cloning = function() {
      var appendClone = selector
        .find("li:first-child")
        .clone()
        .addClass("clone");
      var preClone = selector
        .find("li:last-child")
        .clone()
        .addClass("clone");
      selector.append(appendClone).prepend(preClone);
    };
    var createIndicator = function() {
      var pageEl = $(`<div class="indicator"></div>`);
      for (var i = 0; i < numbers; i++) {
        if (i === 0) {
          pageEl.append(`<span class="on bullet"></span>`);
        } else {
          pageEl.append(`<span class="bullet"></span>`);
        }
      }
      sliderWrap.append(pageEl);
    };
    var createNavigation = function() {
      var navEl = $(
        `
        <div class="navigation">
          <button class="navPrev"></button>
          <button class="navNext"></button>
        </div>
        `
      );
      sliderWrap.append(navEl);
    };

    /*================================================== [ method ] ==========================================================*/

    that.init = function() {
      selector.addClass("slider-wrap");
      selector.find("li").css("width", sliderWidth);
      if (loop) {
        cloning();
        // 초기 위치 재설정
        moveSlide(sliderWidth, 0);
      }
      if (indicator) createIndicator();
      if (navigation) createNavigation();
      if (autoSlide) that.startAuto();
      that.attachEvent(currentDeviceType);
      that.deviceTypeInit(currentDeviceType);
    };
    that.attachEvent = function(currentDeviceType) {
      sliderWidth = sliderWrap.width();
      selector.find("li").css("width", sliderWidth);

      sliderWrap.find(".navPrev").on("click", function(e) {
        that.movePrev(e);
      });

      sliderWrap.find(".navNext").on("click", function(e) {
        that.moveNext(e);
      });

      sliderWrap.find(".indicator span").on("click", function(e) {
        e.preventDefault();
        var idx = $(this).index() + 1;
        that.goToSlide(idx);
      });

      if (currentDeviceType === "mobile") attachTouchEvent();
      else detachTouch();
    };
    that.moveNext = function(event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
        var target = event.target;
        selector.bind(
          "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
          function() {
            $(target).css("pointer-events", "auto");
            selector.unbind(
              "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"
            );
          }
        );
      }

      // loop
      if (loop) {
        if (event) {
          $(target).css("pointer-events", "none");
        }
        if (count >= numbers - 1) {
          count += 1;
          selector.bind(
            "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
            function() {
              moveSlide(sliderWidth, 0);
              selector.unbind(
                "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"
              );
              count = 0;
            }
          );
        } else {
          count += 1;
        }
        moveSlide(sliderWidth * (count + 1));

        if (count === numbers) {
          sliderWrap.find(".indicator span").removeClass("on");
          sliderWrap
            .find(".indicator span")
            .eq(0)
            .addClass("on");
        } else {
          sliderWrap.find(".indicator span").removeClass("on");
          sliderWrap
            .find(".indicator span")
            .eq(count)
            .addClass("on");
        }
      }

      // not loop
      else {
        if (count >= numbers - 1) {
          return false;
        } else {
          count += 1;
        }
        moveSlide(sliderWidth * count);

        sliderWrap.find(".indicator span").removeClass("on");
        sliderWrap
          .find(".indicator span")
          .eq(count)
          .addClass("on");
      }
    };
    that.movePrev = function(event) {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
        var target = event.target;
        selector.bind(
          "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
          function() {
            $(target).css("pointer-events", "auto");
            selector.unbind(
              "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"
            );
          }
        );
      }
      // loop
      if (loop) {
        if (event) $(target).css("pointer-events", "none");
        if (count <= 0) {
          count -= 1;
          selector.bind(
            "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
            function() {
              moveSlide(sliderWidth * numbers, 0);
              selector.unbind(
                "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"
              );
              count = numbers - 1;
            }
          );
        } else {
          count -= 1;
        }
        moveSlide(sliderWidth * (count + 1));
        sliderWrap.find(".indicator span").removeClass("on");
        sliderWrap
          .find(".indicator span")
          .eq(count)
          .addClass("on");
      }

      // not loop
      else {
        if (count <= 0) {
          return false;
        } else {
          count -= 1;
        }
        moveSlide(sliderWidth * count);
        sliderWrap.find(".indicator span").removeClass("on");
        sliderWrap
          .find(".indicator span")
          .eq(count)
          .addClass("on");
      }
    };
    that.goToSlide = function(page, time) {
      if (time === undefined) time = duration;
      var idx = page - 1;
      sliderWrap.find(".indicator span").removeClass("on");
      sliderWrap
        .find(".indicator span")
        .eq(idx)
        .addClass("on");

      count = idx;
      if (loop) {
        moveSlide(sliderWidth * (count + 1), time);
      } else {
        moveSlide(sliderWidth * count, time);
      }
    };
    that.startAuto = function() {
      autoSliderId = setInterval(function() {
        if (!loop && count >= numbers - 1) return false;
        that.moveNext();
      }, speed);
    };
    that.stopAuto = function() {
      clearInterval(autoSliderId);
    };
    that.deviceTypeInit = function(currentDeviceType) {
      if (currentDeviceType === "mobile") {
        attachTouchEvent();
        $(".navigation").css("display", "none");
      } else {
        detachTouch();
        $(".navigation").css("display", "block");
      }
    };
    that.sliderResize = function(currentDeviceType) {
      sliderWidth = sliderWrap.parent().width();
      selector.find("li").css("width", sliderWidth);
      that.goToSlide(count + 1, 0);
      that.deviceTypeInit(currentDeviceType);
    };

    that.init();

    return that;
  };
  return sliderUtil;
})(jQuery);
