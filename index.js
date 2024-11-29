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
    response.send('running')
})

app.get('/getRecipes', async (request, response) => {
    const db = await connection
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

app.post('/register', async (req, res) => {
    const { emailReg, passwordReg } = req.body;
    const db = await connection;

    try {
        await db.query('INSERT INTO `users` (email, password) VALUES (?, ?)', [emailReg, passwordReg]);
        res.status(200).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        const db = await connection;
        const result = await db.query('SELECT * FROM `users` WHERE `email` = ?', [email]);
        if (result.length === 0) {
            return res.status(401).send({ errorMessage: 'Wrong Email or Password.' });
        }
        const user = result[0]
        if (password === user.password) {
            res.status(200).send(user)
        } else {
            res.status(401).send({ errorMessage: 'Wrong Email or Password.' });
        }
})

app.listen(3002, () => {
    console.log('Server is running on port 3002');
})
