import { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
        email,
        fullname,
      });
      if (response.status === 201) {
        console.log('User registered successfully');
      } else {
        console.error('Failed to register user');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="area" >
            <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
            </ul>
    
    <div className='input-group'>
      <form className='cont' onSubmit={handleSubmit}>
      <h2>Register</h2>
      <div className='cont-in1'>
        <input className='inputForm' type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label className='label'>Username</label>
      </div>
      <div className='cont-in1'>
        <input className='inputForm' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <label className='label'>Password</label>
      </div>
      <div className='cont-in1'>
        
        <input className='inputForm' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className='label'>Email</label>
      </div>
      <div className='cont-in1'>        
        <input className='inputForm' type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
        <label className='label'>Fullname</label>
      </div>

      <button type="submit">SIGN UP</button>
    </form>
    </div>
    </div >
  );
};

export default RegisterForm;
