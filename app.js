const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const app = express();

mongoose.connect('mongodb://recipes:recipes19@ds213183.mlab.com:13183/land')
.then(() => {
    console.log('Server successfully connected to Mlab!')
})
.catch(
    (err) => {
        console.log('Server unable to connect to Mlab');
        console.log(err);
    }
);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(bodyParser.json());

// Posts a recipe to database
  app.post('/api/recipes', (req, res, next) => {
      const recipe = new Recipe({
          title: req.body.title,
          ingredients: req.body.ingredients,
          instructions: req.body.instructions,
          time: req.body.time,
          difficulty: req.body.difficulty
      })
      recipe.save().then(
          () => {
              res.status(201).json({
                  message: 'Recipe saved successfully'
              });
          }
      )
      .catch(
          (err) => {
              res.status(400).json({
                  error: err
              });
          }
      );
  });

// Displays a single recipe 
  app.get('/api/recipes/:id', (req, res, next) => {
      Recipe.findById(
          req.params.id
      ).then(
          (recipe) => {
              res.status(201).json(recipe)
          }
      ).catch(
          (err) => {
              res.status(400).json({
                  error: err
              });
          }
      );
  });

// Updates a single recipe
  app.put('/api/recipes/:id', (req, res, next) => {
      const recipe = new Recipe({
          _id : req.params.id,
          title: req.body.title,
          ingredients: req.body.ingredients,
          instructions: req.body.instructions,
          time: req.body.time
      });
      Recipe.updateOne({_id: req.params.id}, recipe).then(
          () => {
              res.status(201).json({
                  message: 'Recipe updated successfully'
              })
          }
      ).catch(
          (err) => {
              res.status(400).json({
                  error: err
              });
          }
      );
  });

// Delete a single Recipe from database
  app.delete('/api/recipes/:id', (req, res, next) => {
      Recipe.deleteOne({_id: req.params.id}).then(
          () => {
              res.status(201).json({
                  message: 'Recipe deleted successfully'
              })
          }
      ).catch(
          (err) => {
              res.status(400).json({
                  error: err
              });
          }
      );
  });

//   Returns all Recipes from database
  app.get('/api/recipes', (req, res) => {
    Recipe.find().then(
        (recipes) => {
            res.status(201).json(recipes)
        }
    ).catch(
        (err) => {
            res.status(400).json({
                error: err
            });
        }
    );
  });



module.exports = app;