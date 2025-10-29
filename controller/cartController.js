const jwt = require('jsonwebtoken')
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const dotenv = require('dotenv');
dotenv.config();

const addToCart = (req, res) => {
    const { book_id, quantity } = req.body;

    let authorization = ensureAuthorization(req);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 세션이 만료되어 재로그인이 필요합니다"
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "잘못된 토큰 입니다."
        });
    } else {
        let sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)";
        let values = [book_id, quantity, authorization.id]
        conn.query(sql, values,
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                return res.status(StatusCodes.CREATED).json(results);
            })
    }
};

const getCartItems = (req, res) => {
    const { selected } = req.body;

    let authorization = ensureAuthorization(req);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 세션이 만료되어 재로그인이 필요합니다"
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "잘못된 토큰 입니다."
        });
    } else {
        let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems LEFT JOIN books 
                ON cartItems.book_id = books.id
                WHERE user_id = ? AND cartItems.id IN (?)`;
        let values = [authorization.id, selected];
        conn.query(sql, values,
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                return res.status(StatusCodes.CREATED).json(results);
            })
    }
};

const removeCartItem = (req, res) => {
    const id = req.params.id;

    let sql = "DELETE FROM cartItems WHERE id = ?";
    conn.query(sql, id,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.CREATED).json(results);
        })
};

function ensureAuthorization(req) {
    try {
        let receivedJwt = req.headers["authorization"];
        console.log(receivedJwt)

        let decodedJWT = jwt.verify(receivedJwt, process.env.PRIVATE_kEY);
        console.log(decodedJWT);

        return decodedJWT;
    } catch (err) {
        console.log(err.name + " : " + err.message);

        return err;
    }
}

module.exports = { addToCart, getCartItems, removeCartItem };