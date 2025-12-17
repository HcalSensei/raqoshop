import { config } from "../../utils";

export const routeRegister = new Array<any>();

export const routeDecorator = (router: any)=>{
    return (target: any, property:string)=>{
        target[property]= router;
        routeRegister.push(router);
    }
}

export function setRoutes(app: any){
    app.use('/api'+config.apiPath!, routeRegister);
}