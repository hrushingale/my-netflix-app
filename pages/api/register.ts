import bcrypt from 'bcrypt';
import { NextApiRequest,NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if(req.method!=='POST'){
        return res.status(405).end();
    }
    try{
        console.log("Received request body:", req.body); // Log the request body

        const{email, name, password}=req.body;
        const existingUser=await prismadb.user.findUnique({
            where:{
                email
            }
        });

        if(existingUser){
            return res.status(422).json({
                error:'Email taken'
            });
        }
        const hashedPassword=await bcrypt.hash(password,12);
        console.log("ikde bagh");
        const user=await prismadb.user.create({
            data:{
                email,
                name,
                hashedPassword,
                image:'',
                emailVerified: new Date()
            }
        });

        return res.status(200).json(user);
    }
    catch(error){
        console.log(error);
        return res.status(400).end();
    }
}
