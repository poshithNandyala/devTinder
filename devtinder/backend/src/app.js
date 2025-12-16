// import http from 'http'

// const server = http.createServer((req, res) => {
//     console.log("server is running");
//     res.end("Hello World")
// })

// server.listen(3000, () => {
//     console.log("Server is listening on port 3000");
// })


// http.createServer((req, res) => {
//   if (req.url === '/') {
//     res.end('Home Page');
//   } else if (req.url === '/about') {
//     res.end('About Page');
//   } else {
//     res.end('404 Not Found');
//   }
// }).listen(3000);

import express from 'express'

const app = express();
const PORT = 3000;



app.use("/home", (req, res) => {
    res.send("hi from home")
    console.log("home page is running")
})

app.use("/about", (req, res) => {
    res.send("hi from about")
    console.log("about page is running")
})
app.use("/", (req, res) => {
    res.send("Hellooooo World");
    console.log("server is running");
})
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})
