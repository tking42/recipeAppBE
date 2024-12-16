const mysql = require("promise-mysql")

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'recipes'
})

const getRecipesRoute = async (req, res) => {
    const db = await connection
    const recipes = await db.query('SELECT * FROM `recipes` WHERE `id` < 100')
    res.json(recipes)
}

const getFormResultsRoute = async (req, res) => {
    const db = await connection;
    const { ingredient1, ingredient2, ingredient3, ingredient4, ingredient5 } = req.query

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
    res.json({
        results
    })
}

module.exports = {getFormResultsRoute, getRecipesRoute}