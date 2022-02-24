import {UI} from './ui.js';
import {COOKIES} from './cookies.js';
import {sendRequest} from './api.js';
const METHODS = {
  patch:"PATCH",
  get:"GET",
  post:"POST",
}

const emailData = JSON.parse(localStorage.getItem('email'));
const TOKEN = COOKIES.getCookie('token');   
const socket = new WebSocket(`ws://chat1-341409.oa.r.appspot.com/websockets?${TOKEN}`);


 socket.onmessage = function(event) {

   const incomeMessage = JSON.parse(event.data);
   console.log(incomeMessage);

   if(incomeMessage.user.email !== emailData.email) {

     console.log(typeof incomeMessage.text)
    const message = incomeMessage.text;
    const screen = UI.readScreen;
    const t = document.querySelector("#hisTml");
    const txt = t.content.querySelector('span');
    const time = t.content.querySelector('.time');

   txt.textContent = incomeMessage.user.name+":"+message;
   time.textContent = getTime();
   const elem = t.content.cloneNode(true);
   screen.append(elem);

   UI.readScreenBox.scrollTop = UI.readScreenBox.scrollHeight;
   UI.writeMessageField.value='';
   }
   }

UI.formEvent.addEventListener('submit', sendMessage);

function sendMessage(){

  const message = UI.writeMessageField.value;
  const screen = UI.readScreen;

  if(!message) return;

  const obj = {text:message};
  
  //socket.onopen = function(e){
    socket.send(JSON.stringify(obj));

  const t = document.querySelector("#tmpl");
  const txt = t.content.querySelector('span');
  const time = t.content.querySelector('.time');

  txt.textContent = ("Я:"+message);
  time.textContent = getTime();
  const elem = t.content.cloneNode(true);
  screen.append(elem);

  UI.readScreenBox.scrollTop = UI.readScreenBox.scrollHeight;
  UI.writeMessageField.value='';
}


function getTime(){

    const date = new Date();
    const hours = date.getHours();
    let minutes = date.getMinutes();
    minutes = (minutes<10) ? '0'+minutes: minutes;
    return `${hours}:${minutes}`;
  }


  UI.avorizationBtn.addEventListener('click', sendEmail);

 async function sendEmail(){
    const URL = "https://chat1-341409.oa.r.appspot.com/api/user";
    const value = UI.avorizationInp.value;

    if(!value) return;

    const  emailData = {
      email:value,
    }

    localStorage.setItem('email', JSON.stringify(emailData));
   const response = sendRequest( METHODS.post, URL, null, JSON.stringify(emailData));
 
   UI.avorizationInp.value='';
  }


UI.approveBtn.addEventListener('click', saveCookie);

 function saveCookie(){
  const value = UI.approveInp.value;
  if(!value) return; 
  COOKIES.setCookie('token',value, {secure: true, 'max-age': 3600});
  UI.approveInp.value='';
}



UI.nameBtn.addEventListener('click', setName);

async function setName(){
  const URL = 'https://chat1-341409.oa.r.appspot.com/api/user';
  const userDataUrl = 'https://chat1-341409.oa.r.appspot.com/api/user/me';
  const value = UI.nameInp.value;
  const token = COOKIES.getCookie('token');
  
  const obj = {
    name: value
  }
  

 const response = sendRequest( METHODS.patch, URL, token, JSON.stringify(obj));
 const json = await response;
 console.log(json);


  const userDataResponse = sendRequest(METHODS.get, userDataUrl, token, null);
  const userJson = await userDataResponse;
  console.log(userJson);
 
 UI.nameInp.value='';
}

async function historyGet(){
  const token = COOKIES.getCookie('token');
  const URL = 'https://chat1-341409.oa.r.appspot.com/api/messages';
  const historyResponse = sendRequest(METHODS.get, URL, token, null);
  const historyJson = await historyResponse;
  // historyJson.messages.forEach(x=> renderHistory(x.text, x.user.email, x.user.name));
  let i= localStorage.getItem('i') || 0;
 
    for(i; i<5; i++){
      renderHistory(historyJson.messages[i].text, historyJson.messages[i].user.email, historyJson.messages[i].user.name);
    }
    localStorage.setItem('i',0);
}
historyGet();
 


    function renderHistory(historyMes, email, name){
    const message = historyMes;
    const screen = UI.readScreen;
    const emailData = JSON.parse(localStorage.getItem('email'));
    let t;
    
    if(email === emailData.email){
       t = document.querySelector('#tmpl');
    }else{
       t = document.querySelector('#hisTml');
    }

    const txt = t.content.querySelector('span');
    const time = t.content.querySelector('.time');
    txt.textContent = (`${name}: ${message}`);
    time.textContent = getTime();
    let elem = t.content.cloneNode(true);
    screen.prepend(elem);
    UI.readScreenBox.scrollTop = UI.readScreenBox.scrollHeight;
}


UI.readScreenBox.addEventListener('scroll', function(event){
if(event.target.scrollTop == 0){
  let y = event.target.scrollHeight;
  historyGet();
  event.target.scrollTo(0, event.target.scrollHeight - y);
}

})

//console.log(scrollY+'px');