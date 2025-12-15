import { validationResult } from 'express-validator';
import { cdg } from './coddyger';

export class ValidatorMiddleware{

    static validate(req: any, res: any, next: any) {
        const errors:any = validationResult(req);
        if (!errors.isEmpty()) {
            return cdg.api(res, new Promise(resolve =>{
                resolve({
                    status: 422,
                    message: errors.errors[0].msg,
                    data: errors,
                });
            }));
        }else{
            next();
        }
    }
    
}
