/* Portfolio animations — ported verbatim from the design mockup. */
(function(){
  var root=document.documentElement, mq=window.matchMedia("(prefers-color-scheme:dark)");
  if(!root.getAttribute("data-theme"))root.setAttribute("data-theme",mq.matches?"dark":"light");
  function isLight(){return root.getAttribute("data-theme")==="light";}
  var reduce=window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  document.getElementById("themebtn").addEventListener("click",function(){root.setAttribute("data-theme",isLight()?"dark":"light");});
  var dock=document.getElementById("dock");if(dock){var links={};[].forEach.call(dock.querySelectorAll("a[data-dock]"),function(a){links[a.getAttribute("href")]=a;});var secs=["top","skills","work","project","contact"].map(function(id){return document.getElementById(id);}).filter(Boolean);var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;for(var k in links)links[k].classList.remove("active");var l=links["#"+e.target.id];if(l)l.classList.add("active");});},{rootMargin:"-45% 0px -45% 0px"});secs.forEach(function(x){spy.observe(x);});}

  var GREET=["Hello", "\u0928\u092e\u0938\u094d\u0924\u0947", "Bonjour", "\u3053\u3093\u306b\u3061\u306f", "Hola", "\uc548\ub155\ud558\uc138\uc694", "Ciao", "\u4f60\u597d", "Ol\u00e1", "\u041f\u0440\u0438\u0432\u0435\u0442"];
  var pre=document.getElementById("preloader"),gEl=document.getElementById("greet");
  function finish(){pre.classList.add("done");document.body.classList.add("ready");setTimeout(function(){pre.style.display="none";},1050);}
  if(reduce){gEl.textContent=GREET[0];setTimeout(finish,400);}
  else{var i=0;gEl.textContent=GREET[0];
    var iv=setInterval(function(){i++;if(i>=GREET.length){clearInterval(iv);setTimeout(finish,280);return;}gEl.textContent=GREET[i];},150);}

  var nav=document.getElementById("nav");
  if(nav)addEventListener("scroll",function(){nav.classList.toggle("scrolled",scrollY>40);},{passive:true});

  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;
    if(e.target.classList.contains("logogrid")){var k=e.target.children;for(var j=0;j<k.length;j++)k[j].style.transitionDelay=(j*0.045)+"s";}
    e.target.classList.add("in");io.unobserve(e.target);});},{threshold:.14});
  document.querySelectorAll(".reveal,.logogrid").forEach(function(el){io.observe(el);});

  if(!reduce){
    document.querySelectorAll(".tilt").forEach(function(card){
      card.addEventListener("mousemove",function(e){var r=card.getBoundingClientRect();
        card.style.setProperty("--mx",(e.clientX-r.left)+"px");card.style.setProperty("--my",(e.clientY-r.top)+"px");});
    });
    document.querySelectorAll(".btn,.navcta").forEach(function(b){
      b.addEventListener("mousemove",function(e){var r=b.getBoundingClientRect();
        b.style.transform="translate("+((e.clientX-r.left-r.width/2)*0.18)+"px,"+((e.clientY-r.top-r.height/2)*0.3)+"px)";});
      b.addEventListener("mouseleave",function(){b.style.transform="";});
    });
  }
  var cnt=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;cnt.unobserve(en.target);
    var el=en.target,m=el.textContent.match(/([\d.]+)(\+?)/);if(!m||reduce)return;
    var tgt=parseFloat(m[1]),dec=(m[1].split(".")[1]||"").length,suf=m[2],t0=null;
    function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1100,1),k=1-Math.pow(1-p,3);
      el.textContent=(tgt*(0.12+0.88*k)).toFixed(dec)+suf;if(p<1)requestAnimationFrame(step);else el.textContent=m[1]+suf;}
    requestAnimationFrame(step);});},{threshold:.6});
  document.querySelectorAll(".stat .n").forEach(function(el){cnt.observe(el);});
  var hb=document.getElementById("hoverblock");if(hb&&!reduce){addEventListener("mousemove",function(e){var bx=Math.floor(e.clientX/48)*48,by=Math.floor(e.clientY/48)*48;hb.style.transform="translate("+bx+"px,"+by+"px)";hb.style.opacity="0.9";},{passive:true});addEventListener("mouseout",function(){hb.style.opacity="0";});}

  // cursor-following glow
  var glow=document.getElementById("cursorglow");
  if(glow&&!reduce){
    var gx=innerWidth*0.5,gy=innerHeight*0.4,tx=gx,ty=gy;
    addEventListener("mousemove",function(e){tx=e.clientX;ty=e.clientY;},{passive:true});
    var rootEl=document.documentElement;
    (function loop(){gx+=(tx-gx)*0.08;gy+=(ty-gy)*0.08;glow.style.transform="translate3d("+gx+"px,"+gy+"px,0)";rootEl.style.setProperty("--mx",gx+"px");rootEl.style.setProperty("--my",gy+"px");requestAnimationFrame(loop);})();
  }

  // ---- immersive flowing atmosphere (Lusion-style) ----
  var aMx=0,aMy=0,taMx=0,taMy=0;
  addEventListener("mousemove",function(e){taMx=e.clientX/innerWidth-0.5;taMy=e.clientY/innerHeight-0.5;},{passive:true});
  (function ez(){aMx+=(taMx-aMx)*0.05;aMy+=(taMy-aMy)*0.05;if(!reduce)requestAnimationFrame(ez);})();
  var atmo=document.getElementById("atmo");
  if(atmo){
    var gl=atmo.getContext("webgl",{alpha:false,antialias:false})||atmo.getContext("experimental-webgl");
    if(gl){
      var VS="attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}";
      var FS=[
        "precision highp float;",
        "uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uLight;",
        "mat3 rY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}",
        "mat3 rX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,-s,0.,s,c);}",
        "float sdBox(vec3 p,vec3 b,float r){vec3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0)-r;}",
        "float sdCan(vec3 p,float R,float H,float r){vec2 d=vec2(length(p.xz)-R+r,abs(p.y)-H+r);return min(max(d.x,d.y),0.0)+length(max(d,0.0))-r;}",
        "float boxAt(vec3 p,vec3 c,float a,float b){float t=uTime;return sdBox(rY(t*a+c.x)*rX(t*b+c.y)*(p-c),vec3(0.5),0.06);}",
        "float dbAt(vec3 p,vec3 c,float a,float b){float t=uTime;vec3 q=rY(t*a+c.x)*rX(t*b+c.y)*(p-c);float d=sdCan(q-vec3(0.,0.30,0.),0.44,0.12,0.05);d=min(d,sdCan(q,0.44,0.12,0.05));d=min(d,sdCan(q+vec3(0.,0.30,0.),0.44,0.12,0.05));return d;}",
        "const vec3 P0=vec3(0.0,0.0,0.0);const vec3 P1=vec3(1.08,0.5,-0.4);const vec3 P2=vec3(-1.0,0.5,0.35);const vec3 P3=vec3(0.32,-1.05,0.5);const vec3 P4=vec3(-0.64,-0.84,-0.55);",
        "float map(vec3 p){float d=boxAt(p,P0,0.45,0.32);d=min(d,dbAt(p,P1,-0.35,0.42));d=min(d,boxAt(p,P2,0.55,-0.3));d=min(d,dbAt(p,P3,-0.45,-0.35));d=min(d,boxAt(p,P4,0.32,0.5));return d;}",
        "vec3 colAt(vec3 p){float d0=boxAt(p,P0,0.45,0.32),d1=dbAt(p,P1,-0.35,0.42),d2=boxAt(p,P2,0.55,-0.3),d3=dbAt(p,P3,-0.45,-0.35),d4=boxAt(p,P4,0.32,0.5);",
        " vec3 blue=vec3(0.11,0.20,0.94),white=vec3(0.93,0.94,0.97),gray=vec3(0.55,0.58,0.66),dark=vec3(0.08,0.10,0.17);",
        " vec3 c=blue;float m=d0;if(d1<m){m=d1;c=white;}if(d2<m){m=d2;c=gray;}if(d3<m){m=d3;c=dark;}if(d4<m){c=blue;}return c;}",
        "vec3 nrm(vec3 p){vec2 e=vec2(0.0022,0.0);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}",
        "void main(){",
        " vec2 uv=(gl_FragCoord.xy*2.0-uRes)/uRes.y;uv.x-=0.5;",
        " vec3 ro=vec3(0.0,0.0,5.1);vec3 rd=normalize(vec3(uv,-2.1));",
        " mat3 R=rY(uTime*0.15+uMouse.x*0.7)*rX(-0.1+uMouse.y*0.45);ro=R*ro;rd=R*rd;",
        " float t=0.0;vec3 p=ro;bool hit=false;",
        " for(int i=0;i<82;i++){p=ro+rd*t;float d=map(p);if(d<0.002){hit=true;break;}t+=d*0.9;if(t>10.0)break;}",
        " vec3 col=vec3(0.0);",
        " if(hit){vec3 n=nrm(p);vec3 base=colAt(p);",
        "  vec3 L1=normalize(vec3(0.55,0.8,0.55)),L2=normalize(vec3(-0.5,0.2,0.5));",
        "  float dif=clamp(dot(n,L1),0.0,1.0)*0.9+clamp(dot(n,L2),0.0,1.0)*0.3;",
        "  float spec=pow(clamp(dot(reflect(-L1,n),-rd),0.0,1.0),50.0);",
        "  float fres=pow(1.0-clamp(dot(n,-rd),0.0,1.0),4.0);",
        "  col=base*(0.22+dif)+vec3(1.0)*spec*0.85+fres*vec3(0.6,0.72,1.0)*0.28;",
        " }",
        " vec3 bg=(uLight>0.5)?vec3(0.922,0.933,0.961):vec3(0.027,0.039,0.071);",
        " float g=exp(-length(uv)*1.15);",
        " vec3 amb=bg+g*(uLight>0.5?vec3(0.02,0.05,0.12)*0.5:vec3(0.05,0.09,0.28));",
        " gl_FragColor=vec4(hit?col:amb,1.0);}"
      ].join("\n");
      function mk(ty,s){var sh=gl.createShader(ty);gl.shaderSource(sh,s);gl.compileShader(sh);
        if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(sh));return null;}return sh;}
      var vs=mk(gl.VERTEX_SHADER,VS),fs=mk(gl.FRAGMENT_SHADER,FS);
      if(vs&&fs){
        var pg=gl.createProgram();gl.attachShader(pg,vs);gl.attachShader(pg,fs);gl.linkProgram(pg);
        if(gl.getProgramParameter(pg,gl.LINK_STATUS)){
          gl.useProgram(pg);
          var bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);
          gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
          var lp=gl.getAttribLocation(pg,"p");gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
          var uR=gl.getUniformLocation(pg,"uRes"),uT=gl.getUniformLocation(pg,"uTime"),
              uM=gl.getUniformLocation(pg,"uMouse"),uL=gl.getUniformLocation(pg,"uLight");
          var sc=Math.min(devicePixelRatio||1,1.05);
          function rs(){var w=atmo.clientWidth||1,h=atmo.clientHeight||1,s=sc;if(w*s>1400)s=1400/w;
            atmo.width=Math.round(w*s);atmo.height=Math.round(h*s);gl.viewport(0,0,atmo.width,atmo.height);}
          rs();addEventListener("resize",rs);
          function fr(){gl.uniform2f(uR,atmo.width,atmo.height);gl.uniform1f(uT,reduce?14.0:performance.now()/1000);
            gl.uniform2f(uM,aMx,aMy);gl.uniform1f(uL,isLight()?1.0:0.0);
            gl.drawArrays(gl.TRIANGLES,0,3);if(!reduce)requestAnimationFrame(fr);}
          fr();
        }
      }
    }
  }
})();

