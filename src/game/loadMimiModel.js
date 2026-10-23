import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Load an artist-authored, rigged Mimi model (GLB).
 * Returns a playable character controller with named animation actions.
 * This is intentionally separate from the placeholder geometry in main.js.
 */
export async function loadMimiModel(url = '/models/mimi.glb') {
  const gltf = await new GLTFLoader().loadAsync(url);
  const root = gltf.scene;
  root.traverse(object => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });

  const mixer = new THREE.AnimationMixer(root);
  const actions = Object.fromEntries(
    gltf.animations.map(clip => [clip.name.toLowerCase(), mixer.clipAction(clip)])
  );
  const play = (name, { loop = true, fade = 0.2 } = {}) => {
    const next = actions[name.toLowerCase()];
    if (!next) return false;
    for (const action of Object.values(actions)) {
      if (action !== next && action.isRunning()) action.fadeOut(fade);
    }
    next.reset().setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
    next.clampWhenFinished = !loop;
    next.fadeIn(fade).play();
    return true;
  };
  return {
    root, mixer, actions, play,
    update(deltaSeconds) { mixer.update(deltaSeconds); },
    dispose() {
      mixer.stopAllAction();
      root.traverse(object => {
        object.geometry?.dispose();
        const materials = object.material ? (Array.isArray(object.material) ? object.material : [object.material]) : [];
        materials.forEach(material => material.dispose());
      });
    }
  };
}
