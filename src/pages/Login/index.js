import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import logo from '../../assets/logo.svg';

import api from '../../services/api';
import { login } from '../../services/auth';

import { Container, FormContainer, Form, Footer } from '../Register/styles';

import ErrorMessage from '../../components/ErrorMessage';

export default function Register({ history }) {
  const initialState = {
    username: '',
    password: '',
  };

  const [user, setUser] = useState(initialState);
  const [errors, setErrors] = useState([]);

  const handleInputs = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = user;

    if (!username.trim() || !password.trim()) {
      toast.error(` 🔎 Please fill all fields`);
      return;
    }

    try {
      const res = await api.post('/auth', { username, password });
      if (res.status === 200) {
        const { token } = res.data;
        login(token);
        history.push('/');
      }
    } catch (err) {
      const arrayErrors = err.response.data.errors;
      setErrors(arrayErrors);

      err.response.data.message &&
        toast.error(` 🔐 ${err.response.data.message}`);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <img src={logo} alt='logo' width='230' />
          <span>Log in to see photos and videos of your friends</span>
          <hr />
          <input
            type='text'
            name='username'
            value={user.username}
            onChange={handleInputs}
            placeholder='Username'
          />
          {errors &&
            errors.map(
              (error, index) =>
                error.param === 'username' && (
                  <ErrorMessage key={index} error={error.msg} />
                )
            )}
          <input
            type='password'
            name='password'
            value={user.password}
            onChange={handleInputs}
            placeholder='Password'
          />
          {errors &&
            errors.map(
              (error, index) =>
                error.param === 'password' && (
                  <ErrorMessage key={index} error={error.msg} />
                )
            )}
          <input className='button' type='submit' value='Log In' />

          <hr />

          <span className='footer'>
            Enjoy everything that your friends have for you
          </span>
        </Form>
        <Footer>
          <p>
            Don't have an account? <Link to='/register'>Sign up</Link>
          </p>
        </Footer>
      </FormContainer>
    </Container>
  );
}
