const nodemailer = require("nodemailer")
const pug = require("pug")


module.exports= class mail{
   constructor(user,url){
    this.to= user.email,
    this.firstName= user.name.split(" ")[0]
    this.url=url
    this.from=`Yonas Awoke Yitay <${process.env.EMAIL_FROM}>`
   }
   createTransporter(){
      if(process.env.NODE_ENV.trim()==="PRODUCTION")
        return nodemailer.createTransport( {
          host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
          port: 465, // Port for SMTP (usually 465)
          secure: true, // Usually true if connecting to port 465
          auth: {
            user: "yonasawokeyitay@gmail.com",// Your email address
            pass: "cnxd xrot ioqz xmum", // Password (for gmail, your app password)
            // ⚠️ For better security, use environment variables set on the server for these values when deploying
          }})

      return nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
        }
      });
   }

    async send(template,subject){
    // 1 render the pug template
    console.log(`${__dirname}/../`)
        const html=   pug.renderFile(`${__dirname}/../view/emails/${template}.pug`,{
          url:this.url,  
          firstName:this.firstName,
          subject

        })

    // define the options
      const options= {
        from:  this.from,
        to:   this.to,
        subject,
        html
      }

    // create a transporter and send the eamil

      await this.createTransporter().sendMail(options)

   }


  async  sendWelcome(){
    console.log("about sending")
    await this.send("welcome","We are glad to see you here!")
   }
  async sendPasswordResetToken(){
    await this.send("passwordReset","your Password Reset Token valid for only 10 min")
  }
}
 
 
 
 
 

 

// module.exports=  sendEmail 


