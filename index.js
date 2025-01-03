const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', async (request, response) => {
    response.send('running')
})
const {getRecipesRoute, getFormResultsRoute} = require('./ingredient')

app.get('/getFormResults', getFormResultsRoute)
app.get('/getRecipes', getRecipesRoute)

const { loginRoute, registerRoute } = require('./login')

app.post('/login', loginRoute)
app.post('/register', registerRoute)

const {saveRoute, getSavedRecipesRoute, removeRoute} = require('./save')

app.post('/saveRecipe', saveRoute)
app.post('/removeRecipe', removeRoute)
app.get('/getSavedRecipes', getSavedRecipesRoute)

const {searchRoute} = require('./search')
app.post('/search', searchRoute)
app.listen(3002, () => {
    console.log('Server is running on port 3002');
})
