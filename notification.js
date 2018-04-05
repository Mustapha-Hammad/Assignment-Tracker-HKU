var update= require("./update");

window.onload = function(){
  chrome.storage.sync.get(null,function(assignments){
      var s="";
      var diffdays = 0;
      var today = new Date();
      var oneDay = 24*60*60*1000;
      var diffhours = 0;
      var daystyle = "Days";
      var hourstyle = "Hours";

      for (key in assignments)
      {
        var as=assignments[key];
        var coursecode = as.courseName.substr(0,(as.courseName).indexOf(' '));
        var coursestring = (as.courseName).substr((as.courseName).indexOf(' ')+1);
        var assignmentName = as.assignmentName;
        //var colors = ['#009688', '#0288D1' , '#0091EA' , '#F4511E' , '#E64A19' , '#FF3D00' , '#78909C', '691A99', '7A1EA1', '008975', 'FF4081' , '#D84315', '#827717'];
        var buttonid = key;
        //to sort the assignment according to submission status
        if(as.status!="Submitted")
        {
          document.getElementById("defaultduemessage").style.display = "none";
          var id = guidGenerator();

          var clockid = "clockdiv" + key.toString();
          var deadlinedate = new Date(as.deadline);
          var deadlinedatenum = deadlinedate.getDate();
          var deadlinemonth = deadlinedate.getMonth()+1;
          var deadlineyear = deadlinedate.getFullYear();
          var deadlinetime = ((deadlinedate.getHours()<10?'0':'') + deadlinedate.getHours()).toString() + ':' + ((deadlinedate.getMinutes()<10?'0':'') + deadlinedate.getMinutes()).toString();

          var html = '<li><div class="card coursecard" id='+id+'>' + '<span class="cardtext"> <span class="cardtitle">' + coursecode + ' ' + '(' + assignmentName + ')' + '</span><br><span class="cardBody">' + coursestring + '</span><br><br><span class="cardBody">Due on:' + ' ' + deadlinedatenum.toString() + '-' + deadlinemonth.toString() + '-' + deadlineyear.toString() + ',' + ' ' + deadlinetime.toString()  + '</span><br><div class= "clockdiv" id="' + clockid +'"><div><span class="days"></span><div class="smalltext">Days</div></div><div><span class="hours"></span><div class="smalltext">Hours</div></div><div><span class="minutes"></span><div class="smalltext">Minutes</div></div><div><span class="seconds"></span><div class="smalltext">Seconds</div></div></div>' + '<br><br><input type = "checkbox" class="markbutton" id="'+buttonid+'"/>'+ ' ' + '<label class="cardtitle" for=' + '"' + buttonid + '"' + '><span class="cardtext"></span>Mark as Complete</label>' +'</div><span class="dd">' + deadlinedate +  '</span></li>';

          document.getElementById("duecardlist").innerHTML+= html;
         // var random_color = colors[Math.floor(Math.random() * colors.length)];
          document.getElementById(id).style.backgroundColor = "#0D47A1";
          document.getElementById(buttonid).style.backgroundColor = "#0D47A1";

          //function to initialize clock
          var clocks = document.getElementsByClassName("clockdiv");
          var cards = document.getElementsByClassName("coursecard");
          for(var i=0 ; i<clocks.length ; i++){
            var keydate = clocks[i].id.substring(8);
            var dateobject = new Date(assignments[keydate].deadline);
            initializeClock(clocks[i].id, dateobject,cards[i].id);
          }

          function initializeClock(id, endtime,card_id) {
            var clock = document.getElementById(id);
            var daysSpan = clock.querySelector('.days');
            var hoursSpan = clock.querySelector('.hours');
            var minutesSpan = clock.querySelector('.minutes');
            var secondsSpan = clock.querySelector('.seconds');


            function updateClock() {
              var t = getTimeRemaining(endtime);
              if(t.days<2 && t.days>=0){
                document.getElementById(id).style.animation = "blinker 1s linear infinite";
                document.getElementById(id).style.backgroundColor = "#F44336";
                document.getElementById(card_id).style.backgroundColor = "#F44336";
                daysSpan.innerHTML = t.days;
                hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
                minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
                secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
                if (t.total <= 0){
                  clearInterval(timeinterval);}

              }
              else if(t.days<0)
              {
                document.getElementById(id).innerHTML = '<br><span class = "cardtext">Assignment Overdue</span>';
                document.getElementById(id).style.backgroundColor = "#F44336";
                document.getElementById(card_id).style.backgroundColor = "#F44336";


              }
              else{
              daysSpan.innerHTML = t.days;
              hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
              minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
              secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
              if (t.total <= 0){clearInterval(timeinterval);}
            }
            }
            updateClock();
            var timeinterval = setInterval(updateClock, 1000);
          }
        }
        else
        {
          document.getElementById("defaultcompletemessage").style.display = "none";
          var submittedOnDate = new Date(as.submittedOn);
          var submittedOnDateNum = submittedOnDate.getDate();
          var submittedOnMonth = submittedOnDate.getMonth()+1;
          var submittedOnYear = submittedOnDate.getFullYear();
          var submittedOnTime = submittedOnDate.getHours() + ':' + ((submittedOnDate.getMinutes()<10?'0':'') + submittedOnDate.getMinutes());
          var id = guidGenerator();
          var html = '<li class="card coursecard"' + 'id="'+ id + '"><span class="cardtext"><span class="cardtitle">' + coursecode + ' (' + as.assignmentName + ')' + '</span><br><span class="cardBody">' + coursestring + '</span><br><br><span class="cardBody">' + 'Completed on:  ' + submittedOnDateNum.toString() + '-' +  submittedOnMonth.toString() + '-' + submittedOnYear.toString() + ',' + ' ' + submittedOnTime  + '</span></span><br><br><div><input type = "checkbox" class="deletebutton" id="'+buttonid+'"> <label class="cardtitle" for="'+ buttonid+ '"><span class="cardtext"></span>Delete</label>' + '</div><div><input type = "checkbox" class="incompletebutton" id="' +buttonid+'"> <label class="cardtitle" for="'+ buttonid+ '"><span class="cardtext"></span>Mark as Incomplete</label></div></li>';
          document.getElementById("submittedcardlist").innerHTML+= html;
          //var random_color = colors[Math.floor(Math.random() * colors.length)];
          document.getElementById(id).style.backgroundColor = "#43A047";
        }
      }
    })
    // after everything is rendered
   setTimeout(function(){


         document.getElementById("formButton").onclick = function(){
           var x =document.getElementById("addform");
           if (x.style.display === "none"){
             x.style.display = "inline-block";
             document.getElementById("formButton").innerHTML = "Close";
           }
           else
           {
             x.style.display = "none";
             document.getElementById("formButton").innerHTML = "Add New Assignment";
           }
         }

         //Code to add the new assignment to database
         document.getElementById("addsubmit").onclick = function(){
            console.log("in submit");
            if(validateForm()==true)
             {

              var courseName= document.getElementById("ccode").value + " " + document.getElementById("cname").value;
              var status = "Not Submitted";
              var assignmentName = document.getElementById("aname").value;
              var deadline = document.getElementById("calender").value.toString();
              var submittedOn="Undefined";

              if (deadline!="Undefined"){
                update(courseName,assignmentName,deadline,status,submittedOn);
              }
              document.getElementById("addform").style.display = "none";
              document.getElementById("formButton").innerHTML = "Add New Assignment";

            }

            else
            {
              document.getElementById("addform").style.display = "inline-block";
            }
         };


         // creating event listners for all the assignment cards
         var buttons=document.getElementsByClassName('markbutton');
         for (var i=0;i<buttons.length;i++){
           buttons[i].addEventListener('click', function(){submitAssignment(this.id)}, false);
         }

         var incompleteButtons=document.getElementsByClassName('incompletebutton');
         console.log("buttons read");
         for(var i=0;i<incompleteButtons.length;i++){
           console.log("but"+i);
           incompleteButtons[i].addEventListener('click',function(){incompleteAssignment(this.id)},false);
         }

         var delButtons=document.getElementsByClassName('deletebutton');
         for(var i=0;i<delButtons.length;i++){
           delButtons[i].addEventListener('click',function(){deleteAssignment(this.id)},false);
         }



         // adding keyup event for assignment field
         var assignmentfield=document.getElementById('aname');
         assignmentfield.addEventListener('keyup',function(){ isFilled();},false);

         //calling sortdeadline function to sort the list
         sortdeadlinelist();

   });
 }

