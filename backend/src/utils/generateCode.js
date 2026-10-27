import crypto from 'crypto';






// generate a 6 character long unique short code for URLs (a-z, A-Z, 0-9 only)


const generateCode = (length = 6) => {

  const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
           const bytes = crypto.getRandomValues(new Uint8Array(length));

           let code = "";

           for (let i = 0; i < length; i++) {
             code += CHARS[bytes[i] % CHARS.length];
           }
           console.log(code);
           
           return code;
    };

  export default generateCode;

   

