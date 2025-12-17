export const userauth = (req, res, next) => {
    const token = "yes";
    if(token!="yes"){
        res.status(401).send("unauthorised request");
    }  
     next();
}

