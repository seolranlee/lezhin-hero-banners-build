var Page = (function() {
  //   import axios from "axios";
  var winW = window.innerWidth || document.documentElement.clientWidth;
  var oldDeviceType;
  var currentDeviceType;

  var slider;
  var desktopImages;
  var mobileImages;

  function canUseWebP() {
    var elem = document.createElement("canvas");

    if (!!(elem.getContext && elem.getContext("2d"))) {
      // was able or not to get WebP representation
      return elem.toDataURL("image/webp").indexOf("data:image/webp") == 0;
    }

    // very old browser like IE 8, canvas not supported
    return false;
  }

  function fetchData(device, count) {
    var url = `https://b6006523-3c2a-4b42-95fa-71d3dc4470c8.mock.pstmn.io/banners?device=${device}&count=${count}&webp=${canUseWebP()}`;
    var options = {
      method: "GET",
      headers: new Headers(),
      mode: "cors",
      cache: "default"
    };

    var req = new Request(url, options);

    return new Promise(function(resolve) {
      fetch(req)
        .then(response => {
          return response.json();
        })
        .then(data => {
          resolve(data);
        });
    });
  }

  function checkResponsiveType(winW) {
    if (winW <= 640) {
      return "mobile";
    }
    return "desktop";
  }

  function getData() {
    var desktopPromise = fetchData("desktop", 4);
    var mobilePromise = fetchData("mobile", 4);

    Promise.all([desktopPromise, mobilePromise])
      .then(datas => {
        desktopImages = datas[0];
        mobileImages = datas[1];
      })
      .then(function() {
        render();
      })
      .then(function() {
        slider = new sliderUtil({
          selector: $(".hero-slides>ul"),
          easing: "ease-out",
          currentDeviceType
        });
      });
  }

  function render() {
    $(".loading").css("display", "none");
    $(".hero-slides").html(`<ul class="slider-wrap"></ul>`);
    desktopImages.forEach((image, index) => {
      $(".hero-slides>ul").append(
        `<li class="slide-list slide-${index + 1}">
              <picture class="banner-image">
                  <source media="(max-width: 640px)" srcset="${
                    mobileImages[index].image
                  }">
                  <img src="${image.image}" alt="banners">
              </picture>
            </li>`
      );
    });
  }

  function onResize() {
    winW = window.innerWidth;
    oldDeviceType = currentDeviceType;
    currentDeviceType = checkResponsiveType(winW);
    if (slider) {
      slider.sliderResize(oldDeviceType, currentDeviceType);
    }
  }

  function addEvent() {
    window.addEventListener("resize", onResize);
    onResize();
  }

  /*=========================================================== [ init ] =======================================================================*/

  function _init() {
    addEvent();
    getData();
  }
  return {
    init: _init
  };
})();

/*=========================================================== [ ready / load ] =======================================================================*/

$(window).on("load", function() {
  Page.init();
});
