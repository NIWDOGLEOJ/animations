/**
 * DevFest 3D Interactive Brackets WebGL Background (Three.js)
 * Extracted and optimized directly from DevFest Chennai.
 * 
 * Features:
 * - 3D Extruded code brackets with custom bevel geometry
 * - Color shifting across Google brand palette: Blue -> Red -> Yellow -> Green
 * - Smooth scroll-driven orbital path physics + mouse parallax
 * - High-DPI support, self-contained geometry (no external assets required)
 */

const LEFT_BRACKET_PATH = "M4.05005 186.87H19.75C25.34 186.87 29.87 191.4 29.87 197V253.11C29.87 281.08 52.55 303.75 80.52 303.75H115.88C118.12 303.75 119.93 301.94 119.93 299.7V242.88C119.93 240.64 118.12 238.83 115.88 238.83H89.9301C84.3401 238.83 79.8 234.29 79.8 228.7V75.05C79.8 69.46 84.3401 64.93 89.9301 64.93H115.88C118.12 64.93 119.93 63.11 119.93 60.87V4.05C119.93 1.82 118.12 0 115.88 0H80.52C52.55 0 29.87 22.67 29.87 50.64V109.29C29.87 114.88 25.34 119.42 19.75 119.42H4.05005C1.82005 119.42 0 121.23 0 123.47V182.82C0 185.06 1.82005 186.87 4.05005 186.87Z";
const RIGHT_BRACKET_PATH = "M115.88 116.88H100.19C94.5901 116.88 90.0601 112.35 90.0601 106.76V50.64C90.0601 22.67 67.39 0 39.42 0H4.06006C1.82006 0 0 1.82 0 4.05V60.87C0 63.11 1.82006 64.93 4.06006 64.93H30C35.6 64.93 40.13 69.46 40.13 75.05V228.7C40.13 234.29 35.6 238.83 30 238.83H4.06006C1.82006 238.83 0 240.64 0 242.88V299.7C0 301.94 1.82006 303.75 4.06006 303.75H39.42C67.39 303.75 90.0601 281.08 90.0601 253.11V194.47C90.0601 188.87 94.5901 184.34 100.19 184.34H115.88C118.12 184.34 119.93 182.53 119.93 180.29V120.94C119.93 118.7 118.12 116.88 115.88 116.88Z";

export class BracketsField {
  constructor(container, options = {}) {
    this.container = typeof container === "string" ? document.querySelector(container) : container;
    if (!this.container) throw new Error("BracketsField: Container element not found");

    this.options = Object.assign({
      enableMouseParallax: true,
      enableScroll: true,
      autoRotate: true,
      scale: 1.0,
      opacity: 1.0
    }, options);

    this.isDisposed = false;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;

    this.colors = [
      new THREE.Color(0x4285f4), // Google Blue
      new THREE.Color(0xea4335), // Google Red
      new THREE.Color(0xf9ab00), // Google Yellow
      new THREE.Color(0x34a853), // Google Green
      new THREE.Color(0x4285f4)  // Loop back to Blue
    ];

    this.initScene();
    this.createBrackets();
    this.bindEvents();
    this.animate();
  }

  initScene() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.z = 6;