(function(){
  var tb=document.getElementById("termbody");if(!tb)return;
  var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  var C="\u2713",DOT="\u00b7",DASH="\u2014";
  var steps=[["cmd","whoami"],["out","Shashwat Goyal "+DASH+" Software Developer"],["gap"],
   ["cmd","cat stack.txt"],["out","React "+DOT+" Next.js "+DOT+" Node "+DOT+" PostgreSQL "+DOT+" Prisma"],["gap"],
   ["cmd","./ship --status"],["ok",C+" building production systems"],["ok",C+" open to work"]];
  var caret=document.createElement("span");caret.className="caret";
  function line(cls){var d=document.createElement("div");d.className="tline"+(cls?" "+cls:"");tb.appendChild(d);return d;}
  if(reduce){steps.forEach(function(s){if(s[0]==="gap"){line();return;}var d=line(s[0]==="cmd"?"":s[0]);d.textContent=(s[0]==="cmd"?"$ ":"")+(s[1]||"");});tb.appendChild(caret);return;}
  var i=0;
  function type(el,text,done){var k=0;(function tick(){if(k<text.length){el.insertBefore(document.createTextNode(text.charAt(k)),caret);k++;setTimeout(tick,42);}else done();})();}
  function next(){
    if(i>=steps.length){tb.appendChild(caret);return;}
    var s=steps[i++];
    if(s[0]==="gap"){line();setTimeout(next,220);return;}
    if(s[0]==="cmd"){var d=line("");var pr=document.createElement("span");pr.className="prompt";pr.textContent="$ ";d.appendChild(pr);var tt=document.createElement("span");d.appendChild(tt);tt.appendChild(caret);type(tt,s[1],function(){setTimeout(next,360);});}
    else{var d2=line(s[0]);d2.appendChild(caret);d2.insertBefore(document.createTextNode(s[1]),caret);setTimeout(next,150);}
  }
  setTimeout(next,1900);
})();

