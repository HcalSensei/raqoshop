import Express, {Response, NextFunction} from 'express'
import { mysqlHelper } from './db'
import { config } from '../utils'
import { setRoutes } from './router'
import helmet from 'helmet'
import cors from 'cors'



const app:any = Express()

export class Server{
    app:any
    constructor(){
        this.app = app
        this.app.use(helmet())
        this.app.use(cors())
        this.app.use(Express.urlencoded({extended: true}))
        this.app.use(Express.json())
        this.app.use(Express.static('data/uploads'))
    }

    handle400(){
        this.app.use((err:any, res: Response, next: NextFunction)=>{
            if(err && err.status === 400 && 'body' in err)
                return res.status(400).json({error: true, message: "Mauvaise requête", data: null})
            next()
        })
        return this
    }
    handle404(){
        this.app.use((_err:any, res:Response)=>{
            return res.status(404).json({error: true, message: "route introuvable ou inexistante", data: null})
        })
        return this
    }
    setRoutes(){
        setRoutes(this.app)
        return this
    }
    startServer(){
        this.app.listen(config.serverport, ()=>{
            console.log(`server is running on: ${config.serverhost}:${config.serverport}`);
            mysqlHelper.getInstance();
            
        })
    }
}