var a= document.getElementsByClassName('cell c0');
var b= document.getElementsByClassName('cell c1 lastcol');
var deadline="Undefined";
var courseName="Undefined";
var status="Not Submitted";
var submittedOn="Undefined";
var assignmentName="Undefined";

// Finding Deadline of the assignement
for (var i=0;i<a.length;i++)
{
  //console.log(a[i].innerText);
  if(a[i].innerText=="Submission status")
  {
    if(b[i].innerText=="Submitted for grading")
      status="Submitted";
  }
  if(a[i].innerText=="Last modified")
  {
    if(status=="Submitted")
      submittedOn=b[i].innerHTML;
  }
  if(a[i].innerText=="Due date")
  {
    deadline=b[i].innerHTML;
  }
}

// Finding the name of the course
var aTag=document.querySelectorAll('[itemprop="url"]')[1];
courseName=aTag.getAttribute("title");
console.log(courseName);
/*
var aTag=document.getElementsByTagName('a');
var tempCounter=0;
for(var i=0;i<aTag.length;i++)
{
  if(aTag[i].getAttribute("itemprop")=="url" && tempCounter==1)
  {
    courseName=aTag[i].getAttribute("title");
    break;
  }
  else if(aTag[i].getAttribute("itemprop")=="url")
  {
    tempCounter=tempCounter+1;
  }
}
*/
// finding assignment name
assignmentName=document.querySelectorAll('[itemprop="title"]')[3].innerText;
console.log(assignmentName);




/*
$.getScript("assignmentAdded.js", function() {

   alert("Script loaded but not necessarily executed.");
});
*/

function updateRecord(key,courseName,assignmentName,deadline,status,submittedOn)
{
  var obj={};
  obj[key]={"courseName":courseName,"name":assignmentName,"deadline":deadline,"status":status,"submittedOn":submittedOn};
  chrome.storage.sync.set(obj,function(){
    alert("record updated");
  })

}

// confirming if the current page is of assignment submission
if (deadline!="Undefined"){

  // Checking whether assignment already exists in storage and adding only new assignments
  var assignmentExists=false;
  chrome.storage.sync.get(null,function(data){

    for (key in data)
    {
      var as=data[key];
      if(key!="counter")
      {
        var storedDeadline=new Date(as.deadline);
        var scrapedDeadline=new Date(deadline);
        //console.log(storedDeadline.getTime()+" "+scrapedDeadline.getTime());
        // If record already exists then check cif status has changed from last time and update if required
        if(as.courseName===courseName && storedDeadline.getTime()===scrapedDeadline.getTime() && assignmentName==as.name)
        {
          console.log("yes the assignment already exists");
          assignmentExists=true;
          if(status!=as.status)
            updateRecord(key,courseName,assignmentName,deadline,status,submittedOn);
        }

      }
    }

    if(assignmentExists==false)
    {
      //console.log(assignementExists+"assignementExists");
      chrome.storage.sync.get({"counter":0},function(data){
        if(data.counter==0)
        {
            chrome.storage.sync.set({'counter':1},function(){
            //console.log("counting started");
            });
        }
        else {
            chrome.storage.sync.set({'counter':data.counter+1},function(){
            //console.log("count increased");
            });
        }
      });
      var newkey='Assignment'+Date.now();
      alert(deadline);
      updateRecord(newkey,courseName,assignmentName,deadline,status,submittedOn);
      /*
      var obj={};
      obj[newkey]={"courseName":courseName,"name":assignmentName,"deadline":deadline,"status":status,"submittedOn":submittedOn};
      chrome.storage.sync.set(obj,function(){
        alert("added");

      })
        */
    }
  });

}


//chrome.runtime.sendMessage(deadline);
//chrome.runtime.sendMessage("hello");
