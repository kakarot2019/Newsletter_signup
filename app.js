/*jshint esconversion: 6*/

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //used to make a "public" folder to make a referance to css and images files

/*we atre using process.env.PORT or 3000 to let heroku decide and assign any random PORT number to us 
    or else choose 3000 by default*/
app.listen(process.env.PORT || 3000, function(){       
    console.log("server running!!!");
});

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/" , function(req,res){
    const fname = req.body.first;
    const lname = req.body.second;
    const email = req.body.email;
    /* we are making a JSobject called "data" to organize data to send as a GET request to the mailchimp server
        these keys are fixed and can be seen using API referance on Mailchimp developer  */
    var data ={                                 
        members:[                               
            {
                email_address: email,
                status: "subscribed",
                /*the merge fields key can be seen on audience tab of  mailchimp and are also fixed 
                        i.e, FNAME for first name, LNAME for last name,etc */
                merge_fields:{          
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);      // WE CONVERTED OBJECT INTO STRING TO SEND IT TO MAILCHIMP SERVER 
    const url = "https://us1.api.mailchimp.com/3.0/lists/1358d986cd";   //this is mailchimp API endpoint including my list id at the last
    var options={
        method : "POST",
        auth: "aditya:a0ced22e910e4f9a2418d66564e87988-us1"
    };
    /*we are making a http.request method to make POST request to the server and save it in a const to send "POST" data
    whenever we want and send jsondata along with it as seen in the bottom*  */
    const request = https.request(url , options  , function(response){  
        if(response.statusCode===200)                    //if the "response" of the server on sending our data is 200(i.e, success) then do this...
            res.sendFile(__dirname + "/success.html");
        else                                             //else do this..(someerror occured)
            res.sendFile(__dirname + "/failure.html");
        
        /*below line basically says do these following things "ON" getting any "data" 
            as "RESPONSE" from the mailchimp server when sent POST request to its mailchimp server */
        response.on("data" , function(data){        
            console.log(JSON.parse(data));
        })
    })

    /*now we will send all the details we got from the form 
        after stringfy it as jsonData to the server using "request" variable we made to actions to be done 
            after POST request is made to the server and hence using .write() and .end() to end sending data to the server.*/
    request.write(jsonData);         
    request.end();                  
})

/*when we click "Try again" button on failure.html , it makes a "POST" request 
    which will trigger this function and ask it to rediret itto the main signup.htl page i.e, home route*/
app.post("/failure" , function(req, res){       
    res.redirect("/");
})

/*
API key:
a0ced22e910e4f9a2418d66564e87988-us1

uniqueid:
1358d986cd
*/