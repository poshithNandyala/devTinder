export const userauth = (req, res, next) => {
    const token = "ye";
    if(token!="yes"){
        res.status(401).send("unauthorised request");
    }  
     next();
}

