import React,{ useState,useEffect } from 'react'
import querystring from 'query-string'
import io from 'socket.io-client'
import Bar from '../Bar/Bar.js'
import Input from '../Input/Input.js'
import Messages from '../Messages/Messages.js'
import './Chat.css'


let socket;

const Chat = ({location}) =>{
    const [name, setName] = useState(' ');
    const [room, setRoom] = useState(' ');
    const[message,setMessage] = useState(' ');
    const[messages,setMessages] = useState([]);

    const ENDPOINT = 'https://realtime-chat-app-using-socket.herokuapp.com/';

   useEffect(() => {
       const {name,room} = querystring.parse(location.search);

      socket = io(ENDPOINT);

       setName(name);
       setRoom(room);


       socket.emit('join',{ name,room },() => {

       });

       return () => {
           socket.emit('disconnect');

           socket.off();
       }

   },[ENDPOINT,location.search])

useEffect(() => {
    socket.on('message', (message) => {
     setMessages([...messages,message]);
    })
},[messages])


const sendMessage = (event) =>{
   event.preventDefault();

    if(message) {
        socket.emit('sendMessage',message,()=> setMessage(' '))
    }
}

console.log(message , messages);


   return(
    <div className="outerContainer">
        <div className="container">
         <Bar room={room}/>
         <Messages messages={messages} name={name} />
         <Input message={message} setMessage={setMessage} sendMessage={sendMessage}  />
        </div>
    </div>
)
}

export default Chat;