// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const sendSms = (message)=>{
    try{
    client.messages
    .create({
       body: message,
       from: '+13867031553',
       to: '+2348105551713'
     })
    .then(message => console.log(message.sid))
    }catch(error){
        console.log(error)
    }
}

const checkUserStatus = (state) =>{


}

export {sendSms, checkUserStatus}