let express = require('express')
let app = express() 
let router = express.Router() 
let pieRepo = require('./repos/pieRepo')
const port = 8080
let errorHelpers = require('./helpers/errorHelpers')
let cors = require('cors')

app.use(express.json())

// Configure CORS
//app.use(cors)

router.get('/search', function (req, res, next) {
  let searchObject = {
    "id": req.query.id,
    "name": req.query.name
  }
  pieRepo.search(searchObject, function (data) {
    res.status(200).json({
      "status": 200,
      "statusText" : "OK",
      "message": "All pies retrieved",
      "data": data   
    })
  }, function (err) {
      next(err)
  })
})

router.get('/', function (req, res, next) {
  pieRepo.get(function (data) {
    res.status(200).json({
      "status": 200,
      "statusText": "OK",
      "message": "All pies retrieved.",
      "data": data 
    })
  }, function(err) {
        next(err) 
  })
})

router.get('/:id', function (req, res, next) {
  pieRepo.getById(req.params.id, function (data) {
    if (data) {
      res.status(200).json({
        "status": 200,
        "statusText": "OK", 
        "message": "Single pie retrieved.",
        "data": data 
      }) 
    } else { 
      res.status(404).json({ 
        "status": 404, 
        "statusText": "Not Found",
        "message": "The pie '" + req.params.id + "' could not be found.",
        "error": {
          "code": NOT_FOUND,
          "message": "The pie '" + req.params.id + "' could not be found."
        }
      })
    }
  }, function(err) {
    next(err)
  })
})

router.post('/', function (req, res, next) {
  pieRepo.insert(req.body, function(data) {
    res.status(201).json({
      "status": 201,
      "statusText": "Created",
      "message": "New pie added",
      "data": data    
    })
  }, function (err) {
    next(err)
  })
})  

router.put('/:id', function (req, res, next) {
  pieRepo.getById(req.params.id, function (data) {
    if (data) {
      pieRepo.update(req.body, req.params.id, function (data) {
        res.status(200).json({
          "status": 200,
          "statusText": "OK",
          "message": `Pie ${req.params.id} updated.`,
          "data": data  
        })
      })
    } else {
      res.status(404).json({
        "status": 404,
        "statusText": "Not found",
        "message": `Pie ${req.params.id} was not found.`,
        "error": {
          "code": "NOT_FOUND",
          "message": `Pie ${req.params.id} was not found.`
        }
      })
    }
  }, function (err) {
    next(err)
  })
})

router.delete('/:id', function (req, res, next) {
  pieRepo.getById(req.params.id, function (data) {
    if (data) {
      pieRepo.delete(req.params.id, function (data) {
        res.status(200).json({
          "status": 200,
          "statusText": "OK",
          "message": `Pie ${req.params.id} was deleted.`,
          "data": `Pie ${req.params.id} was deleted.`
        })
      })
    } else {
      res.status(404).json({
        "status": 404,
        "statusText": "Not found",
        "message": `Pie ${req.params.id} not found.`,
        "error": {
          "code": "NOT_FOUND",
          "message": `Pie ${req.params.id} not found.`
        }
      })
    }
  }, function (err) {
      next(err)
  })
})    

router.patch('/:id', function (req, res, next) {
  pieRepo.getById(req.params.id, function (data) {
    if (data) {
      pieRepo.update(req.body, req.params.id, function (data) {
        res.status(200).json({
          "status": 200,
          "statusText": "K",
          "message": `Pie ${req.params.id} patched.`,
          "data": data  
        })
      })
    } else {
      res.status(404).json({
        "status": 404,
        "statusText": "Not found",
        "message": `Pie ${req.params.id} was not found.`,
        "error": {
          "code": "NOT_FOUND",
          "message": `Pie ${req.params.id} was not found.`
        }
      })
    }
  }, function (err) {
    next(err)
  })
})    

app.use('/api/', router)

// Configure exception logger to console.error
app.use(errorHelpers.logErrorsToConsole)

// Configure client error handler
app.use(errorHelpers.clientErrorHandler)

// Configure catch-all exception middleware last
app.use(errorHelpers.errorHandler)

var server = app.listen(port, function() {
    console.log(`Node server is running on http://localhost:${port}`)
}) 