const db = require("../config/connect")

const adb = db.promise();

function logger(user, message, tag=0){
    try{
        const payload = {
            user: user.id,
            organization_id: user.organizationId? user.organizationId : user.id,
            message: message,
            tag: tag
        }
        const sql = `INSERT INTO logs SET ?`
        adb.query(sql, payload)
        
    }catch(error){
        console.log(error)
    }
}

export default logger