import useCurrentUser from "@/hooks/useCurrentUser";
import { NextPageContext } from "next";
import { getSession, signOut } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import Navbar from "@/components/navbar";
import Billboard from "@/components/billboard";
import MovieList from "@/components/movielist";
import useMovieList from "@/hooks/useMovieList";
import useFavorites from "@/hooks/useFavorites";
import InfoModal from "@/components/infoModal";
import useInfoModal from "@/hooks/useInfoModal";
export async function getServerSideProps(context:NextPageContext){
  const session=await getSession(context);
  if(!session){
    return{
      redirect:{
        destination:'/auth',
        permanent: false,
      }
    }
   
  }
  return{
    props:{}
  }
}


export default function Home() {

  const {data:user}=useCurrentUser();
  const {data:movies=[]}=useMovieList();
  const {data:favorites=[]}=useFavorites();
  const {isOpen,closeModal}=useInfoModal();

  return (
    <>

    <InfoModal visible={isOpen} onClose={closeModal}/>

    <Navbar/>
    <Billboard />
    <div className="pb-48">
     <MovieList title="Trending Now" data={movies} />
     <MovieList title="My List" data={favorites} />
    
    </div>
    

    
    </>
  );
}
