import axios from "axios";
import React,{useCallback,useMemo} from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorites from "@/hooks/useFavorites";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";

interface FavoriteButtonProps{
    movieId:string;
}

const FavoriteButton:React.FC<FavoriteButtonProps>=({movieId})=>{
    
    const{mutate:mutateFavorites}=useFavorites();
    const{data:currentUser,mutate}=useCurrentUser();

    const isFavorite=useMemo(()=>{
        const list=currentUser?.favoriteIds || [];
        return list.includes(movieId);
    },[currentUser,movieId]);

    const toggleFavorites=useCallback(async ()=>{
        console.log("Toggling favorite status for movieId:", movieId);

         let response;
        try{
            if(isFavorite){
                console.log("Removing from favorites", { movieId });
    
                response=await axios.delete('/api/favorite',{
                    data:{movieId}
                });
            }
            else{
                console.log("Adding to favorites", { movieId });
    
                response=await axios.post('/api/favorite',{movieId});
            }
            console.log("Server response:", response);
    
            const updatedFavoriteIds=response?.data?.favoriteIds;
            console.log("Updated favorite IDs:", updatedFavoriteIds);
    
            mutate(
                {
                    ...currentUser,
                    favoriteIds: updatedFavoriteIds
                }
            );
            mutateFavorites();
        }
        catch(error){
            console.log(error);
        }
       
      
    },[movieId,isFavorite,currentUser,mutate,mutateFavorites]);
    const Icon=isFavorite?AiOutlineCheck:AiOutlinePlus;
    return(
        <div
        onClick={toggleFavorites}
        className="
        cursor-pointer
        group/item
        w-6
        h-6
        lg:w-10
        lg:h-10
        border-white
        border-2
        rounded-full
        flex
        justify-center
        items-center
        transition
        hover:border-neutral-300
        "       
        >
            <Icon className="text-white" size={25} />


        </div>
    )
};

export default FavoriteButton;