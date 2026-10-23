import * as THREE from 'three';import './style.css';
const canvas=document.querySelector('#scene'),message=document.querySelector('#message');
const scene=new THREE.Scene();scene.background=new THREE.Color('#ffe6f4');
const camera=new THREE.PerspectiveCamera(40,innerWidth/innerHeight,.1,100);camera.position.set(0,2.4,9);camera.lookAt(0,1.1,0);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.outputColorSpace=THREE.SRGBColorSpace;
scene.add(new THREE.HemisphereLight(0xffffff,0xcba2c6,2.4));const sun=new THREE.DirectionalLight(0xffffff,2.5);sun.position.set(-3,8,5);sun.castShadow=true;scene.add(sun);
const mat=(color)=>new THREE.MeshStandardMaterial({color,roughness:.75});
const white=mat('#fffaf6'),pink=mat('#ff9dca'),dark=mat('#423347'),blush=mat('#ffc2d9'),cream=mat('#fff4cc');
function ball(parent,r,x,y,z,m,sx=1,sy=1,sz=1){const o=new THREE.Mesh(new THREE.SphereGeometry(r,32,24),m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o}
function cone(parent,r,h,x,y,z,m,rotation=0){const o=new THREE.Mesh(new THREE.ConeGeometry(r,h,4),m);o.position.set(x,y,z);o.rotation.z=rotation;parent.add(o);return o}
const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),mat('#f9d3e8'));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
const rug=new THREE.Mesh(new THREE.CylinderGeometry(2.8,2.8,.04,64),mat('#fff8db'));rug.position.y=.03;scene.add(rug);
const rainbow=new THREE.Group();scene.add(rainbow);rainbow.position.set(-3.5,2.5,-3);['#ff9ec9','#ffcf93','#fff4a4','#a6e8c3','#a7c8ff'].forEach((c,i)=>{const curve=new THREE.EllipseCurve(0,0,1.65-i*.16,1.65-i*.16,0,Math.PI,false,0);const pts=curve.getPoints(64).map(p=>new THREE.Vector3(p.x,p.y,0));const mesh=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),64,.085,8,false),mat(c));rainbow.add(mesh)});
const mimi=new THREE.Group();scene.add(mimi);mimi.position.y=.12;
ball(mimi,.9,0,1.05,0,white,.8,1.08,.7);const head=new THREE.Group();mimi.add(head);head.position.y=2.15;
ball(head,.93,0,0,0,white,1.05,.94,.83);
for(const side of [-1,1]){cone(head,.42,.76,side*.65,.75,0,white,side*-.16);cone(head,.24,.44,side*.65,.77,.21,pink,side*-.16);ball(head,.145,side*.35,.08,.74,dark,.9,1.2,.55);ball(head,.05,side*.31,.14,.81,mat('#ffffff'));ball(head,.17,side*.58,-.2,.67,blush,1,.55,.35);ball(mimi,.25,side*.47,.36,.4,white)}
ball(head,.11,0,-.24,.78,pink,1,.7,.55);ball(head,.28,-.18,-.36,.67,white);ball(head,.28,.18,-.36,.67,white);
const bow=new THREE.Group();head.add(bow);bow.position.set(.58,.88,.13);ball(bow,.15,0,0,0,pink);ball(bow,.29,-.25,0,0,pink,1,.65,.45);ball(bow,.29,.25,0,0,pink,1,.65,.45);
const tail=ball(mimi,.17,.65,.95,-.5,white,.7,2.7,.7);tail.rotation.z=-.65;
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let excitement=0,sleeping=false,feeding=0;const clock=new THREE.Clock();
function react(action){sleeping=action==='sleep';excitement=action==='play'?2.4:action==='pet'?1.1:.7;feeding=action==='feed'?1:0;message.textContent=({pet:'Mimi thích được vuốt ve! 💕',feed:'Mimi ăn dâu ngon quá! 🍓',play:'Mimi nhảy vui quá! 🎉',sleep:'Suỵt, Mimi ngủ rồi! 💤'})[action]||'Meo meo! 💗'}
canvas.addEventListener('pointerdown',e=>{const rect=canvas.getBoundingClientRect();pointer.x=(e.clientX-rect.left)/rect.width*2-1;pointer.y=-(e.clientY-rect.top)/rect.height*2+1;ray.setFromCamera(pointer,camera);if(ray.intersectObjects(mimi.children,true).length)react('pet')});document.querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',()=>react(b.dataset.act)));
function resize(){const w=innerWidth,h=innerHeight;camera.aspect=w/h;camera.position.z=w<600?11:9;camera.updateProjectionMatrix();renderer.setSize(w,h)}addEventListener('resize',resize);resize();
function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();mimi.position.y=.12+(sleeping?-.18:Math.sin(t*2)*.045)+(excitement>0?Math.abs(Math.sin(t*11))*excitement*.18:0);mimi.rotation.y=Math.sin(t*.8)*.1;head.rotation.z=sleeping?-.15:Math.sin(t*1.4)*.055;head.rotation.x=feeding>0?Math.sin(t*12)*.09:0;tail.rotation.z=-.65+Math.sin(t*3)*.18;excitement=Math.max(0,excitement-.018);feeding=Math.max(0,feeding-.008);renderer.render(scene,camera)}animate();