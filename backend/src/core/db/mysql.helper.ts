import {config} from '../../utils';
import mysql from 'mysql2/promise'


//Class permettant la connection à la base de données
class MysqlHelper{
    url: string ;
    dbname: string ;
    port: string ;
    username: string ;
    instance: any;
    password: string ;
    host : string;

    constructor(
        host : string,
        url: string ,
        dbname: string ,
        port: string ,
        username: string ,
        password: string 
    ){
        this.host = host
        this.url = url;
        this.dbname = dbname;
        this.port = port;
        this.username=username;
        this.password= password
        this.instance = null;
    }

    async getInstance(){
        if (!this.instance) {
            this.instance = await this.connect();
        }
        return this.instance;
    }

    async connect(){
        try {
            this.instance =  mysql.createPool({
                host:`${this.host}`,
                user: this.username,
                password: this.password,
                database: this.dbname
            })
            
            /*this.instance.connect((err)=>{
                if(err){
                    console.error('Erreur de connection à la bd', err)
                    return err
                }
                console.log("Nouvelle instance de base de données crée")
                return this.instance
            })*/
            console.log("Nouvelle instance de base de données crée")
            return this.instance
        } catch (error) {
            console.error('Erreur de connection à la bd',error)
        }
    }
}

export const mysqlHelper = new MysqlHelper(
    config.dburl!,
    config.serverhost!,
    config.dbname!,
    config.dbport!,
    config.dbUserName!,
    ''
)