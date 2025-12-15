import  Jwt  from "jsonwebtoken";
import { resolve } from "path";
import { config, cdg } from './';
export class JwtMiddleware{

    static addCorsHeaders(req: any, res: any, next: any){
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.setHeader('ross-Origin-Resource-Policy',  'cross-origin')
            

        next()
    }
    static checkToken(req: any, res: any, next: any){
        const authHeader = req.headers.authorization;

        if(authHeader) {
            const token = authHeader.split(' ')[1];
            Jwt.verify(token, config.jwt.secret!, (err:any, user:any)=>{
                if(err){
                    const errName = err.name;
                    let errLabel: string;
                    if(errName === 'TokenExpireError'){
                        errLabel = 'Votre session a expiré';
                    } else if (errName === 'JsonWebTokenError'){
                        errLabel = 'Signature du token invalide';
                    } else{
                        errLabel = err;
                    }
                    return cdg.api(
                        res,
                        new Promise((resolve)=>{
                            resolve({
                                status: 403,
                                message: 'error',
                                data: errLabel,
                            })
                        })
                    )
                }
                req.user = user;
                next();
            })
        }else{
            return cdg.api(
                res,
                new Promise((resolve)=>{
                    resolve({
                        status: 401,
                        message: 'error',
                        data: 'Accès non autorisée',
                    })
                })
            )
        }
    }

    static checkAuth(req: any, res: any,next :any){
        const authHeader = req.headers.authorization;
        
        if(authHeader){
            const token = authHeader.split(' ')[1];

            Jwt.verify(token, config.auth.secret!, (err:any, admin: any)=>{
                if (err) {
                    let errName = err.name;
                    let errLabel: string;
                    if (errName === 'TokenExpiredError') {
                      errLabel = 'Votre session a expiré';
                    } else if (errName === 'JsonWebTokenError') {
                      errLabel = 'Signature du token invalide';
                    } else {
                      errLabel = err;
                    }
                    return cdg.api(
                      res,
                      new Promise((resolve) => {
                        resolve({
                            error:true,
                            status: 403,
                            message: 'error',
                            data: errLabel,
                        });
                      })
                    );
                }
                req.admin = admin;
                next();
            })
        } else {
            return cdg.api(
                res,
                new Promise((resolve)=>{
                    resolve({
                        status: 401,
                        message: 'error',
                        data: 'Accès API non autorisée',
                    });
                })
            )
        }
    }

    static generateToken(data: {}){
        const accessToken = Jwt.sign(data, config.jwt.secret!,{
            expiresIn: '200m',
        });

        return{
            accessToken: accessToken
        }
    }

    static generateAccessToken(payloads:{ infinite: boolean }, data: {}){
        return new Promise((resolve, reject)=>{
                    // generate an access token - exp: Math.floor(Date.now() / 1000) + (60 * 60)
            const accessToken = Jwt.sign(data, config.auth.secret!, {
                expiresIn: payloads.infinite ? '200m' : '440m',
            });

            resolve(accessToken);
        }).catch((e)=>{
            cdg.konsole(e, 1);
            return { error: true, data: "Une erreur inconnue s'est produite" };  
        });
    }

    static generateAuthToken(payloads:{ infinite: boolean },data:{}){
        try {
            const accessToken = Jwt.sign(data, config.auth.secret!,{
                expiresIn: payloads.infinite ? '180m' : '240m',
            })
            return accessToken
        } catch (error) {
            cdg.konsole(error, 1);
            return { error: true, data: "Une erreur inconnue s'est produite" };  
        }
        
    }

    static verificationLevel(accessLevel: string, levelRequired: string){
        if (accessLevel===levelRequired) {
            return true
        }
        return false
    }

    static generateRefreshToken(data: {}) { }
}