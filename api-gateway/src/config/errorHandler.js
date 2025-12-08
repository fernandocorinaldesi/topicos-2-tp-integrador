exports.errorHandler = (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    
    if (req.app.get('env') === 'development') {
        res.locals.error = err
        
        if (err.statusCode == 500)
            console.log(err)
    }
    else {
        res.locals.error = {}
    }

    const data = err.data

    // render the error page
    res.status(err.statusCode || 500).json({
        mensaje: err.message,
        data: data
    })
}