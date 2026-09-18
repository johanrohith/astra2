const $=s=>document.querySelector(s);
const chat=$("#chat"), input=$("#input"), historyEl=$("#history");
let conversations=JSON.parse(localStorage.getItem("astra_chats")||"[]");
let current={id:Date.now(),title:"New chat",messages:[]};
let endpoint=localStorage.getItem("astra_endpoint")||"";
let apiKey=localStorage.getItem("astra_key")||"";

function save(){localStorage.setItem("astra_chats",JSON.stringify(conversations))}
function renderHistory(){historyEl.innerHTML=""; conversations.slice().reverse().forEach(c=>{const b=document.createElement("button");b.textContent=c.title;b.onclick=()=>loadChat(c.id);historyEl.appendChild(b)})}
function render(){chat.innerHTML=""; if(!current.messages.length){chat.innerHTML=`<div class="welcome"><div class="big-logo">✦</div><h1>How can I help you?</h1><p>Ask anything. Your conversations stay in this browser.</p><div class="suggestions"><button>Explain quantum computing simply</button><button>Write a Java program using AWT</button><button>Help me plan a project</button><button>Give me creative ideas</button></div></div>`;document.querySelectorAll(".suggestions button").forEach(b=>b.onclick=()=>{input.value=b.textContent;send()});return}
current.messages.forEach(m=>addMessage(m.role,m.content));chat.scrollTop=chat.scrollHeight}
function addMessage(role,text){const d=document.createElement("div");d.className="message "+role;d.innerHTML=`<div class="avatar">${role==="user"?"U":"✦"}</div><div class="body"></div>`;d.querySelector(".body").textContent=text;chat.appendChild(d)}
function loadChat(id){const c=conversations.find(x=>x.id===id);if(c){current=structuredClone(c);render();$("#sidebar").classList.remove("open")}}
function persistCurrent(){const i=conversations.findIndex(x=>x.id===current.id);if(i>=0)conversations[i]=structuredClone(current);else conversations.push(structuredClone(current));save();renderHistory()}
function newChat(){persistCurrent();current={id:Date.now(),title:"New chat",messages:[]};render();input.focus()}
function clearChat(){current.messages=[];current.title="New chat";persistCurrent();render()}
async function send(){const text=input.value.trim();if(!text)return;input.value="";input.style.height="auto";if(!current.messages.length)current.title=text.slice(0,38);current.messages.push({role:"user",content:text});render();persistCurrent();
const wait={role:"assistant",content:""};current.messages.push(wait);render();const body=chat.lastElementChild.querySelector(".body");body.textContent="Thinking…";
try{
 let reply;
 if(endpoint){
   const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json",...(apiKey?{"Authorization":"Bearer "+apiKey}:{})},body:JSON.stringify({messages:current.messages.slice(0,-1)})});
   if(!r.ok)throw new Error("Server returned "+r.status);
   const data=await r.json(); reply=data.reply||data.message||data.content;
   if(typeof reply!=="string")throw new Error("Response did not contain reply/message/content");
 }else{
   await new Promise(r=>setTimeout(r,650));
   reply="I’m running in demo mode. Open Settings and add your own chat API endpoint to connect a real AI model.";
 }
 wait.content=reply;body.textContent=reply;persistCurrent();
}catch(e){wait.content="Connection error: "+e.message;body.textContent=wait.content;persistCurrent()}
chat.scrollTop=chat.scrollHeight}
$("#composer").onsubmit=e=>{e.preventDefault();send()};
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}});
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,180)+"px"});
$("#newChat").onclick=newChat;$("#clearBtn").onclick=clearChat;$("#menuBtn").onclick=()=>$("#sidebar").classList.toggle("open");
$("#settingsBtn").onclick=()=>{$("#endpoint").value=endpoint;$("#apiKey").value=apiKey;$("#settings").classList.remove("hidden")};
$("#closeSettings").onclick=()=>$("#settings").classList.add("hidden");
$("#saveSettings").onclick=()=>{endpoint=$("#endpoint").value.trim();apiKey=$("#apiKey").value;localStorage.setItem("astra_endpoint",endpoint);localStorage.setItem("astra_key",apiKey);$("#settings").classList.add("hidden")};
renderHistory();render();