function submitAssignment(id){
  completecard(id);
}

function deleteAssignment(id){
  chrome.storage.sync.remove(id,function(){})
  setTimeout(function(){ window.location.reload(); },500);
}

function incompleteAssignment(id){
  incompletecard(id);
}

// enabling submit button
function isFilled(){
  var i=document.getElementById('aname');
  if(i.value=="")
      document.getElementById("addsubmit").disabled=true;
  else
      document.getElementById("addsubmit").disabled=false;
}

// Function to generate random IDs for li items
function guidGenerator() {
    var S4 = function(){
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

//function to update the incompleted card
function completecard(key)
{
    chrome.storage.sync.get(null,function(assignments){
      var as=assignments[key];
      var presentDate = new Date();
      var submittedOn = presentDate.toString();
      update(as.courseName,as.assignmentName,as.deadline,"Submitted",submittedOn);
    })
    setTimeout(function(){ window.location.reload(); }, 500);
}


//function to update the completed card
function incompletecard(key)
{
    console.log("incompleting the card");
    chrome.storage.sync.get(null,function(assignments){
      var as=assignments[key];
      var submittedOn="Undefined";
      update(as.courseName,as.assignmentName,as.deadline,"Not Submitted",submittedOn);
    })
    setTimeout(function(){ window.location.reload(); }, 500);
}

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}


function validateForm() {
    var x = document.forms["formadd"]["assignmentname"].value;

    if (x == "") {
        //var result = confirm("Assignment Name is required");
        if(result)
        { console.log(document.getElementById("addform").style.display);
          document.getElementById("addform").style.display="inline-block";
          console.log("in this");
          return false;
        }


    }
    return true;
}



 //Sorting the assignments according to due date
 function sortdeadlinelist()
 {
  console.log("sortingg");
  var list, i , switching, b, shouldSwitch;
  list = document.getElementById("duecardlist");
  switching = true;
  while(switching)
  {
    switching = false;
    b = list.getElementsByTagName("LI");
    for(i=0; i<(b.length-1) ; i++)
    {
      shouldSwitch = false;
      console.log((b[i].getElementsByClassName("dd"))[0].innerHTML);
      if(  new Date((b[i].getElementsByClassName("dd"))[0].innerHTML) > new Date((b[i+1].getElementsByClassName("dd"))[0].innerHTML) ){
      shouldSwitch = true;
      break;

      }
    }
    if(shouldSwitch)
    { console.log((b[i].getElementsByClassName("dd"))[0].innerHTML + "and" + (b[i+1].getElementsByClassName("dd"))[0].innerHTML);
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;

    }

  }

}
