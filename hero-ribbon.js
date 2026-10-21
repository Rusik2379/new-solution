// The original ribbed sculpture, rendered locally in the brandbook palette.
(() => {
  const canvas=document.querySelector('#hero-art');
  if(!canvas)return;
  const context=canvas.getContext('2d');
  if(!context)return;
  const teal=[31,158,154],gold=[200,165,106],graphite=[31,36,48],ivory=[247,245,239];
  const mix=(a,b,amount)=>a.map((value,index)=>value+(b[index]-value)*amount);
  const tau=Math.PI*2;
  const rings=220,segments=135;
  const vertices=[];
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(let j=0;j<=rings;j++){
    const v=j/rings*tau;
    const row=[];
    for(let i=0;i<=segments;i++){
      const u=i/segments*tau;
      const major=170+Math.sin(u*2+.7)*28;
      const minor=93+Math.sin(u*3)*13;
      const rib=Math.cos(v*55)*2.4;
      const radius=major+(minor+rib)*Math.cos(v);
      const x=radius*Math.cos(u),y=radius*Math.sin(u);
      const z=(minor+rib)*Math.sin(v)+Math.sin(u*2)*38;
      const tilt=.97,turn=-.6;
      const y1=y*Math.cos(tilt)-z*Math.sin(tilt);
      const z1=y*Math.sin(tilt)+z*Math.cos(tilt);
      const perspective=1+z1/1600;
      const point={x:(x*Math.cos(turn)-y1*Math.sin(turn))*1.3*perspective,y:(x*Math.sin(turn)+y1*Math.cos(turn))*1.64*perspective,z:z1};
      minX=Math.min(minX,point.x);maxX=Math.max(maxX,point.x);
      minY=Math.min(minY,point.y);maxY=Math.max(maxY,point.y);
      row.push(point);
    }
    vertices.push(row);
  }
  const patches=[];
  for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){
    const u=(i+.5)/segments*tau,v=(j+.5)/rings*tau;
    const points=[vertices[j][i],vertices[j][i+1],vertices[j+1][i+1],vertices[j+1][i]];
    const ribShade=[.65,.92,1,.54][j%4];
    const illumination=Math.max(.06,.34+.32*Math.sin(u-.8)+.3*Math.cos(v-.9));
    const shine=Math.pow(Math.max(0,Math.cos(v-.6)),12)*.24;
    const goldAmount=Math.pow(Math.max(0,Math.cos(u-1.05)),4)*.18;
    const material=mix(teal,gold,goldAmount);
    const shaded=mix(graphite,material,Math.min(1,(illumination*ribShade+shine)*1.15));
    const rgb=mix(shaded,ivory,shine*.12).map(Math.round);
    patches.push({points,z:points.reduce((sum,p)=>sum+p.z,0)/4,color:`rgb(${rgb.join(',')})`});
  }
  patches.sort((a,b)=>a.z-b.z);
  let lastWidth=0,lastHeight=0,lastRatio=0,frame=0;
  function draw(){
    const width=Math.round(canvas.clientWidth),height=Math.round(canvas.clientHeight);
    const pixelRatio=Math.min(devicePixelRatio||1,2);
    if(!width||!height||(width===lastWidth&&height===lastHeight&&pixelRatio===lastRatio))return;
    lastWidth=width;lastHeight=height;lastRatio=pixelRatio;
    canvas.width=Math.round(width*pixelRatio);canvas.height=Math.round(height*pixelRatio);
    context.setTransform(pixelRatio,0,0,pixelRatio,0,0);
    context.clearRect(0,0,width,height);
    // Fit the complete sculpture with breathing room at every viewport size.
    const scale=Math.min(width/(maxX-minX),height/(maxY-minY))*.94;
    const centerX=(minX+maxX)/2,centerY=(minY+maxY)/2;
    context.lineWidth=.45;
    for(const patch of patches){
      context.beginPath();
      patch.points.forEach((point,index)=>{
        const x=width*.5+(point.x-centerX)*scale,y=height*.5+(point.y-centerY)*scale;
        if(index)context.lineTo(x,y);else context.moveTo(x,y);
      });
      context.closePath();context.fillStyle=patch.color;context.strokeStyle=patch.color;
      context.fill();context.stroke();
    }
  }
  function scheduleDraw(){cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);}
  if('ResizeObserver' in window)new ResizeObserver(scheduleDraw).observe(canvas);
  window.addEventListener('resize',scheduleDraw,{passive:true});
  draw();
})();
