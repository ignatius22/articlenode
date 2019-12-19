const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars')
const bodyparser = require('body-parser');
const path = require('path')




mongoose.connect('mongodb://localhost/articles',{ useNewUrlParser: true })

let db = mongoose.connection;
db.once('open',()=>{
    console.log('connected to Database')
})
db.on('error',(err)=>{
    console.log(err)
})


const app = express();

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const Article = require('./models/article')
app.get('/articles',(req,res)=>{
    Article.find({},(err, articles)=>{
        if(err){
            console.log(err)
        }else{
            res.render('home',{
                title:"Articles",
                articles
            }); 
        }
    });  
});
app.get('/',(req,res)=>{
    res.render('landing',{
       title:"Post an article",
       description:"get creative with awesome article"
    
    })
})



app.get('/articles/add',(req,res)=>{
    res.render('add_articles',{
        title:"Add an Article"
    })
})
app.post('/articles/add',(req,res)=>{
    let article = new Article();
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body


    article.save((err)=>{
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/articles');
        }
    })
})

app.get('/article/:id',(req,res)=>{
    Article.findById(req.params.id,(err,article)=>{
        res.render('article',{
            article:article,
            title:"Article"
        })
        

    })   
});



app.get('/edit/:id',(req,res)=>{
    Article.findById(req.params.id,(err,article)=>{
        res.render('edit',{
            article:article,
            title:"Edit Article"
        })
        

    })   
});

//update article


app.post('articles/edit/:id',(req,res,next)=>{
    Article.findByIdAndUpdate(req.params.id, req.body,(err,item)=>{
      if(err) return next(err);
      res.render('/articles');
    })
  });



app.use(express.static(path.join(__dirname, 'public')))
const port = process.env.PORT || 3000;
app.listen(port,()=>{console.log(`now connected to the server on super port ${port}`)});