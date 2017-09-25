const express = require('express')
const app = express()

app.use('/webpage', express.static(__dirname + '/webpage'))
app.use('/webpage', express.static(__dirname + '/webpage'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/webpage/templates/index.html')
})

// Require our other routes into the application.
require('./server/routes')(app)

app.listen(3000, function () {
  console.log('Beaker Visualzation application listening on port 3000')
  console.log('Redirect from port 80 to port 3000 must be established.')
})
