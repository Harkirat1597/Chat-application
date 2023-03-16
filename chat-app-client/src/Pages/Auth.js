import React, { useState, useRef, useEffect } from 'react';
import Form from '../Components/Form';
import { useAuth } from '../Context/AuthContext';

const Auth = () => {
    const [isLoginActive, setLoginActive] = useState(true);
    const [message, setMessage] = useState("");

    const { signup, login, client } = useAuth();

    const login_idRef = useRef();
    // const login_passRef = useRef();

    const signup_idRef = useRef();
    const signup_nameRef = useRef();
    // const signup_passRef = useRef();
    // const signup_confirmPassRef = useRef();

    useEffect(() => {
        setMessage("");
    }, [isLoginActive]);

    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        const id = login_idRef.current.value;
        // const pass = login_passRef.current.value;

        const res = await login(id);
        if (!res.success) setMessage(res.error);
    }

    const handleSubmitSignup = async (e) => {
        e.preventDefault();

        const id = signup_idRef.current.value;
        const name = signup_nameRef.current.value;
        // const pass = signup_passRef.current.value;
        // const confirmPass = signup_confirmPassRef.current.value;

        const res = await signup(id, name);
        if (!res.success) setMessage(res.error);
    }

    return (
        <div className='container-full-screen' >
            <div className='p-3'>
                <h1 className='text-center my-4 text-2xl'>Chat Application</h1>

                <div className='auth-btn-container bg-gray-100 my-2'>
                    <button
                        className={` ${isLoginActive ? `bg-blue-600 text-white` : "bg-gray-100"}`}
                        onClick={() => setLoginActive(true)}
                    >
                        Login
                    </button>
                    <button
                        className={` ${!isLoginActive ? `bg-blue-600 text-white` : "bg-gray-100"}`}
                        onClick={() => setLoginActive(false)}
                    >
                        Signup
                    </button>
                </div>

                {isLoginActive && <div className='form-container flex flex-col my-2'>
                    {/* <h2 className={`font-bold`}> LOGIN </h2> */}
                    <Form className={`flex flex-col`} onSubmit={handleSubmitLogin}>
                        <label htmlFor={'id'}> Id </label>
                        <Form.Input
                            className={`border-2 border-gray-300 rounded my-2`}
                            id={"id"}
                            placeholder="Id..."
                            type={"text"}
                            ref={login_idRef}
                            required
                        />
                        {/* <Form.Input
                            className={`border-2 border-gray-300 rounded my-2`}
                            placeholder="Password..."
                            type={"password"}
                            ref={login_passRef}
                            required
                        /> */}
                        <Form.Submit
                            className={`form-submit bg-blue-600 text-white px-3 py-0.5 rounded my-2 mx-auto`}
                            type={"submit"}
                        > Login </Form.Submit>
                        <p className="text-sm text-orange-700 text-center"> {message} </p>
                    </Form>
                </div>}

                {!isLoginActive && <div className='form-container flex flex-col my-2'>
                    {/* <h2 className={`font-bold`}> SIGNUP </h2> */}
                    <Form className={`flex flex-col`} onSubmit={handleSubmitSignup}>
                        <label htmlFor='id'> Id </label>
                        <Form.Input
                            className={`border-2 border-gray-300 rounded my-2`}
                            id={"id"}
                            placeholder="Id..."
                            type={"text"}
                            ref={signup_idRef}
                            required
                        />
                        <label htmlFor='name'> Name </label>
                        <Form.Input
                            className={`border-2 border-gray-300 rounded my-2`}
                            id={"name"}
                            placeholder="Name..."
                            type={"text"}
                            ref={signup_nameRef}
                            required
                        />
                        {/* <Form.Input
                            className={`border-2 border-gray-300 rounded my-2`}
                            placeholder="Password..."
                            type={"password"}
                            ref={signup_passRef}
                            required
                        />
                        <Form.Input
                            className={`border-2 border-gray-300 rounded my-2`}
                            placeholder="Confirm password..."
                            type={"password"}
                            ref={signup_confirmPassRef}
                            required
                        /> */}
                        <Form.Submit
                            className={`form-submit bg-blue-600 text-white px-3 py-0.5 rounded my-2 mx-auto`}
                            type={"submit"}
                        > Signup </Form.Submit>
                        <p className="text-sm text-orange-700 text-center text-red-300"> {message} </p>
                    </Form>
                </div>}
            </div>
        </div>
    )
}

export default Auth;