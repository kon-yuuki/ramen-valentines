import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class Heart {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.model = null;
    this.rotationSpeed = 0.5; // 基本の回転速度
    this.currentRotation = 0;  // 現在の回転角度
    this.floatingY = 0;  // 浮遊アニメーションの現在位置
    
    this.render();
    this.setupScrollAnimation();
  }

  setupFloatingAnimation() {
    // 値の制御用のオブジェクトを作成
    this.floatingAnimation = {
      y: 0
    };

    // 浮遊アニメーションを設定
    gsap.to(this.floatingAnimation, {
      y: 0.3,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        if (this.model) {
          this.model.position.y = this.floatingAnimation.y;
        }
      }
    });
  }

  setupScrollAnimation() {
    let lastScrollTop = 0;
    let scrollSpeed = 0;
    
    // スクロール速度を計算し、回転速度に反映
    window.addEventListener('scroll', () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      scrollSpeed = Math.abs(st - lastScrollTop);
      lastScrollTop = st;

      // スクロール速度に基づいて回転速度を更新
      gsap.to(this, {
        rotationSpeed: 0.5 + (scrollSpeed * 0.2),
        duration: 0.5,
        ease: "none"
      });

      // スクロールが止まったら徐々に基本速度に戻る
      gsap.to(this, {
        rotationSpeed: 0.5,
        duration: 1.5,
        delay: 0,
        ease: "none"
      });
    });
  }

  render() {
    const width = 500;
    const height = 500;

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#fv_heart"),
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    this.camera.position.set(0, 0, 8);

    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(-5, 5, 5);
    this.scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
      '/assets/model/heart.gltf',
      (gltf) => {
        this.model = gltf.scene;
        this.model.scale.set(1, 1, 1);
        this.model.position.set(0, 0, 0);
        this.scene.add(this.model);
        
        // モデルのロード完了後に浮遊アニメーションを開始
        this.setupFloatingAnimation();
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('An error occurred while loading the model:', error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);

      if (this.model) {
        // 固定の傾き
        this.model.rotation.z = Math.PI * 15 / 180;
        this.model.rotation.x = Math.PI * 15 / 180;
        
        // スクロール速度に基づく回転
        this.currentRotation += this.rotationSpeed * 0.02;
        this.model.rotation.y = this.currentRotation;
      }

      renderer.render(this.scene, this.camera);
    };

    animate();
  }
}

export default Heart;