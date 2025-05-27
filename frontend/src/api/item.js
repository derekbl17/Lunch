import axios from "axios";
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
