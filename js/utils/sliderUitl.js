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
    var sliderWidth = sliderWrap.parent().width();
    var numbers = selector.find("li").length;

    var count = 0;
    var autoSliderId;

    //tocuhEvent
    var touchTarget = selector;
    var isTouchStart = false;
    var sx, sy, dx, dy;
    var sensitiveX = 40;

    //터치관련
    function onTouchStart(e) {
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
      // startX, startY(시작점)
      sx = touchPoints[0].pageX;
      sy = touchPoints[0].pageY;
    }

    function onTouchMove(e) {
      if (isTouchStart) {
        var orig = e.originalEvent,
          touchPoints =
            typeof orig.changedTouches !== "undefined"
              ? orig.changedTouches
              : [orig];

        dx = touchPoints[0].pageX - sx;
        dy = touchPoints[0].pageY - sy;
        if (loop) {
          deltaX = -(sliderWidth * (count + 1) - dx);
        } else {
          deltaX = -(sliderWidth * count - dx);
        }

        // 가로로 스와이프 한 거리가 세로로 스와이프 한 거리보다 클 때에만 스와이퍼 이벤트로 간주한다.
        if (Math.abs(dx) > Math.abs(dy) && e.cancelable) {
          // 본래 가지는 scrolling 이벤트 취소
          e.preventDefault();
          // e.stopPropagation();
          selector.css({
            "-webkit-transform": `translate3d(${deltaX}px, 0, 0)`,
            transform: `translate3d(${deltaX}px, 0, 0)`,
            transition: "all ease-out 0s"
          });
        }
      }
    }

    function onTouchEnd() {
      if (isTouchStart) {
        if (dx > sensitiveX) that.movePrev();
        else if (dx < -sensitiveX) that.moveNext();
        // 셋팅해준 민감도(sensitiveX)보다 적게 이동했을 때에는 슬라이드 이동을 하지 않는다.
        else that.goToSlide(count + 1);

        // loop 옵이 false일 경우: 첫번째 장이나 마지막 장일 때에 대한 처리
        if ((!loop && count + 1 >= numbers) || (!loop && count <= 0))
          that.goToSlide(count + 1);

        // 터치이벤트 초기화
        isTouchStart = false;
      }
    }

    function addTouchEvent() {
      touchTarget.on("touchstart MSPointerDown pointerdown", onTouchStart);
      $(window).on("touchmove MSPointerMove pointermove", onTouchMove);
      $(window).on("touchend MSPointerUp pointerup", onTouchEnd);
    }

    function removeTouchEvent() {
      touchTarget.off("touchstart MSPointerDown pointerdown", onTouchStart);
      $(window).off("touchmove MSPointerMove pointermove", onTouchMove);
      $(window).off("touchend MSPointerUp pointerup", onTouchEnd);
    }

    function moveSlide(moveDis, time) {
      // time: transition duration을 가지고 움직여야 할 경우와(인디게이터, 네비게이터, 스와이퍼로 이동할 경우) 그렇지 않은 경우가 나뉘어져 있기 때문에(리사이징 시 슬라이드 위치 재조정 시) 옵션으로 가질 수 있게 파라미터로 넣어준다.
      if (time === undefined) time = duration;
      selector.css({
        "-webkit-transform": `translate3d(-${moveDis}px, 0, 0)`,
        transform: `translate3d(-${moveDis}px, 0, 0)`,
        transition: `all ${easing} ${time / 1000}s`
      });
    }

    function cloning() {
      var appendClone = selector
        .find("li:first-child")
        .clone()
        .addClass("clone");
      var preClone = selector
        .find("li:last-child")
        .clone()
        .addClass("clone");
      selector.append(appendClone).prepend(preClone);
    }

    function createIndicator() {
      var pageEl = $(`<div class="indicator"></div>`);
      for (var i = 0; i < numbers; i++) {
        if (i === 0) {
          pageEl.append(`<span class="on bullet"></span>`);
        } else {
          pageEl.append(`<span class="bullet"></span>`);
        }
      }
      sliderWrap.append(pageEl);
    }

    function createNavigation() {
      var navEl = $(
        `
        <div class="navigation">
          <button class="navPrev"></button>
          <button class="navNext"></button>
        </div>
        `
      );
      sliderWrap.append(navEl);
    }

    function deviceTypeDetect(currentDeviceType) {
      if (currentDeviceType === "mobile") {
        addTouchEvent();
        $(".navigation").css("display", "none");
      } else {
        removeTouchEvent();
        $(".navigation").css("display", "block");
      }
    }

    /*================================================== [ method ] ==========================================================*/

    that.init = function() {
      // 공통 init
      selector.find("li").css("width", sliderWidth);
      if (loop) {
        cloning();
        // 초기 위치 재설정(클로닝때문에)
        moveSlide(sliderWidth, 0);
      }
      if (indicator) createIndicator();
      if (navigation) createNavigation();
      if (autoSlide) that.startAuto();
      that.addEvent();

      // devicetype에 따라 다르게 분기되는 init or devicetype이 바뀔때마다 재 설정되어야 하는 init
      deviceTypeDetect(currentDeviceType);
    };

    that.addEvent = function() {
      // navigation event
      sliderWrap.find(".navPrev").on("click", function(e) {
        that.movePrev(e);
      });

      sliderWrap.find(".navNext").on("click", function(e) {
        that.moveNext(e);
      });

      // indicator event
      sliderWrap.find(".indicator span").on("click", function(e) {
        e.preventDefault();
        var idx = $(this).index() + 1;
        that.goToSlide(idx);
      });
    };

    that.moveNext = function(event) {
      if (event) {
        // event.stopPropagation();
        // event.preventDefault();
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
        // event.stopPropagation();
        // event.preventDefault();
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

    that.sliderResize = function(oldDeviceType, currentDeviceType) {
      sliderWidth = sliderWrap.parent().width();
      selector.find("li").css("width", sliderWidth);
      that.goToSlide(count + 1, 0);
      if (oldDeviceType !== currentDeviceType)
        deviceTypeDetect(currentDeviceType);
    };

    that.init();

    return that;
  };

  return sliderUtil;
})(jQuery);
