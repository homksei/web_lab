var express = require("express");
var session = require('express-session');

var bodyParser = require("body-parser");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectID;

var app = express();
var jsonParser = bodyParser.json();
var url = "mongodb://localhost:27017/newdb";

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var sess;
var milo;

app.get('/reg',function(req,res){
sess = req.session;
res.render('forma.html');
});

app.post('/login',function(req,res){
  sess = req.session;
  sess.email=req.body.email;
  res.end('done');
});

app.get('/logout',function(req,res){
req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/reg');
  }
});
});
 
app.use(express.static(__dirname + "/views"));

app.set("view engine", "hbs");

app.get("/", function(request, response)
{
     
    response.render("index.hbs", {
             Question1_1: "Столица Роcсии ?",
                    Answer1_1: "Гаага",
                    Answer2_1: "Нижний Новгород",
                    Answer3_1: "Москва",
                    Answer4_1: "Дзержинск",
            Question2_2: "Что я кушал сегодня утром ?",
                    Answer1_2: "Котлетки с пюрешкой",
                    Answer2_2: "Чёрную икру",
                    Answer3_2: "Кофе и круассан",
                    Answer4_2: "Заточил в одного батон колбасы",
            Question3_3: "Что я делал вчера ?",
                    Answer1_3: "Пиццу",
                    Answer2_3: "Ремонтировал свою Tesla",
                    Answer3_3: "Готовил лабу",
                    Answer4_3: "Спал",

                    
                    loogiin: sess.email,            
    });
});





app.get("/api/qans", function(req, res){
         var milo = sess.email;
    mongoClient.connect(url, function(err, db){
        db.collection("qans").find({ adi : milo }).toArray(function(err, qans){
            res.send(qans)
            db.close();
        });
    });
});

app.get("/api/qans/:id", function(req, res){
      
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("qans").findOne({_id: id}, function(err, qan){
             
            if(err) return res.status(400).send();
             
            res.send(qan);
            db.close();
        });
    });
});
 
app.post("/api/qans", jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
    var myAnswer1 = req.body.Answer1;
    var myAnswer2 = req.body.Answer2;
    var myAnswer3 = req.body.Answer3;
    var userAdi = req.body.adi;

    var qan = {Answer1: myAnswer1, Answer2: myAnswer2, Answer3: myAnswer3, adi: userAdi};
     
    mongoClient.connect(url, function(err, db){
        db.collection("qans").insertOne(qan, function(err, result){
             
            if(err) return res.status(400).send();
             
            res.send(qan);
            db.close();
        });
    });
});
  
app.delete("/api/qans/:id", function(req, res){
      
    var id = new objectId(req.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("qans").findOneAndDelete({_id: id}, function(err, result){
             
            if(err) return res.status(400).send();
             
            var qan = result.value;
            res.send(qan);
            db.close();
        });
    });
});
 

app.listen(3000, function(){
    console.log("Сервер запущен...");
});
