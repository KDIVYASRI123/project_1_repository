const express=require('express');
const app=express();
const axios=require('axios');
const port=3000;
const https = require('https');
const querystring = require('querystring');
const {initializeApp,cert}=require("firebase-admin/app");
const {getFirestore}=require("firebase-admin/firestore");
var serviceAccount=require("./key.json");
initializeApp({
credential:cert(serviceAccount),
});
const db=getFirestore();
app.set('view engine','ejs');
app.set('views', './views');
app.get('/',(req,res)=>{
//res.send("Hey,there Get login to refer about movies");
res.render("openpage");
});
app.get('/signin',(req,res)=>{
res.render("signin");
});
app.get('/dashboard',(req,res)=>{
    res.render("dashboard");
    });

    
  
    // Define a route to handle recipe searches
    function fetchRecipes(query, callback) {
        const queryParams = {
          q: query,
          app_id: '6ef076a6', // Replace with your Edamam app ID
          app_key: 'b52111c33d965f271511e2c577bf7eff', // Replace with your Edamam app key
        };
        const queryString = querystring.stringify(queryParams);
        const url = `https://api.edamam.com/search?${queryString}`;//https://api.edamam.com/search?
        
        https.get(url, (response) => {
          if (response.statusCode === 308) {
            const redirectUrl = response.headers.location;
            // Follow the redirect to the new URL
            http.get(redirectUrl, (redirectResponse) => {
          let body = '';
          response.on('data', (chunk) => {
            body += chunk;
        });
        redirectResponse.on('end', () => {
          const recipes = JSON.parse(body).hits.map(hit => ({
              label: hit.recipe.label,
              image: hit.recipe.image,
              url: hit.recipe.url,
          }));
          callback(null, recipes);
      });
  }).on('error', (error) => {
      callback(error, null);
  });
} else {
  let body = '';
  response.on('data', (chunk) => {
      body += chunk;
  });
  
        response.on('end', () => {
            if (response.statusCode !== 200) {
                console.error(`Failed to fetch recipes. Status code: ${response.statusCode}`);
                console.error('Response body:', body);
                callback(new Error(`Failed to fetch recipes. Status code: ${response.statusCode}`), null);
                return;
            }
           


            const recipes = JSON.parse(body).hits.map(hit => ({
                label: hit.recipe.label,
                image: hit.recipe.image,
                url: hit.recipe.url,
            }));
            
            callback(null, recipes);
          });
        }
        }).on('error', (error) => {
          callback(error, null);
        });
      
    }
      
      // Define a route to handle recipe search requests
      app.get('/recipeName', (req, res) => {
        const query = req.query.q;
        fetchRecipes(query, (error, recipes) => {
          if (error) {
            console.error('Error fetching recipes:', error);
            res.status(500).json({ error: 'An error occurred while fetching recipes' });
            

          } 
          else {
            res.render('dashboardInfo', { recipes, query });;//json(recipes);
          }
        });
      });
      




app.get('/signinsubmit',(req,res)=>{
const email=req.query.email;
const password=req.query.password;
db.collection('users')
.where("email","=",email)
.where("password","=",password)
.get()
.then((docs)=>{
//console.log(docs);
if(docs.size>0){
var usersdata=[];
db.collection("users").get().then((docs)=>{
docs.forEach((doc)=>{
usersdata.push(doc.data());
});
})
//res.send("Login successful");
.then(()=>{    
console.log(usersdata);
//res.render("page",{userData:usersdata});
res.render("dashboard");
});
}
else{
res.send("Login failed");
}
});
});

app.get("/signup",(req,res)=>{
res.render("signup");
});
app.get('/signupsubmit',(req,res)=>{
const fullname=req.query.fullname;
const lastname=req.query.lastname;
const email=req.query.email;
const password=req.query.password;
db.collection("users").add({
name:fullname+lastname,
email:email,
password:password,
})
.then(()=>{
res.render("signedup");
});
});
app.listen(port,()=>{
console.log('Example app listening on port 3000');
});
