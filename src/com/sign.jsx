import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

function Sign() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();

  async function googlesign() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      Swal.fire({
        icon: 'success',
        title: 'Success',
        timer: 1500,
        showConfirmButton: false,
      });

      setemail(user.email);
      setpassword(user.uid);

      navigate('/Home');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        showCloseButton: true,
      });
    }
  }

  async function work() {
    try {
      const ans = await fetch("http://localhost:1200/reg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: email,
          password: password,
        })
      });

      const data = await ans.text();
      if (ans.ok) {
        alert(data);
      } else {
        alert("Error: " + data);
      }
    } catch (error) {
      console.error("Failed to fetch", error);
      alert("Failed to connect to server");
    }
  }

  return (
    <div className="App">
      <input 
        type="text" 
        name="username"  
        value={email} 
        placeholder="Username" 
        onChange={(e) => setemail(e.target.value)} 
      />
      <input 
        type="password" 
        name="password" 
        value={password}  
        placeholder="Password" 
        onChange={(e) => setpassword(e.target.value)} 
      />
      <button type="submit" onClick={work}>Submit</button> 
      <button type='submit' onClick={googlesign}>Sign in with Google</button>
    </div>
  );
}

export default Sign;
