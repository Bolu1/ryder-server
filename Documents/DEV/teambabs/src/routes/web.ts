import express from 'express'

const routes = express()

routes.get('/', (req,res)=>{
    res.send("Welcome")
})

module.exports = routes