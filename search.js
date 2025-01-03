const mysql = require("promise-mysql");
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'recipes'
});

const searchRoute = async (req, res) => {
    const { searchInput } = req.body;
    const db = await connection;

    const searchResults = await db.query('SELECT * FROM `recipes` WHERE `title` LIKE ?', [`%${searchInput}%`]);
    res.json({message: 'Successfully retried recipes for search', searchResults})
};

module.exports = { searchRoute };
