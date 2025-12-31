!function(){let e=!1,t=null,n=null,i={count:40,speed:1.8,radius:2.5,wind:.5,color:"#f1f2f6",opacity:.8,randomizeSpeed:!1,randomizeSize:!1};function l(){if(e)return;if(document.getElementById("snowfall-container")){e=!0;return}let n=document.createElement("div");n.id="snowfall-container",n.style.position="fixed",n.style.top="0",n.style.left="0",n.style.width="100%",n.style.height="100%",n.style.pointerEvents="none",n.style.zIndex="9998",n.style.overflow="hidden",document.body.appendChild(n),t=n;for(let l=0;l<i.count;l++){let a=document.createElement("div");a.className="snowflake";let o=i.radius;i.randomizeSize&&(o=i.radius*(.5+1.5*Math.random()));let s=i.speed;i.randomizeSpeed&&(s=i.speed*(.5+1.5*Math.random()));let d=Math.random()*window.innerWidth,r=window.innerHeight/s*20,y=Math.random()*r;a.style.width=2*o+"px",a.style.height=2*o+"px",a.style.backgroundColor=i.color,a.style.opacity=i.opacity.toString(),a.style.boxShadow=`0 0 ${o}px ${i.color}`,a.style.left=d+"px",a.style.top="-10px",a.style.borderRadius="50%",a.style.position="absolute",a.style.animation=`snowfall ${r}ms linear infinite`,a.style.animationDelay=y+"ms",a.style.willChange="transform, opacity",a.style.backfaceVisibility="hidden",n.appendChild(a)}e=!0}if("loading"===document.readyState?document.addEventListener("DOMContentLoaded",l):l(),window.addEventListener("resize",function t(){clearTimeout(n),n=setTimeout(function(){document.getElementById("snowfall-container")||(e=!1,l())},1e3)}),document.addEventListener("visibilitychange",function(){"visible"!==document.visibilityState||document.getElementById("snowfall-container")||(e=!1,l())}),!document.getElementById("snowfall-styles")){let a=document.createElement("style");a.id="snowfall-styles",a.textContent=`
            @keyframes snowfall {
                0% {
                    opacity: 0;
                    transform: translateY(-10px) translateX(0);
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                    transform: translateY(100vh) translateX(${50*i.wind}px);
                }
            }

            @media (max-width: 480px) {
                .snowflake {
                    width: 4px !important;
                    height: 4px !important;
                }
            }
        `,document.head.appendChild(a)}}();