import axios from 'axios'; // Correct
import { showAlert } from './alert';
//  import "@babel/ployfil"
 export const login = async (email, password) => {
    try{
        const res = await axios({
          method: 'POST',
          url: '/api/v1/users/login',
          data: {
            email,
            password
          }
        });
   
      showAlert('success',"logged in Successfuly")
      setTimeout(() => {
        location.assign("/")
      }, 1500);

    }
    catch(err){
      showAlert('error',err.response.data.message)
    }

}

export const logout= async() =>{

  try {
    const res= await axios({
     method: "get",
     url: "/logout"
    })
    console.log(res.status)
    if(res.status===200)
      location.assign("/")
   } catch (error) {
    console.log(error)
  }

}
  
