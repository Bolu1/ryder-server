const db = require("../config/connectold");

function notify(user, message, type, tag) {
  try {
    const data = {
      user: user,
      message: message,
      type: type,
      tag: tag
    };

    const sql = `INSERT INTO notifications SET ?`;
    db.query(sql, data, (error, result) => {
      if (error) {
        return
      } else {
        return;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

export default notify;
