const app = require ('./app')
import colors from 'colors'
const logger = require('./utils/logger')


const PORT = process.env.PORT|| 8080

app.listen(PORT, ()=>{
    
    logger.info(colors.random(`Application Listening at http://localhost:${PORT}`))
})
