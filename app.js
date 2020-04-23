const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
 

const app = express();

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, "public/form.html"));
})

app.listen(3000,function() {
console.log('server is started on port 3000');
})