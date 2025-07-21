module.exports = async (req, res) => {
    console.log('🏥 Health check endpoint called');

    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        method: req.method,
        url: req.url,
        headers: req.headers,
    });
};