(function(){
  var cv=document.getElementById("hero3d");if(!cv)return;
  var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  var root=document.documentElement;function isLight(){return root.getAttribute("data-theme")==="light";}
  var mx=0,my=0,tx=0,ty=0;
  addEventListener("mousemove",function(e){var r=cv.getBoundingClientRect();tx=(e.clientX-(r.left+r.width/2))/r.width*2.0;ty=(e.clientY-(r.top+r.height/2))/r.height*2.0;tx=Math.max(-1.6,Math.min(1.6,tx));ty=Math.max(-1.6,Math.min(1.6,ty));},{passive:true});
  (function ez(){mx+=(tx-mx)*0.06;my+=(ty-my)*0.06;if(!reduce)requestAnimationFrame(ez);})();
  var gl=cv.getContext("webgl",{alpha:false,antialias:true})||cv.getContext("experimental-webgl");if(!gl)return;
  var VS="attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}";
  var FS=[
"precision highp float;",
"uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uLight;",
"mat3 rY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}",
"mat3 rX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,-s,0.,s,c);}",
"float cap(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-r;}",
"float mapB(vec3 p){float R=0.13;float d=cap(p,vec3(-1.12,0.,0.),vec3(-0.6,0.5,0.),R);d=min(d,cap(p,vec3(-1.12,0.,0.),vec3(-0.6,-0.5,0.),R));d=min(d,cap(p,vec3(1.12,0.,0.),vec3(0.6,0.5,0.),R));d=min(d,cap(p,vec3(1.12,0.,0.),vec3(0.6,-0.5,0.),R));return d;}",
"float mapS(vec3 p){return cap(p,vec3(-0.26,-0.66,0.),vec3(0.26,0.66,0.),0.13);}",
"float map(vec3 p){vec3 q=rY(uTime*0.3+uMouse.x*0.9)*rX(-0.12+uMouse.y*0.5)*p;return min(mapB(q),mapS(q));}",
"vec3 colAt(vec3 p){vec3 q=rY(uTime*0.3+uMouse.x*0.9)*rX(-0.12+uMouse.y*0.5)*p;return (mapS(q)<mapB(q))?vec3(0.93,0.94,0.97):vec3(0.12,0.30,0.96);}",
"vec3 nrm(vec3 p){vec2 e=vec2(0.002,0.0);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}",
"void main(){",
" vec2 uv=(gl_FragCoord.xy*2.0-uRes)/uRes.y;",
" vec3 ro=vec3(0.0,0.0,4.7);vec3 rd=normalize(vec3(uv,-2.3));",
" float t=0.0;vec3 p=ro;bool hit=false;",
" for(int i=0;i<80;i++){p=ro+rd*t;float d=map(p);if(d<0.002){hit=true;break;}t+=d*0.9;if(t>9.0)break;}",
" vec3 col=vec3(0.0);",
" if(hit){vec3 n=nrm(p);vec3 base=colAt(p);",
"  vec3 L1=normalize(vec3(0.5,0.8,0.6)),L2=normalize(vec3(-0.5,0.2,0.5));",
"  float dif=clamp(dot(n,L1),0.0,1.0)*0.9+clamp(dot(n,L2),0.0,1.0)*0.3;",
"  float spec=pow(clamp(dot(reflect(-L1,n),-rd),0.0,1.0),48.0);",
"  float fres=pow(1.0-clamp(dot(n,-rd),0.0,1.0),4.0);",
"  col=base*(0.24+dif)+vec3(1.0)*spec*0.85+fres*vec3(0.5,0.7,1.0)*0.3;",
" }",
" vec3 bg=(uLight>0.5)?vec3(0.922,0.933,0.961):vec3(0.027,0.039,0.071);",
" float g=exp(-length(uv)*0.9);",
" vec3 amb=bg+g*(uLight>0.5?vec3(0.02,0.05,0.12)*0.4:vec3(0.04,0.08,0.24));",
" gl_FragColor=vec4(hit?col:amb,1.0);}"
].join("\n");
  function mk(ty,src){var sh=gl.createShader(ty);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(sh));return null;}return sh;}
  var vs=mk(gl.VERTEX_SHADER,VS),fs=mk(gl.FRAGMENT_SHADER,FS);if(!vs||!fs)return;
  var pg=gl.createProgram();gl.attachShader(pg,vs);gl.attachShader(pg,fs);gl.linkProgram(pg);
  if(!gl.getProgramParameter(pg,gl.LINK_STATUS)){console.warn(gl.getProgramInfoLog(pg));return;}
  gl.useProgram(pg);
  var bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var lp=gl.getAttribLocation(pg,"p");gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
  var uR=gl.getUniformLocation(pg,"uRes"),uT=gl.getUniformLocation(pg,"uTime"),uM=gl.getUniformLocation(pg,"uMouse"),uL=gl.getUniformLocation(pg,"uLight");
  var sc=Math.min(devicePixelRatio||1,1.5);
  function rs(){var w=cv.clientWidth||1,h=cv.clientHeight||1;cv.width=Math.round(w*sc);cv.height=Math.round(h*sc);gl.viewport(0,0,cv.width,cv.height);}
  rs();addEventListener("resize",rs);
  function fr(){gl.uniform2f(uR,cv.width,cv.height);gl.uniform1f(uT,reduce?1.0:performance.now()/1000);gl.uniform2f(uM,mx,my);gl.uniform1f(uL,isLight()?1.0:0.0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3);if(!reduce)requestAnimationFrame(fr);}
  fr();
})();

