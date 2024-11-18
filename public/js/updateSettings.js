import axios from "axios"
import { showAlert } from './alert';

//  type is either 'password 'or 'data'. 
export const updateUserData= async (data,type)=>{
  const url=`/api/v1/users/${type==="password"?"updateMyPassword":"updateMe"}`
  console.log(url)
  try {
    const res= await axios({
        method: "PATCH",
        data,
        url
    })
     if(res.status===200)
      showAlert('success',"Updated!")
    location.reload(true)
    
  } catch (error) {
    showAlert('error',error.response.data.message)
    }
    

}