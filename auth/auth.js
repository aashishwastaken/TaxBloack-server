const jwt = require('jsonwebtoken');

let auth = async (req, res, next) => {
    try {
        let token = req.header('Authorization');
        // console.log(token);
        if (!token) {
            return res.status(401)
                .json({ success: false, message: 'No auth token found' });
        }
        token = token.slice(7);
        
        jwt.verify(token, process.env.JWTSecret, (err, decoded) => {
            // console.log('token',err,decoded);
            if (err) {
                return res.status(401)
                    .json({ success: false, message: 'Token expired' });
            }
            if(decoded){
                req.user = decoded;
            }
        });
    } catch (err) {
        return res.status(500)
            .json({ success: false, message: err.message })
    }

    next();
}

module.exports = auth;