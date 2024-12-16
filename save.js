const mysql = require("promise-mysql")
const {query} = require("express");

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'recipes'
})

const saveRoute = async (req, res) => {
    const {user_id, recipe_id } = req.body
    const db = await connection
    const saveRecipe = await db.query('INSERT INTO `user_recipes` (recipe_id, user_id) VALUES (?, ?)', [recipe_id, user_id])
    res.json({
        message: 'Recipe saved successfully.',
        saveRecipe
    })
}

const removeRoute = async (req, res) => {
    const {user_id, recipe_id } = req.body
    const db = await connection
    const removeRecipe = await db.query('DELETE FROM user_recipes WHERE recipe_id = ? AND user_id = ?', [recipe_id, user_id])
    res.json({
        message: 'Recipe removed successfully.',
        removeRecipe
    })
}

const getSavedRecipesRoute = async (req, res) => {
    const { user_id } = req.query;
    const db = await connection;
    const getSavedRecipesId = await db.query('SELECT * FROM `user_recipes` WHERE `user_id` = ?', [user_id])
    const savedRecipes = await Promise.all(getSavedRecipesId.map(async (userRecipe) => {
        const recipe_id = userRecipe.recipe_id;
        const recipe = await db.query('SELECT * FROM `recipes` WHERE `id` = ?', [recipe_id])
        return recipe[0]
    }))

    res.json({
        message: 'Successfully retrieved saved recipes.',
        savedRecipes
    })
}


module.exports = {saveRoute, getSavedRecipesRoute, removeRoute}