'use strict';
import '@splidejs/splide/css/core';
import Splide from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import Lenis from 'lenis';
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

//文字列をspan(任意のクラス付与)で分割する
class Top {
  constructor() {
    this.lenisInit()
    this.textSlider()
    this.slider();
    this.stickySection()
    this.prSlider();
    this.navControl();
    this.scrollRale()
    this.scrollTriggerRefresh()
    this.headerControl()
    this.viewPortObserver()
    new Parallax()
  }

  lenisInit() {
    // DOMContentLoadedを待ってLenisを初期化
    document.addEventListener('DOMContentLoaded', () => {
      const lenis = new Lenis({
        duration: 0.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true
      });

      lenis.on('scroll', ScrollTrigger.update);

      const anchorEls = document.querySelectorAll('a[href^="#"]');

      anchorEls.forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
          event.preventDefault();
          const targetId = anchor.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            lenis.scrollTo(targetElement);
          }
        });
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    });
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

  textSlider() {
    const slider = document.querySelector('.p-top-second__text');
    if (!slider) return;
    const sliderObj = new Splide(slider, {
      type: 'loop',
      autoWidth: true,
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

  // navControl() {
  //   const currentName = document.querySelector('.p-top-nav__ttl--current');
  //   const sectionEls = document.querySelectorAll('.js-section');
  //   const currentNum = document.querySelector('.p-top-nav__numbers--current--inner');
  //   const navEls = document.querySelectorAll('.l-header__nav-item');
  //   const totalSections = sectionEls.length;
  
  //   sectionEls.forEach((section, index) => {
  //     const sectionNumber = index + 1;
  //     const paddedNumber = String(sectionNumber).padStart(2, '0');
  
  //     gsap.to(section, {
  //       scrollTrigger: {
  //         trigger: section,
  //         start: "top center",
  //         end: "bottom center",
  //         onEnter: () => {
  //           currentName.innerHTML = section.id.toUpperCase();
  //           currentNum.innerHTML = paddedNumber;
  //         },
  //         onEnterBack: () => {
  //           currentName.innerHTML = section.id.toUpperCase();
  //           currentNum.innerHTML = paddedNumber;
  //         },
  //         onLeave: () => {
  //           const nextSectionInView = Array.from(sectionEls).some(el => {
  //             const rect = el.getBoundingClientRect();
  //             const viewportCenter = window.innerHeight / 2;
  //             return rect.top <= viewportCenter && rect.bottom >= viewportCenter;
  //           });
  //           if (!nextSectionInView) {
  //             currentName.innerHTML = '';
  //             // currentNumは更新したままにする
  //           }
  //         },
  //         onLeaveBack: () => {
  //           const prevSectionInView = Array.from(sectionEls).some(el => {
  //             const rect = el.getBoundingClientRect();
  //             const viewportCenter = window.innerHeight / 2;
  //             return rect.top <= viewportCenter && rect.bottom >= viewportCenter;
  //           });
  //           if (!prevSectionInView) {
  //             currentName.innerHTML = '';
  //             // currentNumは更新したままにする
  //           }
  //         }
  //       }
  //     });
  //   });
  // }

  navControl() {
    const currentName = document.querySelector('.p-top-nav__ttl--current');
    const sectionEls = document.querySelectorAll('.js-section');
    const currentNum = document.querySelector('.p-top-nav__numbers--current--inner');
    const navEls = document.querySelectorAll('.l-header__nav-item');
    const totalSections = sectionEls.length;
  
    // 現在のカレントクラスを削除する関数
    const removeCurrentClass = () => {
      navEls.forEach(nav => nav.classList.remove('is-current'));
    };
  
    sectionEls.forEach((section, index) => {
      const sectionNumber = index + 1;
      const paddedNumber = String(sectionNumber).padStart(2, '0');
  
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            currentName.innerHTML = section.id.toUpperCase();
            currentNum.innerHTML = paddedNumber;
            // カレントクラスの更新
            removeCurrentClass();
            navEls[index].classList.add('is-current');
          },
          onEnterBack: () => {
            currentName.innerHTML = section.id.toUpperCase();
            currentNum.innerHTML = paddedNumber;
            // カレントクラスの更新
            removeCurrentClass();
            navEls[index].classList.add('is-current');
          },
          onLeave: () => {
            const nextSectionInView = Array.from(sectionEls).some(el => {
              const rect = el.getBoundingClientRect();
              const viewportCenter = window.innerHeight / 2;
              return rect.top <= viewportCenter && rect.bottom >= viewportCenter;
            });
            if (!nextSectionInView) {
              currentName.innerHTML = '';
              // カレントクラスを削除
              removeCurrentClass();
            }
          },
          onLeaveBack: () => {
            const prevSectionInView = Array.from(sectionEls).some(el => {
              const rect = el.getBoundingClientRect();
              const viewportCenter = window.innerHeight / 2;
              return rect.top <= viewportCenter && rect.bottom >= viewportCenter;
            });
            if (!prevSectionInView) {
              currentName.innerHTML = '';
              // カレントクラスを削除
              removeCurrentClass();
            }
          }
        }
      });
    });
  }

  scrollRale() {
    const targetEls = document.querySelectorAll('.js-scroll-rale');
  
    targetEls.forEach(target => {
      gsap.to(target, {
        x: -500,
        ease: "none",
        scrollTrigger: {
          trigger: target,
          start: "top bottom", // 要素のトップが画面の下端に来た時に開始
          end: "bottom top",   // 要素のボトムが画面の上端に来た時に終了
          scrub: true,         // スクロールに追従して動くように
        }
      });
    });
  }

  scrollTriggerRefresh() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.addEventListener('load', () => {
        // 画像が読み込まれた後にScrollTriggerを更新
        ScrollTrigger.refresh();
      });
    });
  }

  headerControl() {
    window.addEventListener("scroll", () => {
      if (scrollY > 10) {
        document.body.classList.add('is-scrolled')
      } else {
        document.body.classList.remove('is-scrolled')
      }
    })
  }
  viewPortObserver() {
    const targetEls = document.querySelectorAll('.js-view-port-observer');
    
    targetEls.forEach((target) => {
      gsap.to(target, {
        scrollTrigger: {
          trigger: target,
          start: "top 80%", // 要素の上端が画面の下端に到達した時
          once: true, // 一度だけ実行
          onEnter: () => {
            target.classList.add('is-active');
          }
        }
      });
    });
  }
  stickySection() {
    const target = document.querySelector('.js-parallax-section');
    
    // マイナスのmargin-bottomを設定
    target.style.marginTop = '-400px';
  
    // ScrollTriggerアニメーションの設定
    gsap.to(target, {
      scrollTrigger: {
        trigger: target,
        start: "top bottom", // targetの上端が画面上端に来た時
        end: `top top`, // targetの下端が画面上端に来た時
        scrub: true, // スクロール量に連動
        // markers: true, //
      },
      marginTop: 0,
      ease: "none"
    });
  }

  parallaxObj(){
    const targetEls = document.querySelectorAll('.js-parallaxObj-target');
  }


}

