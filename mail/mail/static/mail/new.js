document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox'); 
});

function compose_email() { 

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').onsubmit = function(){
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value ,
        subject:  document.querySelector('#compose-subject').value ,
        body:   document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
}


}

function load_mailbox(mailbox) {


  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-body').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === "sent"){

    fetch('/emails/sent')
    .then(response => response.json())
    .then(sent => {
    // Print emails
    //console.log(sent);
    //console.log(JSON.parse(sent[0]).body)
    sent.forEach(add_email);

    // ... do something else with emails ...

});
  }
  else if(mailbox === "inbox"){
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
    // Print emails
    //console.log(emails);

    // ... do something else with emails ...
    emails.forEach(add_email);
});

  }
  else if(mailbox === "archive"){
    fetch('/emails/archive')
    .then(response => response.json())
    .then(archive => {
      //console.log(archive);

      archive.forEach(add_email);
    });
  }

}



function add_email(contents){

  const element = document.createElement('div');
  element.className = 'sent';
  let sender = contents.sender;
  let subject = contents.subject
  let time = contents.timestamp

  if (contents.read === false){
    element.innerHTML = `<div class="card">
  <div class="card-body">
  <h5 class="card-title">From : ${sender}.</h5>
  Subject : ${subject}.
  <h6 class="card-subtitle mb-2 text-muted">${time}</h6>

  </div>

  </div>`
    document.querySelector('#emails-view').append(element);
  }
else if (contents.archived === true){

    element.innerHTML = `<div class="card">
  <div class="card-body" id="sent_email">
  <h5 class="card-title">From : ${sender}.</h5>
  Subject : ${subject}.
  <h6 class="card-subtitle mb-2 text-muted">${time}</h6>
    <button type="button" class="btn btn-primary" id="unarchive">Unarchive</button>
  </div>

  </div>`
    document.querySelector('#emails-view').append(element);

    //const here = document.createElement('button')

    //here.innerHTML = `<button type="button" class="btn btn-primary id="unarchive">Unarchive</button>`
    //document.querySelector('#sent_email').append(here)


    element.querySelector('#unarchive').addEventListener('click', function(){

    let more = contents

    fetch(`/emails/${more.id}`, {
    method: 'PUT',
    body: JSON.stringify({
    archived: false
  })
 })
})


}
  else{
    element.innerHTML = `<div class="card" style="background-color:#c3c0c0;">
  <div class="card-body">
  <h5 class="card-title">From : ${sender}.</h5>
  Subject : ${subject}.
  <h6 class="card-subtitle mb-2 text-muted">${time}</h6>

  </div>

  </div>`
    document.querySelector('#emails-view').append(element);
  }






  element.addEventListener('click', function(){

    //document.querySelector('.here').remove();
    fetch(`/emails/${contents.id}`)
    .then(response => response.json())
    .then(email => {
    // Print email
    console.log(email);

    data = email



  let here = document.createElement('div');

  here.className = 'here';

let mine = document.querySelector('#email-user').value;

    console.log(mine);

if (data.recipients[0] === document.querySelector('#email-user').value && data.archived === false){


  here.innerHTML = `<div class="card" id="body-email">
  <div class="card-body" >
  <h5 class="card-title">From : ${data.sender}.</h5>
  Subject : ${data.subject}.
  <p class="card-text">${data.body}</p>
  <h6 class="card-subtitle mb-2 text-muted">${data.timestamp}</h6>
   <button type="button" class="btn btn-danger" id="archive-email" value="${data.id}">Archive</button>
    <button type="button" class="btn btn-success" id="reply-email">Reply</button>
  </div>
  </div>`

    if(document.querySelector('#body-email')){

    console.log("nawe worked")
    const list = document.querySelector('#emails-body');
    list.children[0].remove();

    }
document.querySelector('#emails-body').appendChild(here);





var els = document.querySelectorAll('#archive-email');

for (var i= 0; i < els.length; i ++){
    var but = els[i]
    let id_email = but.value;
    but.addEventListener('click', function(){
      document.querySelector('#emails-body').style.display = 'none';
    console.log(contents);
    fetch(`/emails/${contents.id}`, {
    method: 'PUT',
    body: JSON.stringify({
    archived: true
  })
})
    })
    console.log(but)
}



}

    else{
  here.innerHTML = `<div class="card" id="body-email">
  <div class="card-body">
  <h5 class="card-title">To : ${data.recipients[0]}.</h5>
  Subject : ${data.subject}.
  <p class="card-text">${data.body}</p>

  <h6 class="card-subtitle mb-2 text-muted">${data.timestamp}</h6>
  </div>
  </div>`
    if(document.querySelector('#body-email')){

    console.log("gwe please work nawe")
    const list = document.querySelector('#emails-body');
    list.children[0].remove();

    }
  document.querySelector('#emails-body').append(here);

        }



if(document.querySelector('#reply-email')){

  document.querySelector('#reply-email').addEventListener('click', function(){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#emails-body').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';



  // Clear out composition fields
  document.querySelector('#compose-recipients').value = data.recipients[0];
  document.querySelector('#email-user').value = data.sender;
  document.querySelector('#compose-subject').value = `Re : ${data.subject}`;
  document.querySelector('#compose-body').value = `On ${data.timestamp} ${data.sender} wrote : ${data.body}`;
    var check = document.querySelector("#compose-view");
  const element = document.createElement('div');
    element.innerHTML = `<textarea class="form-control" id="compose-reply" placeholder="Body"></textarea>`
    document.querySelector('#compose-view').append(element);
  });



}
document.querySelector('#emails-view').style.display = 'none';
document.querySelector('#emails-body').style.display = 'block';



});

  fetch(`/emails/${contents.id}`, {
  method: 'PUT',
  body: JSON.stringify({
      read: true
  })
});

});

}
