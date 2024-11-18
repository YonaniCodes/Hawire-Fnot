//  for login Purpose
import {login} from "./login"
import { logout } from "./login"
import {updateUserData } from "./updateSettings"

const loginBtn=document.querySelector('.form--login')
const logoutBtn=document.querySelector('.nav__el--logout')
const formUserData=document.querySelector('.form-user-data')
const passwordForm=document.querySelector('.form-user-password')






if(loginBtn)
    loginBtn.addEventListener('submit',e=>{
        e.preventDefault()
        const email= document.getElementById("email").value
    const password= document.getElementById("password").value
 
    login(email,password)
    })
if(logoutBtn)
    logoutBtn.addEventListener('click',e=> logout())
if(formUserData)
    formUserData.addEventListener('submit',e=>{
        const form =new FormData()
        form.append('name',document.getElementById("email").value)
        form.append('email',document.getElementById("email").value)
        form.append('photo',document.getElementById("photo").files[0])
         e.preventDefault()
        updateUserData(form,"data")
    })
  if(passwordForm)
    passwordForm.addEventListener('submit',e=>{
            const currentPassword= document.getElementById("password-current").value
            const newPassword= document.getElementById("password").value
            const passwordConfirm= document.getElementById("password-confirm").value
             console.log(currentPassword,newPassword,passwordConfirm)
            e.preventDefault()
             updateUserData({currentPassword,passwordConfirm,newPassword},"password")
        })