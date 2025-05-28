import axios from "axios";
import { useAuth } from "../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateItemMutation(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:async(itemData)=>{
      console.log(itemData)
      const {data}=await axios.post('/api/items',{
        itemData
      });
      return data
    },
    onSuccess:(data)=>{
      queryClient.setQueryData(['items'],(old)=>[...old,data])
    }
  })
}

export function useItemsQuery() {
    return useQuery({
      queryKey: ["items"],
      queryFn: async()=> {
         const {data}=await axios.get("/api/items");
          return data
        }
    });
};

export function useDeleteItemMutation(){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:async(itemId)=>{
      await axios.delete(`/api/items/${itemId}`)
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(['items'])
    }
  })
}

export function useLikeItemMutation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  

  return useMutation({
    mutationFn: async (postId) => {
      const response = await axios.patch(`/api/items/like/${postId}`);
      return {
        postId,
        ...response.data, // includes updated likes array and isLiked
      };
    },


    onError: (err, postId, context) => {
      toast.error(err.response?.data?.message || 'Like action failed');
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries(['items']),
      queryClient.invalidateQueries(['likedItems'])
      // queryClient.setQueryData(['items'], (oldPosts) => {
      //   if (!oldPosts || !oldPosts.data) return oldPosts;

      //   return {
      //     ...oldPosts,
      //     data: oldPosts.data.map((post) => {
      //       if (post._id === data.postId) {
      //         return {
      //           ...post,
      //           likes: data.likes, // Use updated likes array from server
      //         };
      //       }
      //       return post;
      //     }),
      //   };
      // });
      // queryClient.setQueryData(['likedPosts'], (old) => {
      //   if (!old) return old;
      //   const stillLiked = data.likes.includes(user._id);

      //   return {
      //     ...old,
      //     data: stillLiked
      //       ? old.data.map((post) =>
      //           post._id === data.postId
      //             ? { ...post, likes: data.likes }
      //             : post
      //         )
      //       : old.data.filter((post) => post._id !== data.postId),
      //   };
      // });
    },
  });
}

export function useLikedItemsQuery(){
  return useQuery({
      queryKey:['likedItems'],
      queryFn: async()=> axios.get('/api/items/liked')
  })
}


