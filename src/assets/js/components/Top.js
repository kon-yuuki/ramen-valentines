'use strict';
import '@splidejs/splide/css/core';
import Splide from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

//文字列をspan(任意のクラス付与)で分割する
class Top {
  constructor() {
    this.slider();
    this.prSlider();
  }

  slider() {
    const slider = document.querySelector('.p-top-share__gallery');
    if (!slider) return;
    const sliderObj = new Splide(slider, {
      perPage: 3,
      type: 'loop',
      padding: { left: '15rem', right: '15rem' },
      gap: '1rem',
      pagination: false,
      focus: 'center',
      speed: 500,
      lazyLoad: true,
      arrows: false,
      autoScroll: {
        speed: 1,
        pauseOnHover: false,
        pauseOnFocus: false,
      },
    });

    sliderObj.mount({ AutoScroll });
  }

  prSlider() {
    const slider = document.querySelector('.p-top-pr__slider');
    if (!slider) return;
    const sliderObj = new Splide(slider, {
      // perPage: 6,
      type: 'loop',
      autoWidth: true,
      // padding: { left: '15rem', right: '15rem' },
      gap: '1rem',
      pagination: false,
      focus: 'center',
      speed: 500,
      lazyLoad: true,
      arrows: false,
      autoScroll: {
        speed: 1,
        pauseOnHover: false,
        pauseOnFocus: false,
      },
    });

    sliderObj.mount({ AutoScroll });
  }
}

export default Top;
