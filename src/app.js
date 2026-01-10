import express from 'express'
import authRoute from "./routes/auth.route.js"
import classRoute from './routes/class.route.js'

const app = express();


app.use(express.json());
app.use('/auth' , authRoute);
app.use('/class' , classRoute);


app.get("/" , (req ,res) => {
    res.send("API is live");
} )

export default app