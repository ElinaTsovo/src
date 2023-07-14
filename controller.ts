import { data } from "./modell";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createData = async (request: Request, response: Response) => {
  const { name, email, password, confirmpassword } = request.body;
  //validando o user
  if (!name) {
    return response.status(422).json({ msg: "o nome é obrigatório" });
  }

  if (!email) {
    return response.status(422).json({ msg: "o email é obrigatório" });
  }

  if (!password) {
    return response.status(422).json({ msg: "A password é obrigatório" });
  }

  if (password !== confirmpassword) {
    return response.status(422).json({ msg: "As senhas não conferem" });
  }

  //verificar se o user existe
  const userExist = await data.findOne({ email });
//   if (userExist) {
//     return response
//       .status(422)
//       .json({ msg: "User allready exist, please login" });
//   }

  //criando senha encriptada
  const encryptedpasswordhash = await bcrypt.hash(password, 12);

  //criando o utilizador
  try {

    
    const createData = await data.create({
      name,
      email,
      password: encryptedpasswordhash
      
    });
    //criando token
    

   

    response.status(201).json('user created ');
  } catch (error) {
    return response.json(error);
  }
};



export const loginData = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  //console.log(request.body)

  if (!(email)) {
    return response.status(422).json({ msg: "o email é obrigatório" });
  }

  if (!password) {
    return response.status(422).json({ msg: "a password é obrigatório" });
  }
  //verificando se o usuario existe
  const utilizador = await data.findOne({ email });
  //console.log(utilizador?.password)
  if (!utilizador) {
    return response.status(404).json({ msg: "User not found" });
  }

  //verificando se a senha confere
  const checkpassword = await bcrypt.compare(password, utilizador.password);
  if (!checkpassword) {
    return response.status(404).json({ msg: "Senha inválida" });
  }

  try {
     // Criando o  token
        const secret = process.env.TOKEN_KEY!
        console.log(secret)
     const token = jwt.sign({
        _id:utilizador._id,

     }, `${secret}`, {expiresIn: 1000})  
    return response.status(200).json(`autenticacao realizada com sucesso, ${token}`);
  } catch (error) {
    return response.json(error);
  }
};

export const getData = async (request: Request, response: Response) => {
  const { name, email } = request.body;

  if (!name) {
    return response.status(422).json({ msg: "o nome é obrigatório" });
  }

  if (!email) {
    return response.status(422).json({ msg: "o email é obrigatório" });
  }
  try {
    const getDataF = await data.findOne({name});
    if (getDataF?.name != name) {
      return response.status(404).json({ msg: "User not found" });
    }

   const getDataAll = await data.find()
    return response.json(getDataAll);
  } catch (error) {
    return response.json(error);
  }
};

export const getDataID = async (request: Request, response: Response) => {
  const { _id } = request.params;
  try {
    const getDataF = await data.findById({ _id });
    if (!getDataF) {
      return response.status(404).json("ERROR, user not found");
    }
    return response.status(200).json(getDataF);
  } catch (error) {
    return response.json(error);
  }
};

//funcao que verifica o token
//next: sucesso, pode prosseguir
export const checkTokenData = async (request:Request, response:Response, next: NextFunction) =>{
                    //o token vem do header por isso devemos pegar o mesmo
        const { token }: any = request.headers
        console.log(token)

        if (!token){
            return response.status(401).json('acess dinied')
        }

        //validando se o token é correcto ou não

        try {
            const secret = process.env.TOKEN_KEY!
            jwt.verify(token, secret)
            
            next()
            
        } catch (error) {
            console.log(error)
            return response.status(400).json({msg: 'Token inválido'})
        }
}

export const updateData = async (request: Request, response: Response) => {
  const { _id } = request.params;
  const { name, age } = request.body;
  try {
    const updateF = await data.findById({ _id });
    if (!updateF) {
      return response.json("ERROR, data not found on DataBase");
    }

    await data.updateOne({
      name,
      age,
    });
    return response.json("data Updated");
  } catch (error) {
    return response.json(error);
  }
};

export const deletedata = async (request: Request, response: Response) => {
  const { _id } = request.params;
  try {
    const deletedataF = await data.findById({ _id });
    if (!deletedataF) {
      return response.json("ERROR, data not found on DataBase");
    }
    await data.deleteOne({ _id });
    return response.json("data deleted");
  } catch (error) {
    return response.json(error);
  }
};


export const userProfile = async(request: Request, response: Response) => {
    const { token }: any = request.headers

    try {
        const secret = process.env.TOKEN_KEY!

       const { _id }: any  = jwt.verify(token, secret)

       const user = await data.findById({_id })

       return response.status(200).json(user)
        
    } catch (error) {
        return response.status(404).json(error)
    }

}