(function(){
  var el=document.querySelector(".term3d");if(!el)return;
  var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(reduce){el.style.transform="rotateY(-15deg) rotateX(6deg)";return;}
  var mx=0,my=0,tx=0,ty=0,t0=performance.now();
  addEventListener("mousemove",function(e){tx=(e.clientX/innerWidth-0.5);ty=(e.clientY/innerHeight-0.5);},{passive:true});
  (function loop(){mx+=(tx-mx)*0.06;my+=(ty-my)*0.06;var fl=Math.sin((performance.now()-t0)/1500)*5;var ry=-15+mx*16,rx=6-my*10;el.style.transform="translateY("+fl+"px) rotateY("+ry+"deg) rotateX("+rx+"deg)";requestAnimationFrame(loop);})();
})();

(function(){
  var cols=[].slice.call(document.querySelectorAll(".codecol"));if(!cols.length)return;
  var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  function e(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  var SNIPS=[[["import", "kw"], [" ", "pun"], ["express", "var"], [" ", "pun"], ["from", "kw"], [" ", "pun"], ["\"express\"", "str"], [";\n", "pun"], ["import", "kw"], [" { ", "pun"], ["Router", "var"], [" } ", "pun"], ["from", "kw"], [" ", "pun"], ["\"express\"", "str"], [";\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["app", "var"], [" = ", "pun"], ["express", "fn"], ["();\n", "pun"], ["const", "kw"], [" ", "pun"], ["api", "var"], [" = ", "pun"], ["Router", "fn"], ["();\n", "pun"], ["app", "var"], [".", "pun"], ["use", "fn"], ["(", "pun"], ["express", "var"], [".", "pun"], ["json", "fn"], ["());\n\n", "pun"], ["api", "var"], [".", "pun"], ["post", "fn"], ["(", "pun"], ["\"/sync\"", "str"], [", ", "pun"], ["async", "kw"], [" (", "pun"], ["req", "var"], [", ", "pun"], ["res", "var"], [") => {\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["c", "var"], [" = ", "pun"], ["normalize", "fn"], ["(", "pun"], ["req", "var"], [".", "pun"], ["body", "prop"], [");\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["jobs", "var"], [" = ", "pun"], ["await", "kw"], [" ", "pun"], ["schedule", "fn"], ["(", "pun"], ["c", "var"], [");\n  ", "pun"], ["res", "var"], [".", "pun"], ["json", "fn"], ["({ ", "pun"], ["queued", "var"], [": ", "pun"], ["jobs", "var"], [".", "pun"], ["length", "prop"], [" });\n});\n\n", "pun"], ["app", "var"], [".", "pun"], ["listen", "fn"], ["(", "pun"], ["3000", "num"], [");\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["prisma", "var"], [" = ", "pun"], ["new", "kw"], [" ", "pun"], ["PrismaClient", "fn"], ["();\n\n", "pun"], ["async", "kw"], [" ", "pun"], ["function", "kw"], [" ", "pun"], ["onboard", "fn"], ["(", "pun"], ["name", "var"], [") {\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["prisma", "var"], [".", "pun"], ["tenant", "prop"], [".", "pun"], ["create", "fn"], ["({\n    ", "pun"], ["data", "var"], [": { ", "pun"], ["name", "var"], [", ", "pun"], ["active", "var"], [": ", "pun"], ["true", "var"], [" },\n  });\n}\n\n", "pun"], ["async", "kw"], [" ", "pun"], ["function", "kw"], [" ", "pun"], ["sync", "fn"], ["(", "pun"], ["tenant", "var"], [") {\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["jobs", "var"], [" = ", "pun"], ["await", "kw"], [" ", "pun"], ["plan", "fn"], ["(", "pun"], ["tenant", "var"], [");\n  ", "pun"], ["await", "kw"], [" ", "pun"], ["queue", "var"], [".", "pun"], ["addBulk", "fn"], ["(", "pun"], ["jobs", "var"], [");\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["jobs", "var"], [".", "pun"], ["length", "prop"], [";\n}\n\n", "pun"], ["function", "kw"], [" ", "pun"], ["resolve", "fn"], ["(", "pun"], ["source", "var"], [") {\n  ", "pun"], ["switch", "kw"], [" (", "pun"], ["source", "var"], [") {\n    ", "pun"], ["case", "kw"], [" ", "pun"], ["\"rest\"", "str"], [": ", "pun"], ["return", "kw"], [" ", "pun"], ["fromRest", "var"], [";\n    ", "pun"], ["case", "kw"], [" ", "pun"], ["\"graphql\"", "str"], [": ", "pun"], ["return", "kw"], [" ", "pun"], ["fromGraph", "var"], [";\n    ", "pun"], ["default", "kw"], [": ", "pun"], ["return", "kw"], [" ", "pun"], ["identity", "var"], [";\n  }\n}\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["queue", "var"], [" = ", "pun"], ["new", "kw"], [" ", "pun"], ["Queue", "fn"], ["(", "pun"], ["\"jobs\"", "str"], [");\n\n", "pun"], ["queue", "var"], [".", "pun"], ["process", "fn"], ["(", "pun"], ["async", "kw"], [" (", "pun"], ["job", "var"], [") => {\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["data", "var"], [" = ", "pun"], ["normalize", "fn"], ["(", "pun"], ["job", "var"], [".", "pun"], ["data", "prop"], [");\n  ", "pun"], ["await", "kw"], [" ", "pun"], ["deliver", "fn"], ["(", "pun"], ["data", "var"], [");\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["job", "var"], [".", "pun"], ["done", "fn"], ["();\n});\n\n", "pun"], ["type", "kw"], [" ", "pun"], ["Contract", "var"], [" = {\n  ", "pun"], ["source", "var"], [": ", "pun"], ["\"rest\"", "str"], [" | ", "pun"], ["\"graphql\"", "str"], [";\n  ", "pun"], ["map", "var"], [": (", "pun"], ["payload", "var"], [") => ", "pun"], ["Record", "var"], [";\n};\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["config", "var"], [" = {\n  ", "pun"], ["retries", "var"], [": ", "pun"], ["3", "num"], [",\n  ", "pun"], ["timeout", "var"], [": ", "pun"], ["5000", "num"], [",\n  ", "pun"], ["backoff", "var"], [": ", "pun"], ["\"exponential\"", "str"], [",\n};\n\n", "pun"], ["export", "kw"], [" ", "pun"], ["default", "kw"], [" ", "pun"], ["config", "var"], [";", "pun"]], [["import", "kw"], [" { ", "pun"], ["useState", "var"], [", ", "pun"], ["useEffect", "var"], [" } ", "pun"], ["from", "kw"], [" ", "pun"], ["\"react\"", "str"], [";\n\n", "pun"], ["function", "kw"], [" ", "pun"], ["useTrip", "fn"], ["(", "pun"], ["id", "var"], [") {\n  ", "pun"], ["const", "kw"], [" [", "pun"], ["trip", "var"], [", ", "pun"], ["setTrip", "var"], ["] = ", "pun"], ["useState", "fn"], ["(", "pun"], ["null", "var"], [");\n\n  ", "pun"], ["useEffect", "fn"], ["(() => {\n    ", "pun"], ["fetch", "fn"], ["(", "pun"], ["\"/api/trips/\"", "str"], [" + ", "pun"], ["id", "var"], [")\n      .", "pun"], ["then", "fn"], ["((", "pun"], ["r", "var"], [") => ", "pun"], ["r", "var"], [".", "pun"], ["json", "fn"], ["())\n      .", "pun"], ["then", "fn"], ["(", "pun"], ["setTrip", "var"], [");\n  }, [", "pun"], ["id", "var"], ["]);\n\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["trip", "var"], [";\n}\n\n", "pun"], ["type", "kw"], [" ", "pun"], ["Contract", "var"], [" = {\n  ", "pun"], ["source", "var"], [": ", "pun"], ["\"rest\"", "str"], [" | ", "pun"], ["\"graphql\"", "str"], [";\n  ", "pun"], ["map", "var"], [": (", "pun"], ["payload", "var"], [") => ", "pun"], ["Record", "var"], [";\n};\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["config", "var"], [" = {\n  ", "pun"], ["retries", "var"], [": ", "pun"], ["3", "num"], [",\n  ", "pun"], ["timeout", "var"], [": ", "pun"], ["5000", "num"], [",\n  ", "pun"], ["backoff", "var"], [": ", "pun"], ["\"exponential\"", "str"], [",\n};\n\n", "pun"], ["export", "kw"], [" ", "pun"], ["default", "kw"], [" ", "pun"], ["config", "var"], [";\n\n", "pun"], ["export", "kw"], [" ", "pun"], ["function", "kw"], [" ", "pun"], ["once", "fn"], ["(", "pun"], ["fn", "var"], [") {\n  ", "pun"], ["let", "kw"], [" ", "pun"], ["done", "var"], [" = ", "pun"], ["false", "var"], [";\n  ", "pun"], ["let", "kw"], [" ", "pun"], ["value", "var"], [";\n  ", "pun"], ["return", "kw"], [" (...", "pun"], ["args", "prop"], [") => {\n    ", "pun"], ["if", "kw"], [" (", "pun"], ["done", "var"], [") ", "pun"], ["return", "kw"], [" ", "pun"], ["value", "var"], [";\n    ", "pun"], ["done", "var"], [" = ", "pun"], ["true", "var"], [";\n    ", "pun"], ["value", "var"], [" = ", "pun"], ["fn", "fn"], ["(...", "pun"], ["args", "prop"], [");\n    ", "pun"], ["return", "kw"], [" ", "pun"], ["value", "var"], [";\n  };\n}\n\n", "pun"], ["import", "kw"], [" ", "pun"], ["express", "var"], [" ", "pun"], ["from", "kw"], [" ", "pun"], ["\"express\"", "str"], [";\n", "pun"], ["import", "kw"], [" { ", "pun"], ["Router", "var"], [" } ", "pun"], ["from", "kw"], [" ", "pun"], ["\"express\"", "str"], [";\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["app", "var"], [" = ", "pun"], ["express", "fn"], ["();\n", "pun"], ["const", "kw"], [" ", "pun"], ["api", "var"], [" = ", "pun"], ["Router", "fn"], ["();\n", "pun"], ["app", "var"], [".", "pun"], ["use", "fn"], ["(", "pun"], ["express", "var"], [".", "pun"], ["json", "fn"], ["());\n\n", "pun"], ["api", "var"], [".", "pun"], ["post", "fn"], ["(", "pun"], ["\"/sync\"", "str"], [", ", "pun"], ["async", "kw"], [" (", "pun"], ["req", "var"], [", ", "pun"], ["res", "var"], [") => {\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["c", "var"], [" = ", "pun"], ["normalize", "fn"], ["(", "pun"], ["req", "var"], [".", "pun"], ["body", "prop"], [");\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["jobs", "var"], [" = ", "pun"], ["await", "kw"], [" ", "pun"], ["schedule", "fn"], ["(", "pun"], ["c", "var"], [");\n  ", "pun"], ["res", "var"], [".", "pun"], ["json", "fn"], ["({ ", "pun"], ["queued", "var"], [": ", "pun"], ["jobs", "var"], [".", "pun"], ["length", "prop"], [" });\n});\n\n", "pun"], ["app", "var"], [".", "pun"], ["listen", "fn"], ["(", "pun"], ["3000", "num"], [");", "pun"]], [["const", "kw"], [" ", "pun"], ["prisma", "var"], [" = ", "pun"], ["new", "kw"], [" ", "pun"], ["PrismaClient", "fn"], ["();\n\n", "pun"], ["async", "kw"], [" ", "pun"], ["function", "kw"], [" ", "pun"], ["onboard", "fn"], ["(", "pun"], ["name", "var"], [") {\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["prisma", "var"], [".", "pun"], ["tenant", "prop"], [".", "pun"], ["create", "fn"], ["({\n    ", "pun"], ["data", "var"], [": { ", "pun"], ["name", "var"], [", ", "pun"], ["active", "var"], [": ", "pun"], ["true", "var"], [" },\n  });\n}\n\n", "pun"], ["async", "kw"], [" ", "pun"], ["function", "kw"], [" ", "pun"], ["sync", "fn"], ["(", "pun"], ["tenant", "var"], [") {\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["jobs", "var"], [" = ", "pun"], ["await", "kw"], [" ", "pun"], ["plan", "fn"], ["(", "pun"], ["tenant", "var"], [");\n  ", "pun"], ["await", "kw"], [" ", "pun"], ["queue", "var"], [".", "pun"], ["addBulk", "fn"], ["(", "pun"], ["jobs", "var"], [");\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["jobs", "var"], [".", "pun"], ["length", "prop"], [";\n}\n\n", "pun"], ["function", "kw"], [" ", "pun"], ["resolve", "fn"], ["(", "pun"], ["source", "var"], [") {\n  ", "pun"], ["switch", "kw"], [" (", "pun"], ["source", "var"], [") {\n    ", "pun"], ["case", "kw"], [" ", "pun"], ["\"rest\"", "str"], [": ", "pun"], ["return", "kw"], [" ", "pun"], ["fromRest", "var"], [";\n    ", "pun"], ["case", "kw"], [" ", "pun"], ["\"graphql\"", "str"], [": ", "pun"], ["return", "kw"], [" ", "pun"], ["fromGraph", "var"], [";\n    ", "pun"], ["default", "kw"], [": ", "pun"], ["return", "kw"], [" ", "pun"], ["identity", "var"], [";\n  }\n}\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["queue", "var"], [" = ", "pun"], ["new", "kw"], [" ", "pun"], ["Queue", "fn"], ["(", "pun"], ["\"jobs\"", "str"], [");\n\n", "pun"], ["queue", "var"], [".", "pun"], ["process", "fn"], ["(", "pun"], ["async", "kw"], [" (", "pun"], ["job", "var"], [") => {\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["data", "var"], [" = ", "pun"], ["normalize", "fn"], ["(", "pun"], ["job", "var"], [".", "pun"], ["data", "prop"], [");\n  ", "pun"], ["await", "kw"], [" ", "pun"], ["deliver", "fn"], ["(", "pun"], ["data", "var"], [");\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["job", "var"], [".", "pun"], ["done", "fn"], ["();\n});\n\n", "pun"], ["import", "kw"], [" ", "pun"], ["express", "var"], [" ", "pun"], ["from", "kw"], [" ", "pun"], ["\"express\"", "str"], [";\n", "pun"], ["import", "kw"], [" { ", "pun"], ["Router", "var"], [" } ", "pun"], ["from", "kw"], [" ", "pun"], ["\"express\"", "str"], [";\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["app", "var"], [" = ", "pun"], ["express", "fn"], ["();\n", "pun"], ["const", "kw"], [" ", "pun"], ["api", "var"], [" = ", "pun"], ["Router", "fn"], ["();\n", "pun"], ["app", "var"], [".", "pun"], ["use", "fn"], ["(", "pun"], ["express", "var"], [".", "pun"], ["json", "fn"], ["());\n\n", "pun"], ["api", "var"], [".", "pun"], ["post", "fn"], ["(", "pun"], ["\"/sync\"", "str"], [", ", "pun"], ["async", "kw"], [" (", "pun"], ["req", "var"], [", ", "pun"], ["res", "var"], [") => {\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["c", "var"], [" = ", "pun"], ["normalize", "fn"], ["(", "pun"], ["req", "var"], [".", "pun"], ["body", "prop"], [");\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["jobs", "var"], [" = ", "pun"], ["await", "kw"], [" ", "pun"], ["schedule", "fn"], ["(", "pun"], ["c", "var"], [");\n  ", "pun"], ["res", "var"], [".", "pun"], ["json", "fn"], ["({ ", "pun"], ["queued", "var"], [": ", "pun"], ["jobs", "var"], [".", "pun"], ["length", "prop"], [" });\n});\n\n", "pun"], ["app", "var"], [".", "pun"], ["listen", "fn"], ["(", "pun"], ["3000", "num"], [");\n\n", "pun"], ["import", "kw"], [" { ", "pun"], ["useState", "var"], [", ", "pun"], ["useEffect", "var"], [" } ", "pun"], ["from", "kw"], [" ", "pun"], ["\"react\"", "str"], [";\n\n", "pun"], ["function", "kw"], [" ", "pun"], ["useTrip", "fn"], ["(", "pun"], ["id", "var"], [") {\n  ", "pun"], ["const", "kw"], [" [", "pun"], ["trip", "var"], [", ", "pun"], ["setTrip", "var"], ["] = ", "pun"], ["useState", "fn"], ["(", "pun"], ["null", "var"], [");\n\n  ", "pun"], ["useEffect", "fn"], ["(() => {\n    ", "pun"], ["fetch", "fn"], ["(", "pun"], ["\"/api/trips/\"", "str"], [" + ", "pun"], ["id", "var"], [")\n      .", "pun"], ["then", "fn"], ["((", "pun"], ["r", "var"], [") => ", "pun"], ["r", "var"], [".", "pun"], ["json", "fn"], ["())\n      .", "pun"], ["then", "fn"], ["(", "pun"], ["setTrip", "var"], [");\n  }, [", "pun"], ["id", "var"], ["]);\n\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["trip", "var"], [";\n}", "pun"]], [["type", "kw"], [" ", "pun"], ["Contract", "var"], [" = {\n  ", "pun"], ["source", "var"], [": ", "pun"], ["\"rest\"", "str"], [" | ", "pun"], ["\"graphql\"", "str"], [";\n  ", "pun"], ["map", "var"], [": (", "pun"], ["payload", "var"], [") => ", "pun"], ["Record", "var"], [";\n};\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["config", "var"], [" = {\n  ", "pun"], ["retries", "var"], [": ", "pun"], ["3", "num"], [",\n  ", "pun"], ["timeout", "var"], [": ", "pun"], ["5000", "num"], [",\n  ", "pun"], ["backoff", "var"], [": ", "pun"], ["\"exponential\"", "str"], [",\n};\n\n", "pun"], ["export", "kw"], [" ", "pun"], ["default", "kw"], [" ", "pun"], ["config", "var"], [";\n\n", "pun"], ["export", "kw"], [" ", "pun"], ["function", "kw"], [" ", "pun"], ["once", "fn"], ["(", "pun"], ["fn", "var"], [") {\n  ", "pun"], ["let", "kw"], [" ", "pun"], ["done", "var"], [" = ", "pun"], ["false", "var"], [";\n  ", "pun"], ["let", "kw"], [" ", "pun"], ["value", "var"], [";\n  ", "pun"], ["return", "kw"], [" (...", "pun"], ["args", "prop"], [") => {\n    ", "pun"], ["if", "kw"], [" (", "pun"], ["done", "var"], [") ", "pun"], ["return", "kw"], [" ", "pun"], ["value", "var"], [";\n    ", "pun"], ["done", "var"], [" = ", "pun"], ["true", "var"], [";\n    ", "pun"], ["value", "var"], [" = ", "pun"], ["fn", "fn"], ["(...", "pun"], ["args", "prop"], [");\n    ", "pun"], ["return", "kw"], [" ", "pun"], ["value", "var"], [";\n  };\n}\n\n", "pun"], ["import", "kw"], [" { ", "pun"], ["useState", "var"], [", ", "pun"], ["useEffect", "var"], [" } ", "pun"], ["from", "kw"], [" ", "pun"], ["\"react\"", "str"], [";\n\n", "pun"], ["function", "kw"], [" ", "pun"], ["useTrip", "fn"], ["(", "pun"], ["id", "var"], [") {\n  ", "pun"], ["const", "kw"], [" [", "pun"], ["trip", "var"], [", ", "pun"], ["setTrip", "var"], ["] = ", "pun"], ["useState", "fn"], ["(", "pun"], ["null", "var"], [");\n\n  ", "pun"], ["useEffect", "fn"], ["(() => {\n    ", "pun"], ["fetch", "fn"], ["(", "pun"], ["\"/api/trips/\"", "str"], [" + ", "pun"], ["id", "var"], [")\n      .", "pun"], ["then", "fn"], ["((", "pun"], ["r", "var"], [") => ", "pun"], ["r", "var"], [".", "pun"], ["json", "fn"], ["())\n      .", "pun"], ["then", "fn"], ["(", "pun"], ["setTrip", "var"], [");\n  }, [", "pun"], ["id", "var"], ["]);\n\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["trip", "var"], [";\n}\n\n", "pun"], ["function", "kw"], [" ", "pun"], ["resolve", "fn"], ["(", "pun"], ["source", "var"], [") {\n  ", "pun"], ["switch", "kw"], [" (", "pun"], ["source", "var"], [") {\n    ", "pun"], ["case", "kw"], [" ", "pun"], ["\"rest\"", "str"], [": ", "pun"], ["return", "kw"], [" ", "pun"], ["fromRest", "var"], [";\n    ", "pun"], ["case", "kw"], [" ", "pun"], ["\"graphql\"", "str"], [": ", "pun"], ["return", "kw"], [" ", "pun"], ["fromGraph", "var"], [";\n    ", "pun"], ["default", "kw"], [": ", "pun"], ["return", "kw"], [" ", "pun"], ["identity", "var"], [";\n  }\n}\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["queue", "var"], [" = ", "pun"], ["new", "kw"], [" ", "pun"], ["Queue", "fn"], ["(", "pun"], ["\"jobs\"", "str"], [");\n\n", "pun"], ["queue", "var"], [".", "pun"], ["process", "fn"], ["(", "pun"], ["async", "kw"], [" (", "pun"], ["job", "var"], [") => {\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["data", "var"], [" = ", "pun"], ["normalize", "fn"], ["(", "pun"], ["job", "var"], [".", "pun"], ["data", "prop"], [");\n  ", "pun"], ["await", "kw"], [" ", "pun"], ["deliver", "fn"], ["(", "pun"], ["data", "var"], [");\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["job", "var"], [".", "pun"], ["done", "fn"], ["();\n});", "pun"]], [["function", "kw"], [" ", "pun"], ["resolve", "fn"], ["(", "pun"], ["source", "var"], [") {\n  ", "pun"], ["switch", "kw"], [" (", "pun"], ["source", "var"], [") {\n    ", "pun"], ["case", "kw"], [" ", "pun"], ["\"rest\"", "str"], [": ", "pun"], ["return", "kw"], [" ", "pun"], ["fromRest", "var"], [";\n    ", "pun"], ["case", "kw"], [" ", "pun"], ["\"graphql\"", "str"], [": ", "pun"], ["return", "kw"], [" ", "pun"], ["fromGraph", "var"], [";\n    ", "pun"], ["default", "kw"], [": ", "pun"], ["return", "kw"], [" ", "pun"], ["identity", "var"], [";\n  }\n}\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["queue", "var"], [" = ", "pun"], ["new", "kw"], [" ", "pun"], ["Queue", "fn"], ["(", "pun"], ["\"jobs\"", "str"], [");\n\n", "pun"], ["queue", "var"], [".", "pun"], ["process", "fn"], ["(", "pun"], ["async", "kw"], [" (", "pun"], ["job", "var"], [") => {\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["data", "var"], [" = ", "pun"], ["normalize", "fn"], ["(", "pun"], ["job", "var"], [".", "pun"], ["data", "prop"], [");\n  ", "pun"], ["await", "kw"], [" ", "pun"], ["deliver", "fn"], ["(", "pun"], ["data", "var"], [");\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["job", "var"], [".", "pun"], ["done", "fn"], ["();\n});\n\n", "pun"], ["import", "kw"], [" ", "pun"], ["express", "var"], [" ", "pun"], ["from", "kw"], [" ", "pun"], ["\"express\"", "str"], [";\n", "pun"], ["import", "kw"], [" { ", "pun"], ["Router", "var"], [" } ", "pun"], ["from", "kw"], [" ", "pun"], ["\"express\"", "str"], [";\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["app", "var"], [" = ", "pun"], ["express", "fn"], ["();\n", "pun"], ["const", "kw"], [" ", "pun"], ["api", "var"], [" = ", "pun"], ["Router", "fn"], ["();\n", "pun"], ["app", "var"], [".", "pun"], ["use", "fn"], ["(", "pun"], ["express", "var"], [".", "pun"], ["json", "fn"], ["());\n\n", "pun"], ["api", "var"], [".", "pun"], ["post", "fn"], ["(", "pun"], ["\"/sync\"", "str"], [", ", "pun"], ["async", "kw"], [" (", "pun"], ["req", "var"], [", ", "pun"], ["res", "var"], [") => {\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["c", "var"], [" = ", "pun"], ["normalize", "fn"], ["(", "pun"], ["req", "var"], [".", "pun"], ["body", "prop"], [");\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["jobs", "var"], [" = ", "pun"], ["await", "kw"], [" ", "pun"], ["schedule", "fn"], ["(", "pun"], ["c", "var"], [");\n  ", "pun"], ["res", "var"], [".", "pun"], ["json", "fn"], ["({ ", "pun"], ["queued", "var"], [": ", "pun"], ["jobs", "var"], [".", "pun"], ["length", "prop"], [" });\n});\n\n", "pun"], ["app", "var"], [".", "pun"], ["listen", "fn"], ["(", "pun"], ["3000", "num"], [");\n\n", "pun"], ["const", "kw"], [" ", "pun"], ["prisma", "var"], [" = ", "pun"], ["new", "kw"], [" ", "pun"], ["PrismaClient", "fn"], ["();\n\n", "pun"], ["async", "kw"], [" ", "pun"], ["function", "kw"], [" ", "pun"], ["onboard", "fn"], ["(", "pun"], ["name", "var"], [") {\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["prisma", "var"], [".", "pun"], ["tenant", "prop"], [".", "pun"], ["create", "fn"], ["({\n    ", "pun"], ["data", "var"], [": { ", "pun"], ["name", "var"], [", ", "pun"], ["active", "var"], [": ", "pun"], ["true", "var"], [" },\n  });\n}\n\n", "pun"], ["async", "kw"], [" ", "pun"], ["function", "kw"], [" ", "pun"], ["sync", "fn"], ["(", "pun"], ["tenant", "var"], [") {\n  ", "pun"], ["const", "kw"], [" ", "pun"], ["jobs", "var"], [" = ", "pun"], ["await", "kw"], [" ", "pun"], ["plan", "fn"], ["(", "pun"], ["tenant", "var"], [");\n  ", "pun"], ["await", "kw"], [" ", "pun"], ["queue", "var"], [".", "pun"], ["addBulk", "fn"], ["(", "pun"], ["jobs", "var"], [");\n  ", "pun"], ["return", "kw"], [" ", "pun"], ["jobs", "var"], [".", "pun"], ["length", "prop"], [";\n}\n\n", "pun"], ["export", "kw"], [" ", "pun"], ["function", "kw"], [" ", "pun"], ["once", "fn"], ["(", "pun"], ["fn", "var"], [") {\n  ", "pun"], ["let", "kw"], [" ", "pun"], ["done", "var"], [" = ", "pun"], ["false", "var"], [";\n  ", "pun"], ["let", "kw"], [" ", "pun"], ["value", "var"], [";\n  ", "pun"], ["return", "kw"], [" (...", "pun"], ["args", "prop"], [") => {\n    ", "pun"], ["if", "kw"], [" (", "pun"], ["done", "var"], [") ", "pun"], ["return", "kw"], [" ", "pun"], ["value", "var"], [";\n    ", "pun"], ["done", "var"], [" = ", "pun"], ["true", "var"], [";\n    ", "pun"], ["value", "var"], [" = ", "pun"], ["fn", "fn"], ["(...", "pun"], ["args", "prop"], [");\n    ", "pun"], ["return", "kw"], [" ", "pun"], ["value", "var"], [";\n  };\n}", "pun"]]];
  var CARET='<span class="cbcaret"></span>';
  function render(toks,n){var h="",sh=0;for(var i=0;i<toks.length;i++){var t=toks[i][0];if(sh>=n)break;var take=Math.min(t.length,n-sh);h+='<span class="'+toks[i][1]+'">'+e(t.slice(0,take))+'</span>';sh+=take;}return h;}
  function total(toks){return toks.reduce(function(a,x){return a+x[0].length},0);}
  // A small blank "type head" (~1.5 lines) sweeps down each column and wraps around.
  // Text vanishes at the head and reappears behind it, so every column is visibly
  // moving at all times while only that little window is ever empty — full coverage,
  // never static. Columns start at spread phases and drift at different speeds.
  function renderHole(toks,hs,gap,tot){var h="",sh=0;for(var i=0;i<toks.length;i++){var t=toks[i][0],cls=toks[i][1],ln=t.length,out="";for(var j=0;j<ln;j++){var gi=sh+j,d=(gi-hs)%tot;if(d<0)d+=tot;var ch=t.charAt(j);out+=(d<gap)?(ch==="\n"?"\n":" "):ch;}h+='<span class="'+cls+'">'+e(out)+'</span>';sh+=ln;}return h;}
  cols.forEach(function(el,ci){
    var toks=SNIPS[ci%SNIPS.length],tot=total(toks);
    el.innerHTML=render(toks,tot);
    if(reduce)return;
    var gap=58,p=(tot/cols.length)*ci,step=3.4+(ci%3)*1.1;
    (function tick(){p=(p+step)%tot;el.innerHTML=renderHole(toks,p,gap,tot);setTimeout(tick,50);})();
  });
})();