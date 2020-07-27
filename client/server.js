const express = require('express')
const _next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const next = _next({ dev })
const handle = next.getRequestHandler()

const { healthz } = require('express-healthz');

if (!process.env.STRIPE_KEY) {
    throw new Error('STRIPE_KEY must be defined');
}

const app = express()
app.use(healthz);


next.prepare().then(() => {

    app.all('*', (req, res) => {
        return handle(req, res)
    })

    app.listen(port, (err) => {
        if (err) throw err
        console.log(`Client ready on http://localhost:${port}`)
    })
})