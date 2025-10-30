const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req, res) => {
    try {
        let receivedJwt = req.headers["authorization"];
        console.log(receivedJwt)
        if (receivedJwt) {
            let decodedJWT = jwt.verify(receivedJwt, process.env.PRIVATE_kEY);
            console.log(decodedJWT);

            return decodedJWT;
        } else {
            throw new ReferenceError("jwt muse be provided");
        }
    } catch (err) {
        console.log(err.name + " : " + err.message);

        return err;
    }
}

module.exports = ensureAuthorization;