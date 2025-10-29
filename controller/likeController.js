const jwt = require('jsonwebtoken')
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const dotenv = require('dotenv');
dotenv.config();

const addLike = (req, res) => {
    const book_id = req.params.id;

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
        let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
        let values = [authorization.id, book_id]
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

const removeLike = (req, res) => {
    const book_id = req.params.id;

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
        let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
        let values = [authorization.id, book_id]
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

module.exports = {
    addLike, removeLike
};