import jwt from 'jsonwebtoken';

// Middleware untuk verifikasi Access Token
const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({
            status_code: 401,
            message: "Access token missing or invalid"
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status_code: 403,
                message: "Invalid or expired access token"
            });
        }

        req.user = user; // Attach decoded user to the request
        next(); // Continue to the next middleware or route handler
    });
};

// Middleware untuk verifikasi Refresh Token
const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken; // Ambil refresh token dari cookie

    if (!refreshToken) {
        return res.status(401).json({
            status_code: 401,
            message: "Refresh token missing or invalid"
        });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                status_code: 403,
                message: "Invalid or expired refresh token"
            });
        }

        req.user = user; // Attach decoded user to the request
        next(); // Continue to the next middleware or route handler
    });
};


export { verifyAccessToken, verifyRefreshToken };