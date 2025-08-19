// 'use client';
//Node Modules
import { Client, Account, Databases, Avatars } from 'appwrite';
//Custom Modules
import generatedID from '../utils/generateID';
import { data } from 'autoprefixer';
import { Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const avatars = new Avatars(client);

const createaccount = async (data) => {
  try {
    await account.create(generatedID(), data.email, data.password, data.name);
    const session = await account.createEmailPasswordSession(
      data.email,
      data.password,
    );
    // client.setSession(session.ID)
    return {
      success: true,
      session: session,
      redirect: '/login', // Indicate where to redirect
    };
  } catch (err) {
    // console.log(`Error creating email session: ${err.message}`);
    return { success: false, error: err.message.replace('phone', 'password') };
  }
};

// const createsession = async (data) => {
//   try {
//     let x = await account.createEmailPasswordSession(data.email, data.password);
//     return {
//       success: true,
//       session: x,
//       redirect: '/login', // Indicate where to redirect
//     };
//   } catch (err) {
//     console.log(`Error creating email session: ${err.message}`);
//     return { success: false, error: err.message };
//   }
// };
const loginAction = async (data) => {
  try {
    //Attempt to create session using email and password from the form
    const session = await account.createEmailPasswordSession(
      data.email,
      data.password,
    );
    // on successfull login, redirect the user to the homepage
    if(session){
      return { success: true, session: session, redirect: '/' };
    }
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};
const getsessionactive = async () => {
  try {
    //Attempt to retrieve the user's account information
    const user = await account.get();
    return true;
  } catch (err) {
    console.log(`Error getting user session: ${err.message}`);
    return false;
  }
};
const resetlinkaction = async (useremail) => {
  try {
    await account.createRecovery(
      useremail,
      `${location.origin}/reset-password`,
    );
    return {
      success: true,
      message:
        'You will recieve a password reset link shortly. Please check your email and follow the instructions to rest your password',
    };
  } catch (err) {
    console.log(`Error getting password reset link: ${err.message}`);
    return {
      success: false,
      error: err.message,
    };
  }
};
const resetpwdacton = async (pwd, url) => {
  try{
    const newurl = new URL(url);
    const userId = newurl.searchParams.get("userId");
    const secret = newurl.searchParams.get("secret");
    console.log(userId)
    await account.updateRecovery(
      userId,
      secret,
      pwd
    )
    return{
      success: true,
    }
  }catch(err){
    console.log(`Error updating password: ${err.message}`)
    return {
      success: false,
      error: err.message
    }
  }
};
const logout = async () => { 
  try{
    await account.deleteSession('current')
    return{
      success:true,
      redirect: '/login'
    }
  }catch(err){
    console.log(`Error deleting user session: ${err.message}`)
    return {
      success: false,
      error: err.message
    }
  }
 }
const getuserdetails = async () => { 
  try{
   const userdetails = await account.get()
   return userdetails
  }catch (err){
    return err.message
  }
 }
 const saveconvo = async (convotitle, userid, userprompt, airesponse) => { 
  try{
    const id1 = generatedID()
      const convo = databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        'conversations',
        id1,
        {
          Title: convotitle,
          user_id: userid 
        }
      )
      const chat = databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        'chats',
        id1,
        {
          user_prompt: userprompt,
          ai_response: airesponse
        }
      )
      if(convo && chat){
        return {success:true,
          id: id1
        }
      }

  }
  catch(err){
    console.log(`Error creating conversation: ${err.message}`)
    return {
      success: false,
      error: err.message
    }
  }
  }
  const getconvodetails = async (name) => { 
    try{
      let dt = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        'conversations',
        [
          Query.select(['user_id', 'Title']),
          Query.orderDesc('$createdAt'),
          Query.equal('user_id', name)
        ]
      )
      return dt
    }catch(err){
      return {
        success: false,
        error: err.message
      }
    }
   }
  const getchatdetails = async (name) => { 
    try{
      let dt = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        'chats',
        [Query.equal('$id', name)]
      )
      return dt
    }catch(err){
      return {
        success: false,
        error: err.message
      }
    }
   }
export {
  avatars,
  client,
  account,
  databases,
  createaccount,
  loginAction,
  getsessionactive,
  resetlinkaction,
  resetpwdacton,
  logout,
  getuserdetails,
  saveconvo,
  getconvodetails,
  getchatdetails
};
