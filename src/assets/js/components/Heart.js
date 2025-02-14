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
      x: 15, // degrees
      y: 0,  // degrees
      z: 15  // degrees
    };
    this.scene = null;
    this.camera = null;
    this.model = null;
    this.renderer = null;
    this.rotationSpeed = 0.5;
    this.currentRotation = 0;
    this.floatingY = 0;
    
    // モデルを一度だけ読み込むためのキャッシュ
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
        '/model/heart.gltf',
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

      // 初期状態で非表示に
  canvas.classList.remove('is-visible');

    // データ属性から回転角度を読み取る
    const rotX = parseFloat(canvas.dataset.rotationX);
    const rotY = parseFloat(canvas.dataset.rotationY);
    const rotZ = parseFloat(canvas.dataset.rotationZ);

    // 有効な値が指定されている場合のみ更新
    if (!isNaN(rotX)) this.rotationAngles.x = rotX;
    if (!isNaN(rotY)) this.rotationAngles.y = rotY;
    if (!isNaN(rotZ)) this.rotationAngles.z = rotZ;

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

    // スクロール速度を計算し、回転速度に反映
    window.addEventListener('scroll', () => {
      const st = window.scrollY || document.documentElement.scrollTop;
      scrollSpeed = Math.abs(st - lastScrollTop);
      lastScrollTop = st;

      // スクロール速度に基づいて回転速度を更新
      gsap.to(this, {
        rotationSpeed: 0.5 + (scrollSpeed * 0.8),
        duration: .2,
        ease: "none"
      });

      // スクロールが止まったら徐々に基本速度に戻る
      gsap.to(this, {
        rotationSpeed: 0.5,
        duration: .5,
        delay: 0,
        ease: "none"
      });
    });
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
    // アニメーションループを停止
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Three.jsのリソースを解放
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

  // 他のメソッド（setupFloatingAnimation, setupScrollAnimation, animate）は
  // 前のコードと同じですが、this.rendererを使用するように更新
}

export default Heart;

