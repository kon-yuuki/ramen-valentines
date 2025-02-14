import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class Heart {
  constructor(canvasId, width = 100, height =100) {
    this.canvasId = canvasId;
    this.width = width;
    this.height = height;
    this.rotationAngles = {
      x: 15,
      y: 0,
      z: 15
    };
    this.scene = null;
    this.camera = null;
    this.model = null;
    this.renderer = null;
    this.baseRotationSpeed = 0.5;  // 基本の回転速度をここで設定
    this.rotationSpeed = this.baseRotationSpeed;  // 現在の回転速度
    this.currentRotation = 0;
    this.floatingY = 0;
    this.isVisible = false;  // 表示状態の管理を追加
    
    if (!Heart.modelCache) {
      Heart.modelCache = null;
      Heart.modelLoading = null;
    }
    
    this.initialize();
  }

  // モデルを読み込む共通関数
  static async loadModel() {
    if (Heart.modelCache) {
      return Heart.modelCache.clone();
    }

    if (Heart.modelLoading) {
      return await Heart.modelLoading;
    }

    Heart.modelLoading = new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        `${__BASE_PATH__}model/heart.gltf`,
        (gltf) => {
          Heart.modelCache = gltf.scene;
          resolve(gltf.scene.clone());
        },
        (progress) => {
          console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        reject
      );
    });

    return await Heart.modelLoading;
  }

  async initialize() {
    this.setupRenderer();
    this.setupScene();
    await this.setupModel();
    this.setupFloatingAnimation();
    this.setupScrollAnimation();
    this.animate();
  }

  setupRenderer() {
    const canvas = document.querySelector(`#${this.canvasId}`);
    if (!canvas) {
      throw new Error(`Canvas with id "${this.canvasId}" not found`);
    }
  
    canvas.classList.remove('is-visible');
  
    const rotX = parseFloat(canvas.dataset.rotationX);
    const rotY = parseFloat(canvas.dataset.rotationY);
    const rotZ = parseFloat(canvas.dataset.rotationZ);
    const rotSpeed = parseFloat(canvas.dataset.rotationSpeed);
  
    if (!isNaN(rotX)) this.rotationAngles.x = rotX;
    if (!isNaN(rotY)) this.rotationAngles.y = rotY;
    if (!isNaN(rotZ)) this.rotationAngles.z = rotZ;
    if (!isNaN(rotSpeed)) {
      this.baseRotationSpeed = rotSpeed;  // 基本速度を更新
      this.rotationSpeed = rotSpeed;      // 現在の速度も更新
    }
  
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
    this.camera.position.set(0, 0, 8);

    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(-5, 5, 5);
    this.scene.add(directionalLight);
  }

  async setupModel() {
    try {
      this.model = await Heart.loadModel();
      this.model.scale.set(1, 1, 1);
      this.model.position.set(0, 0, 0);
      this.scene.add(this.model);
      // モデルのロード完了後にcanvasを表示
    const canvas = document.querySelector(`#${this.canvasId}`);
    if (canvas) {
      canvas.classList.add('is-visible');
    }
    } catch (error) {
      console.error('Error loading model:', error);
    }
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
    const canvas = document.querySelector(`#${this.canvasId}`);
  
    // Intersection Observerの設定
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible = true;
        } else {
          this.isVisible = false;
          // 画面外に出たら基本速度に戻す
          this.rotationSpeed = this.baseRotationSpeed;
        }
      });
    });
  
    this.observer.observe(canvas);
  
    // スクロールイベントの設定
    const handleScroll = () => {
      if (!this.isVisible) return;  // 表示されていない場合は処理しない
  
      const st = window.scrollY || document.documentElement.scrollTop;
      scrollSpeed = Math.abs(st - lastScrollTop);
      lastScrollTop = st;
  
      // 基本速度を基準に回転速度を更新
      gsap.to(this, {
        rotationSpeed: this.baseRotationSpeed + (scrollSpeed * 0.8),
        duration: .2,
        ease: "none"
      });
  
      // スクロールが止まったら基本速度に戻る
      gsap.to(this, {
        rotationSpeed: this.baseRotationSpeed,
        duration: .5,
        delay: 0,
        ease: "none"
      });
    };
  
    window.addEventListener('scroll', handleScroll);
    
    // cleanup用に参照を保持
    this.scrollHandler = handleScroll;
  }

  animate() {
    // このインスタンス固有のアニメーションループを保持
    const animateThis = () => {
      // このインスタンスのrequestAnimationFrameを保持
      this.animationFrameId = requestAnimationFrame(animateThis);

      if (this.model) {
           // 設定された角度を適用（度からラジアンに変換）
           this.model.rotation.x = Math.PI * this.rotationAngles.x / 180;
           this.model.rotation.z = Math.PI * this.rotationAngles.z / 180;
        
        // Y軸の回転はスクロールアニメーションと組み合わせる
        this.currentRotation += this.rotationSpeed * 0.02;
        this.model.rotation.y = this.currentRotation + (Math.PI * this.rotationAngles.y / 180);
      }

      // このインスタンス固有のrendererを使用
      this.renderer.render(this.scene, this.camera);
    };

    animateThis();
  }

  // クリーンアップのためのメソッドを追加
  dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  
    // Intersection Observerのクリーンアップ
    if (this.observer) {
      this.observer.disconnect();
    }
  
    // スクロールイベントリスナーのクリーンアップ
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.scene) {
      this.scene.traverse(object => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
  }
}

export default Heart;