class Parallax {
  constructor() {
    this.render();
  }

  render() {
    const targetWrapperEls = document.querySelectorAll(".js-parallax-wrapper");

    targetWrapperEls.forEach((wrapper) => {
      const isParallaxDisabled = wrapper.getAttribute("data-parallax-sp") === "false";
      const isMobileSize = window.innerWidth <= 1023;

      // data-parallax-spがfalseかつウィンドウサイズが1023以下の場合、処理をスキップ
      if (isParallaxDisabled && isMobileSize) {
        return; // この要素に対する処理をスキップ
      }

      const targetEls = wrapper.querySelectorAll(".js-parallax-target");

      targetEls.forEach(target => {
        const y = target.getAttribute("data-y") || "100";
        const start = target.getAttribute("data-parallax-start") || "top bottom";
        let end = target.getAttribute("data-parallax-end") || "bottom top";
        const trigger = target.getAttribute("data-parallax-trigger") || wrapper;
        const endTrigger = target.getAttribute("data-parallax-end-trigger") || wrapper;

        // endが"100vh"の場合、window.innerHeightを使用してピクセル値に変換
        if (end === "100vh top") {
          end = `${window.innerHeight}px top`;
        }


        gsap.to(target, {
          y: y,
          scrollTrigger: {
            trigger: trigger,
            endTrigger:endTrigger,
            start: `${start}`,
            end: `${end}`,
            scrub: true,
            easing: 'none',
            // markers: true
          },
        });
      });
    });
  }
}

export default Top;
