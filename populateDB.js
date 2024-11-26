const mysql = require('promise-mysql');
const fs = require('fs');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'recipes'
})

const recipesObject = JSON.parse(fs.readFileSync('./public/assets/recipes.json', 'utf-8'))
const recipes = Object.values(recipesObject)

const insertData = async () => {
    const db = await connection;

    for (const recipe of recipes) {
        if (Array.isArray(recipe.ingredients)) {
            const ingredients = recipe.ingredients.join('#')
            const query = `INSERT INTO recipes (title, ingredients, instructions, picture_link)
                           VALUES (?, ?, ?, ?)`
            await db.query(query, [recipe.title, ingredients, recipe.instructions, recipe.picture_link])
        }
    }
    console.log('Data inserted successfully!')
}

insertData()
