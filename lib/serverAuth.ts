import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prismadb from '@/lib/prismadb';
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const serverAuth=async(req:NextApiRequest,res: NextApiResponse)=>{
    console.log("Attempting server authentication");
    const session = await getServerSession(req,res,authOptions);
    console.log("Session:", session);
    if(!session?.user?.email){
        console.log("No valid session found");
        throw new Error('Not signed in');
    }
    console.log("Searching for user with email:", session.user.email);

    const currentUser=await prismadb.user.findUnique({
        where:{
            email:session.user.email
        }
    });

    if(!currentUser){
        console.log("User not found in database");
        throw new Error('Not signed in');
    }
    console.log("Authentication successful");
    return { currentUser };
};

export default serverAuth;