    // Alpha Renderer with Canvas
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);

    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.inset = "0";
    this.renderer.domElement.style.pointerEvents = "none";
    this.renderer.domElement.style.zIndex = "0";
    this.container.appendChild(this.renderer.domElement);

    // Studio Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(-4, 5, 6);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xbcd2ff, 1.2);
    dirLight2.position.set(3, -2, -4);
    this.scene.add(dirLight2);

    this.updateViewportDimensions();
  }

  updateViewportDimensions() {
    this.halfFovTan = Math.tan((this.camera.fov * Math.PI / 180) / 2) * this.camera.position.z;
    this.halfFovWidth = this.halfFovTan * this.camera.aspect;
  }

  createBracketGeometry(pathStr) {
    const shapePath = THREE.SVGLoader.createShapes(
      new THREE.SVGLoader().parse(`<svg><path d="${pathStr}"/></svg>`).paths[0]
    );

    const extrudeSettings = {
      depth: 0.14 * 304,
      bevelEnabled: true,
      bevelThickness: 0.012 * 304,
      bevelSize: 0.009 * 304,
      bevelSegments: 3,
      curveSegments: 20
    };

    const geometry = new THREE.ExtrudeGeometry(shapePath, extrudeSettings);
    geometry.computeBoundingBox();

    const box = geometry.boundingBox;
    const height = box.max.y - box.min.y || 1;
    const scale = 1.4 / height;

    geometry.scale(scale, -scale, scale);
    geometry.center();
    geometry.computeVertexNormals();

    return geometry;
  }

  createBrackets() {
    this.brackets = [];

    const configs = [
      {
        path: LEFT_BRACKET_PATH,
        side: -1,
        seed: 0,
        colorOffset: 0.0,
        baseAngle: Math.PI,
        spinDir: 1
      },
      {
        path: RIGHT_BRACKET_PATH,
        side: 1,
        seed: 4.7,
        colorOffset: 0.5,
        baseAngle: 0,
        spinDir: -1
      }
    ];

    configs.forEach((cfg) => {
      const geometry = this.createBracketGeometry(cfg.path);
      const material = new THREE.MeshStandardMaterial({
        color: 0x4285f4,
        roughness: 0.42,
        metalness: 0.18,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      const group = new THREE.Group();
      group.add(mesh);
      this.scene.add(group);

      this.brackets.push({
        group,
        mesh,
        material,
        geometry,
        config: cfg,
        tempColor: new THREE.Color()
      });
    });
  }

  // Smooth Google 4-color cycling interpolation
  samplePaletteColor(progress, targetColor) {
    const p = ((progress % 1) + 1) % 1 * (this.colors.length - 1);
    const index = Math.floor(p);
    const fraction = p - index;
    targetColor.copy(this.colors[index]).lerp(this.colors[index + 1], fraction);
  }

  bindEvents() {
    this.onResize = () => {
      if (this.isDisposed) return;
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.updateViewportDimensions();
    };

    this.onMouseMove = (e) => {
      if (!this.options.enableMouseParallax) return;
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    this.onScroll = () => {
      if (!this.options.enableScroll) return;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      this.targetScrollProgress = window.scrollY / maxScroll;
    };

    window.addEventListener("resize", this.onResize);
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("scroll", this.onScroll, { passive: true });
  }

  animate() {
    if (this.isDisposed) return;

    requestAnimationFrame(() => this.animate());

    // Lerp smooth mouse & scroll
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.08;

    const time = performance.now() * 0.001;
    const progress = this.scrollProgress;
    const f = 2 * Math.PI * 1.25;
    const h = 2 * Math.PI * 1.5;

    this.brackets.forEach(({ group, material, config, tempColor }) => {
      const angle = config.baseAngle + progress * f + (this.options.autoRotate ? time * 0.2 : 0);
      const v = 0.5 + 0.5 * progress;

      // Orbit positioning
      const posX = Math.cos(angle) * this.halfFovWidth * 0.75 * v + (this.mouse.x * 0.4);
      const posY = Math.sin(angle) * this.halfFovTan * 0.65 * v + (this.mouse.y * 0.3);
      const posZ = -1.0 + 1.2 * Math.sin(progress * Math.PI * 2 + config.seed);

      group.position.set(posX, posY, posZ);

      // Rotations
      group.rotation.x = 0.4 * Math.sin(progress * Math.PI * 2 + config.seed) + (this.mouse.y * 0.2);
      group.rotation.y = (progress * h * 0.55 * config.spinDir) + (this.mouse.x * 0.3);
      group.rotation.z = (progress * h * config.spinDir + config.seed) + (time * 0.1 * config.spinDir);

      // Color sampling
      this.samplePaletteColor(progress + config.colorOffset + (time * 0.05), tempColor);
      material.color.copy(tempColor);
    });

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.isDisposed = true;
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("scroll", this.onScroll);

    this.brackets.forEach(({ geometry, material }) => {
      geometry.dispose();
      material.dispose();
    });

    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
