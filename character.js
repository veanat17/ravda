import * as THREE from './assets/three.module.js';
const mount=document.getElementById('character-stage');
if(mount){try{
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(0,1.65,8.6);camera.lookAt(0,1.6,0);
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;mount.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','Объёмный персонаж RAVDA: поверните движением указателя, нажмите для приветствия');renderer.domElement.setAttribute('role','img');
 scene.add(new THREE.HemisphereLight(0xfff7df,0x759c89,2.7));
 const key=new THREE.DirectionalLight(0xffeed6,4);key.position.set(-3,6,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=5;key.shadow.camera.bottom=-2;key.shadow.bias=-.001;scene.add(key);
 const rim=new THREE.DirectionalLight(0xffffff,2.3);rim.position.set(4,3,-3);scene.add(rim);
 const mat=color=>new THREE.MeshStandardMaterial({color,roughness:.7,metalness:0});
 const teal=mat('#65b29a'),gold=mat('#e3b93e'),terra=mat('#c56740'),cream=mat('#fff1cc'),brown=mat('#715640'),leafGreen=mat('#489b7d');
 const hero=new THREE.Group();scene.add(hero);
 const torso=new THREE.Group();hero.add(torso);
 function ellipsoid(parent,material,x,y,z,sx,sy,sz,rz=0){const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,40,32),material);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.rotation.z=rz;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 // A closed, smooth pear-shaped body, modelled as a surface of revolution.
 const profile=new THREE.SplineCurve([new THREE.Vector2(0,.29),new THREE.Vector2(.47,.32),new THREE.Vector2(.79,.54),new THREE.Vector2(.86,1.05),new THREE.Vector2(.77,1.62),new THREE.Vector2(.60,2.26),new THREE.Vector2(.39,2.81),new THREE.Vector2(.17,3.03),new THREE.Vector2(0,3.06)]);
 const body=new THREE.Mesh(new THREE.LatheGeometry(profile.getPoints(80),80),teal);body.scale.z=.72;body.castShadow=true;body.receiveShadow=true;torso.add(body);
 ellipsoid(torso,cream,0,1.40,.529,.44,.69,.095);
 // Brand mark on the cream belly. Three-dimensional pieces, not a face.
 ellipsoid(torso,gold,0,1.79,.63,.098,.098,.024);
 ellipsoid(torso,leafGreen,-.105,1.47,.636,.065,.22,.025,.66);
 ellipsoid(torso,terra,.105,1.47,.636,.065,.22,.025,-.66);
 const left=new THREE.Group(),right=new THREE.Group();left.position.set(-.68,1.75,0);right.position.set(.68,1.75,0);torso.add(left,right);
 ellipsoid(left,gold,-.07,-.33,.04,.19,.53,.17,-.34);ellipsoid(right,gold,.07,-.33,.04,.19,.53,.17,.34);
 const footL=ellipsoid(hero,terra,-.34,.18,.12,.24,.18,.31,-.08),footR=ellipsoid(hero,terra,.34,.18,.12,.24,.18,.31,.08);
 const sprout=new THREE.Group();sprout.position.set(0,3.015,0);torso.add(sprout);
 const stem=new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,.30,16),brown);stem.position.y=.13;sprout.add(stem);
 ellipsoid(sprout,gold,-.23,.39,0,.135,.36,.063,.94);ellipsoid(sprout,gold,.23,.40,0,.135,.36,.063,-.94);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.ShadowMaterial({opacity:.12}));floor.rotation.x=-Math.PI/2;floor.position.y=.01;floor.receiveShadow=true;scene.add(floor);
 let visible=true,pointer={x:0,y:0},mode='idle',gestureAt=-100,tourIndex=0,speaking=false,last=0;
 const clock=new THREE.Clock();
 function resize(){const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
 new ResizeObserver(resize).observe(mount);resize();
 new IntersectionObserver(es=>{visible=es[0].isIntersecting},{threshold:0}).observe(mount);
 const reduced=()=>document.body.classList.contains('motion-off')||matchMedia('(prefers-reduced-motion: reduce)').matches;
 mount.addEventListener('pointermove',e=>{const r=mount.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;});mount.addEventListener('pointerleave',()=>{pointer={x:0,y:0};});
 function gesture(m){mode=m;gestureAt=clock.getElapsedTime();}
 mount.addEventListener('click',()=>{gesture('wave');window.dispatchEvent(new CustomEvent('ravda-greeting'));});
 window.addEventListener('ravda-gesture',e=>gesture(e.detail||'wave'));
 window.addEventListener('ravda-speaking',e=>{speaking=!!e.detail;});
 renderer.setAnimationLoop(()=>{const t=clock.getElapsedTime();if(!visible||document.hidden||document.body.classList.contains('intro-playing'))return;if(t-last<1/35)return;last=t;const still=reduced();const g=t-gestureAt;const wave=mode==='wave'&&g<3.8&&!still;const joy=mode==='joy'&&g<2.5&&!still;
 hero.rotation.y=THREE.MathUtils.lerp(hero.rotation.y,still?0:pointer.x*.8+Math.sin(t*.42)*.075,.08);
 torso.rotation.z=still?0:Math.sin(t*1.4)*.022;torso.rotation.x=still?0:pointer.y*.055;
 hero.position.y=still?0:Math.sin(t*2)*.025+(joy?Math.abs(Math.sin(g*7))*.16:0);
 left.rotation.z=still?0:Math.sin(t*1.5)*.07;
 right.rotation.z=wave?1.95+Math.sin(g*12)*.27:(joy?1.8:still?0:Math.sin(t*1.5+1)*.07);
 if(joy)left.rotation.z=-1.8;
 if(speaking&&!still){left.rotation.z-=.2+Math.sin(t*5)*.13;right.rotation.z+=.2+Math.cos(t*4)*.13;torso.scale.y=1+Math.sin(t*9)*.003;}else torso.scale.y=1;
 sprout.rotation.z=still?0:Math.sin(t*2.2)*.06;footL.rotation.z=still?0:-.08+Math.sin(t*1.4)*.025;footR.rotation.z=still?0:.08+Math.sin(t*1.4)*.025;
 renderer.render(scene,camera);
 });
 mount.classList.add('ready');document.getElementById('character-fallback').style.display='none';
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();mount.classList.remove('ready');document.getElementById('character-fallback').style.display='block';});
}catch(error){document.getElementById('character-fallback').style.display='block';}}
