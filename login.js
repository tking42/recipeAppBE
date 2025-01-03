const mysql = require("promise-mysql")
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'recipes'
})
function isEmail(email) {
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return email.trim().match(emailFormat);
}

function isValidPassword(password) {
    const passwordFormat = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return password.trim().match(passwordFormat);
}

const registerRoute = async (req, res) => {
    const { emailReg, passwordReg, confirmEmailReg, confirmPasswordReg, firstName, lastName } = req.body
    const db = await connection

    const emailValid = isEmail(emailReg);
    const passwordValid = isValidPassword(passwordReg)
    if (emailReg === confirmEmailReg && passwordReg === confirmPasswordReg) {
        if (emailValid && passwordValid) {
            await db.query('INSERT INTO `users` (email, password, firstName, lastName) VALUES (?, ?, ?, ?)', [emailReg, passwordReg, firstName, lastName]);
            return res.status(200).send({ message: 'User registered successfully'});
        }
        if (!emailValid) {
            return res.status(401).send({ message: 'Invalid Email', type: 'error' });
        }

        if (!passwordValid) {
            return res.status(401).send({ message: 'Invalid Password - requires capital letter, number, special character and 8 or more characters.', type: 'error'  });
        }
    } else if (emailReg !== confirmEmailReg && passwordReg === confirmPasswordReg) {
        return res.status(401).send({ message: 'Email does not match', type: 'error'  });
    } else if (emailReg === confirmEmailReg && passwordReg !== confirmPasswordReg) {
        return res.status(401).send({ message: 'Password does not match', type: 'error'  });
    } else if (emailReg !== confirmEmailReg && passwordReg !== confirmPasswordReg) {
        return res.status(401).send({ message: 'Password or Email does not match', type: 'error' });
    }
}

const loginRoute = async (req, res) => {
    const { email, password } = req.body;
    const db = await connection;
    const result = await db.query('SELECT * FROM `users` WHERE `email` = ?', [email]);
    if (result.length === 0) {
        return res.status(401).send({message: 'Incorrect Email or Password', type: 'error' });
    }
    const user = result[0]
    if (password === user.password) {
        res.status(200).send(user)
    } else {
        res.status(401).send({message: 'Incorrect Email or Password', type: 'error'});
    }
}

module.exports = {loginRoute, registerRoute}