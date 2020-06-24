# Lezhin 엔터테인먼트 프론트엔드 과제

> 데스크탑과 모바일 모두를 지원하는 히어로배너 UI모듈을 개발

[Demo Github Page](https://seolranlee.github.io/lezhin-hero-banners-build/)

## Content

1. [개발 환경](#dev-spec)
2. [Initialize Slider](#installation)
3. [과제 요구사항](#requirement)
4. [과제 핵심 해결전략](#solution)

<h2 id="dev-spec">
    1. 개발환경
</h2>

#### Client

- JavaScript
- jQuery
- Sass

### 1.1 Project folder structure

```bash
lezhin-hero-banners
├── css/
├── img/
├── js/
│   ├── utils/
│   ├── vendor/
│   └── page.js
├── sass/
│   ├── common/
│   ├── page.scss/
│   └── reset.sass
└── index.html
```

#### js/page.js

슬라이더를 초기화 하기 전에 api와 통신해 슬라이더 리스트에 들어갈 데이터 이미지 url을 가져오고 돔을 구성하는 로직 구현. 리사이징 이벤트 발생시 현재 device type을 체크하고 slider.sliderResize를 호출한다.

#### js/utils/sliderUitl.js

히어로 배너 슬라이더 모듈에 관련된 로직 구현.

---

<h2 id="installation">
    2. Initialize Slider
</h2>

### Slider HTML Layout

```html
<div id="hero-banner-list">
  <div class="hero-wrapper">
    <div class="hero-slides">
      <ul></ul>
    </div>
  </div>
</div>
```

### Initialize Slider

```javascript
var slider = new sliderUtil({
  selector: $(".hero-slides>ul"),
  easing: "ease-out",
  loop: true,
  currentDeviceType
});
```

### 2.1 Slider Parameters

| Parameter         | Type                 | Default   | Description                                      |
| ----------------- | -------------------- | --------- | ------------------------------------------------ |
| selector          | string / HTMLElement | null      | 슬라이드 선택자                                  |
| indicator         | boolean              | true      | 인디게이터 표시 여부                             |
| navigation        | boolean              | true      | 네비게이터 표시 여부                             |
| easing            | string               | 'linear'  | 슬라이드 간 transition easing값                  |
| duration          | number               | 200       | 슬라이드 간 transition duration (in ms)          |
| speed             | number               | 1000      | autoStart=true 설정시 슬라이드 전환 속도 (in ms) |
| loop              | boolean              | true      | 슬라이드 무한 순환 여부                          |
| autoSlide         | boolean              | false     | 슬라이드 자동 전환 여부                          |
| currentDeviceType | string               | 'desktop' | 슬라이드 Initialize 시점의 디바이스 타입         |

### 2.2 Slider Methods

| Methods                                | Description                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| slider.init                            | 슬라이드 최초 initializing                                                     |
| slider.addEvent(currentDeviceType)     | 슬라이드 생성 후 이벤트 attach                                                 |
| slider.moveNext(event)                 | 다음 슬라이드로 이동                                                           |
| slider.movePrev(event)                 | 이전 슬라이드로 이동                                                           |
| slider.goToSlide(page, time)           | page값의 슬라이드 순번으로 time(in ms)의 슬라이드 transition duration으로 이동 |
| slider.startAuto()                     | 슬라이드 자동 전환 시작                                                        |
| slider.stopAuto()                      | 슬라이드 자동 전환 멈춤                                                        |
| slider.sliderResize(currentDeviceType) | 페이지 리사이징 시 currentDeviceType에 맞춰서 실행                             |

---

<h2 id="requirement">
    3. 과제 요구 사항
</h2>

## 스펙

전반적인 형태는 www.lezhin.com의 히어로 배너를 참고.

### 3.1 데스크탑

- [x] 좌/우측에 배너 이미지를 넘길 수 있는 네비게이션 버튼이 존재한다.
- [x] 하단에 현재 배너 이미지의 순서를 알 수 있도록 인디게이터가 존재한다.
- [x] 좌측 네비게이션 버튼을 클릭하면 이전 배너 이미지로 슬라이드되며 인디게이터도 갱신된다.
- [x] 우측 네비게이션 버튼을 클릭하면 다음 배너 이미지로 슬라이드되며 인디게이터도 갱신된다.
- [x] 인디게이터를 클릭하면 선택된 인디게이터 순서에 맞는 배너 이미지로 슬라이드되며 인디게이터도 갱신된다.

### 3.2 모바일

- [x] 모바일에서는 네비게이션 버튼이 없고 인디게이터만 존재한다.
- [x] 왼쪽에서 오른쪽으로 터치 스와이프하면 이전 배너 이미지로 슬라이드되며 인디게이터도 갱신된다.
- [x] 오른쪽에서 왼쪽으로 터치 스와이프하면 다음 배너 이미지로 슬라이드되며 인디게이터도 갱신된다.
- [x] 인디게이터를 터치하면 선택된 인디게이터 순서에 맞는 배너 이미지로 슬라이드되며 인디게이터도 갱신된다.

### 3.3 공통

- [x] resize 및 orientationchange 이벤트 발생 시 스크린 너비를 기준으로 데스크탑/모바일 모드가 변환된다.
- [x] 데스크탑/모바일 모드 변경 시 해당 모드에 필요한 배너 이미지를 불러와 렌더링한다.

### 3.4 선택 옵션(우대)

- [x] 기본적으로 슬라이드는 무한 순환되며 infinity 옵션을 false 로 지정해 무한 순환 기능을 끌 수 있다.
- [x] 기본적으로 사용자 이벤트 발생 시에만 슬라이드 되며 autoSlide 옵션을 true 로 지정해 자동 슬라이드 기능을 켤 수 있다.
- [x] 이미지 확장자를 .webp 로 변경하면 WebP 이미지가 로드된다. 브라우저의 webp 지원 여부를 feature detection하여 jpg, web 둘 중에 하나를 보여줄 수 있다.

---

<h2 id="solution">
    4. 과제 핵심 해결전략
</h2>

- resize 이벤트 발생 시 slider의 공개 메소드인 slider.sliderResize()가 함께 실행된다. 이때 page.js에서 리사이즈 발생 시점마다 detect 하고 있던 currentDeviceType을 인자로 함께 보내주면 slider.sliderResize 실행 시 currentDeviceType에 맞게 인디게이터 표현 여부와 터치 이벤트를 attach할 것인지 detach할 것인지 결정한다.

  ```javascript
  /* .js/utils/sliderUtil.js */

  that.deviceTypeInit = function(currentDeviceType) {
    /* 디바이스 타입이 모바일이면 tocuh이벤트를 attach하고 네비게이터를 감춘다. */
    if (currentDeviceType === "mobile") {
      attachTouchEvent();
      $(".navigation").css("display", "none");
      /* 디바이스 타입이 데스크탑이면 tocuh이벤트를 detach하고 네비게이터를 표시한다.*/
    } else {
      detachTouch();
      $(".navigation").css("display", "block");
    }
  };

  that.sliderResize = function(currentDeviceType) {
    sliderWidth = sliderWrap.parent().width();
    selector.find("li").css("width", sliderWidth);
    that.goToSlide(count + 1, 0);
    deviceTypeInit(currentDeviceType);
  };
  ```

- banner image url 데이터는 최초 페이지 로드 시 desktop, mobile 모두를 가져와 source 태그의 media 속성을 이용해 스크린 너비에 맞게 취사 선택하여 보여준다.

  ```javascript
  /* .js/page.js */
  var render = function() {
    var desktopImages;
    var mobileImages;

    var desktopPromise = getData("desktop", 4);
    var mobilePromise = getData("mobile", 4);

    /* promise all로 데스크탑 이미지, 모바일 이미지 모두를 불러와 저장한다.*/
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
                  <img src="${image.image}" alt="banners">
              </picture>
            </li>`
          );
        });
      })
  ```

- 리페인트를 고려하여 position, left, right 등과 같이 기하적 변화를 유발하는 속성을 변경하는 방법 대신 transform: translate() 을 변경하여 슬라이드 이동을 구현.

- onTouchMove 이벤트 시 슬라이드 영역 위에서의 수직방향 터치

  - 수평방향으로 움직인 크기가 수직방향으로 움직인 크기보다 클 경우에만 슬라이드 스와이프 이벤트로 간주하는 방법으로 구현.

  ```javascript
  /* .js/utils/sliderUtil.js */
  var onTouchMove = function(e) {
    if (Math.abs(dx) > Math.abs(dy) && e.cancelable) {
      e.preventDefault();
      e.stopPropagation();
      selector.css({
        "-webkit-transform": `translateX(${deltaX}px)`,
        transition: "all ease-out 0s"
      });
    }
  };
  ```

- Postman 을 사용하여 mock Server를 통해 API 구현.

  - get https://79f1529b-9999-4c7a-b478-ee9b5432084f.mock.pstmn.io/banners?device=${device}&count=${count}&webp=${canUseWebP()}

- 앱이 구동되는 브라우저의 webp 지원 여부를 boolean값으로 반환하는 canUseWebP 함수를 구현하여 false로 반환되면 .jpg 확장자의 image url을 지닌 api를 호출, true로 반환되면 .webp 확장자의 image url을 지닌 api를 호출 하는 형태로 구현.

  ```javascript

  /* 캔버스 구동 여부를 통해 webp이 지원 가능한 브라우저인지 판단한다. */
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
    /* canUseWebP 함수의 반환값(true/false)에 따라 api를 호출해준다 */
    var url = `https://79f1529b-9999-4c7a-b478-ee9b5432084f.mock.pstmn.io/banners?device=${device}&count=${count}&webp=${canUseWebP()}`;

  ```
