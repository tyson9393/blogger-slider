
```javascript
/*!
 slider.js — Multi-instance Blogger slider
 Features: pixel-accurate drag, thumbnails, progress dots, mobile-safe init.
*/
(function(global){
  'use strict';

  function qs(sel, ctx){ return (ctx||document).querySelector(sel); }
  function qsa(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }

  function initSliders(){
    const containers = qsa('.slider-container');
    containers.forEach(initInstance);
  }

  function initInstance(container){
    const slider = qs('.slider', container);
    const slidesWrapper = qs('.slides', container);
    if(!slidesWrapper) return;
    const slides = qsa('.slide', slidesWrapper);
    if(slides.length === 0) return;

    const prevBtn = qs('.slider-arrow.prev', container);
    const nextBtn = qs('.slider-arrow.next', container);
    const thumbsWrap = qs('.thumbnails', container);

    let dotsWrap = container.querySelector('.progress-dots');
    if(!dotsWrap){
      dotsWrap = document.createElement('div');
      dotsWrap.className = 'progress-dots';
      dotsWrap.style.cssText = 'display:flex;gap:6px;justify-content:center;margin-top:10px';
      container.appendChild(dotsWrap);
    }

    let index = 0;
    let containerW = 0;
    let isDragging = false;
    let startX = 0, curX = 0, baseTranslate = 0, startTime = 0;
    const origPads = slides.map(s => s.style.padding || '');

    slides.forEach(s=>{
      const im = qs('img', s);
      if(im) im.setAttribute('draggable','false');
    });

    function buildThumbs(){
      thumbsWrap.innerHTML='';
      slides.forEach((s,i)=>{
        const im = qs('img', s);
        const t = document.createElement('img');
        t.src = im ? im.src : '';
        t.dataset.index = i;
        t.style.cssText = 'height:72px;border-radius:6px;cursor:pointer;flex:0 0 auto';
        t.style.opacity = i===0 ? '1' : '0.7';
        t.style.border = i===0 ? '2px solid #bf9000' : '2px solid transparent';
        t.addEventListener('click',()=>goTo(i));
        t.tabIndex=0;
        thumbsWrap.appendChild(t);
      });
    }

    function buildDots(){
      dotsWrap.innerHTML='';
      slides.forEach((_,i)=>{
        const d = document.createElement('button');
        d.type='button';
        d.dataset.index=i;
        d.setAttribute('aria-label','Slide '+(i+1));
        d.style.cssText='width:10px;height:10px;border-radius:50%;border:0;padding:0;cursor:pointer';
        d.style.background = i===0 ? '#bf9000' : 'rgba(0,0,0,0.18)';
        d.addEventListener('click',()=>goTo(i));
        dotsWrap.appendChild(d);
      });
    }

    function setSizes(){
      containerW = Math.max(1,container.clientWidth);
      slidesWrapper.style.width = (containerW*slides.length)+'px';
      slides.forEach(s=>{
        s.style.minWidth=containerW+'px';
        s.style.maxWidth=containerW+'px';
        s.style.boxSizing='border-box';
      });
      slidesWrapper.style.transition='none';
      slidesWrapper.style.transform='translate3d('+(-index*containerW)+'px,0,0)';
      setTimeout(()=>slidesWrapper.style.transition='transform .36s cubic-bezier(.22,.9,.4,1)',30);
    }

    function updateUI(){
      slides.forEach((s,i)=>s.classList.toggle('active',i===index));
      qsa('img',thumbsWrap).forEach((t,i)=>{
        t.style.opacity=i===index?'1':'0.7';
        t.style.border=i===index?'2px solid #bf9000':'2px solid transparent';
      });
      qsa('button',dotsWrap).forEach((d,i)=>{
        d.style.background=i===index?'#bf9000':'rgba(0,0,0,0.18)';
      });
      slidesWrapper.style.transition='transform .36s cubic-bezier(.22,.9,.4,1)';
      slidesWrapper.style.transform='translate3d('+(-index*containerW)+'px,0,0)';
    }

    function goTo(i){
      index=Math.max(0,Math.min(i,slides.length-1));
      updateUI();
    }

    function startDrag(px){
      isDragging=true;startX=px;curX=px;startTime=Date.now();
      baseTranslate=-index*containerW;
      slidesWrapper.style.transition='none';
      slides.forEach((s,i)=>s.style.padding='0');
    }
    function moveDrag(px){
      if(!isDragging)return;
      curX=px;
      const dx=curX-startX;
      slidesWrapper.style.transform='translate3d('+(baseTranslate+dx)+'px,0,0)';
    }
    function endDrag(){
      if(!isDragging)return;
      isDragging=false;
      slides.forEach((s,i)=>s.style.padding=origPads[i]||'');
      const dx=curX-startX, dt=Date.now()-startTime;
      const threshold=Math.max(56,containerW*0.12);
      const fast=Math.abs(dx)>20 && dt<220;
      if(dx<-threshold|| (dx<-20&&fast)) index++;
      else if(dx>threshold|| (dx>20&&fast)) index--;
      index=Math.max(0,Math.min(index,slides.length-1));
      updateUI();
    }

    if(window.PointerEvent){
      container.addEventListener('pointerdown',e=>{if(e.button!==0)return;startDrag(e.clientX)},{passive:true});
      container.addEventListener('pointermove',e=>{if(isDragging){moveDrag(e.clientX);e.preventDefault();}},{passive:false});
      container.addEventListener('pointerup',()=>endDrag());
    } else {
      container.addEventListener('touchstart',e=>startDrag(e.touches[0].clientX),{passive:true});
      container.addEventListener('touchmove',e=>{if(isDragging){moveDrag(e.touches[0].clientX);e.preventDefault();}},{passive:false});
      container.addEventListener('touchend',endDrag);
    }

    prevBtn && prevBtn.addEventListener('click',()=>goTo(index-1));
    nextBtn && nextBtn.addEventListener('click',()=>goTo(index+1));
    window.addEventListener('resize',setSizes);

    buildThumbs();
    buildDots();
    setSizes();
    updateUI();
  }

  function safeInit(){
    function run(){
      try{ initSliders(); }catch(e){ console.error(e); }
    }
    if(document.readyState==='complete') setTimeout(run,80);
    else window.addEventListener('load',()=>setTimeout(run,80));
  }

  global.__BLOGGER_SLIDER={init:safeInit};
  safeInit();

})(window);
