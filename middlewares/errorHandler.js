const errorHandler=(err,req,res,next)=>{
    console.error(" ❌ Erreur",err.stack);
    res.status(err.statusCode || 500).json({
        success:false,
        error:err.message ||"Erreur interne du serveur", 

   });
};
module.exports=errorHandler;