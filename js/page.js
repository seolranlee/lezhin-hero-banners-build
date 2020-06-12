var Page = (function() {
  //   import axios from "axios";
  var winW;
  var oldDeviceType;
  var currentDeviceType;

  var slider;

  var canUseWebP = function() {
    var elem = document.createElement("canvas");

    if (!!(elem.getContext && elem.getContext("2d"))) {
      // was able or not to get WebP representation
      return elem.toDataURL("image/webp").indexOf("data:image/webp") == 0;
    }

    // very old browser like IE 8, canvas not supported
    return false;
  };

  var getData = function(device, count) {
    var url = `https://79f1529b-9999-4c7a-b478-ee9b5432084f.mock.pstmn.io/banners?device=${device}&count=${count}&webp=${canUseWebP()}`;
    var options = {
      method: "GET",
      headers: new Headers(),
      mode: "cors",
      cache: "default"
    };

    var req = new Request(url, options);

    return new Promise(function(resolve, reject) {
      fetch(req)
        .then(response => {
          return response.json();
        })
        .then(data => {
          resolve(data);
        });
    });
  };

  /*=========================================================== [ addevent ] =======================================================================*/
  var checkResponsiveType = function() {
    winW = window.innerWidth || document.documentElement.clientWidth;
    oldDeviceType = currentDeviceType;

    if (winW <= 640) {
      currentDeviceType = "mobile";
    } else {
      currentDeviceType = "desktop";
    }
  };

  var render = function() {
    var desktopImages;
    var mobileImages;
    // promise all
    var desktopPromise = getData("desktop", 4);
    var mobilePromise = getData("mobile", 4);

    Promise.all([desktopPromise, mobilePromise])
      .then(datas => {
        desktopImages = datas[0];
        mobileImages = datas[1];
      })
      .then(function() {
        $(".hero-slides").html("<ul></ul>");
        desktopImages.forEach((image, index) => {
          $(".hero-slides>ul").append(
            `<li class="slide-${index + 1}">
              <picture class="banner-image">
                  <source media="(max-width: 639px)" srcset="${
                    mobileImages[index].image
                  }">
                  <img src="${image.image}" alt="People">
              </picture>
            </li>`
          );
        });
      })
      .then(function() {
        slider = new sliderUtil({
          selector: $(".hero-slides>ul"),
          easing: "ease-out",
          loop: false,
          currentDeviceType
        });
      });
  };

  var addEvent = function() {
    window.addEventListener("resize", onResize);
    onResize();
  };

  var onResize = function() {
    winW = window.innerWidth;
    winH = window.innerHeight;
    checkResponsiveType();
    if (slider) slider.sliderResize(currentDeviceType);
  };

  /*=========================================================== [ init ] =======================================================================*/
  var _init = function() {};

  var _load_init = function() {
    addEvent();
    render();
  };
  return {
    init: _init,
    load_init: _load_init
  };
})();

/*=========================================================== [ ready / load ] =======================================================================*/

$(window).on("ready", function() {
  Page.init();
});
$(window).on("load", function() {
  Page.load_init();
});
