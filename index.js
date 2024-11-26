const express = require('express')
const app = express()
const mysql = require('promise-mysql')
const cors = require('cors')
app.use(cors());
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'recipes'
})

app.get('/', async (request, response) => {
    response.send('running');
})

app.get('/getRecipes', async (request, response) => {
    const db = await connection;
    const recipes = await db.query('SELECT * FROM `recipes` WHERE `id` < 100')
    response.json(recipes)
})

app.get('/getFormResults', async (request, response) => {
    const db = await connection;
    const { ingredient1, ingredient2, ingredient3, ingredient4, ingredient5 } = request.query

    const params = [
        `%${ingredient1}%`,
        `%${ingredient2}%`,
        `%${ingredient3}%`,
        `%${ingredient4}%`,
        `%${ingredient5}%`
    ]

    const ingredientMatch = () => {
       return `
        SELECT *, 
        (
            (CASE WHEN \`ingredients\` LIKE ? THEN 1 ELSE 0 END) +
            (CASE WHEN \`ingredients\` LIKE ? THEN 1 ELSE 0 END) +
            (CASE WHEN \`ingredients\` LIKE ? THEN 1 ELSE 0 END) +
            (CASE WHEN \`ingredients\` LIKE ? THEN 1 ELSE 0 END) +
            (CASE WHEN \`ingredients\` LIKE ? THEN 1 ELSE 0 END)
        ) AS ingredient_match_count
        FROM \`recipes\`
        HAVING ingredient_match_count >= 3
    `
    }

    const results = await db.query(ingredientMatch(), params)

    response.json({
        results
    })
})

app.listen(3002, () => {
    console.log('Server is running on port 3002');
})
