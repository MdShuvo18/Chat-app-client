/* eslint-disable react/prop-types */
import { useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../useAxios/useAxios";

const Form = ({ isSignIn = true }) => {
    const [data, setData] = useState({
        ...(!isSignIn && { fullName: '' }),
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const axios = useAxiosPublic(); // Make sure axios is instantiated properly

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/${isSignIn ? 'login' : 'register'}`, {
                ...(data.fullName && { fullName: data.fullName }), // Include fullName only if it's a sign-up
                email: data.email,
                password: data.password
            });

            console.log("Response:", response.data);
            // Store the user data and token in localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
            // Navigate to the dashboard or home page after successful login/register
            navigate('/');
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            // You can display an error message to the user here
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="bg-white w-[400px] h-[600px] shadow-lg p-10 space-y-4">
                <div className="text-4xl font-bold">Welcome {isSignIn && "Back"}</div>
                <div className="text-2xl font-semibold">{isSignIn ? "Sign in to explore" : "Sign Up to Start"}</div>
                <div className="space-y-4">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {!isSignIn && (
                            <Input
                                label="Full name"
                                name="name"
                                placeholder="Enter your name"
                                type="text"
                                isRequired={true}
                                value={data.fullName}
                                onChange={(e) => setData({ ...data, fullName: e.target.value })}
                            />
                        )}
                        <Input
                            label="Email address"
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            isRequired={true}
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                        />
                        <Input
                            label="Password"
                            name="password"
                            placeholder="Set your password"
                            type="password"
                            isRequired={true}
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                        <Button label={isSignIn ? "Sign in" : "Sign up"} type="submit" />
                    </form>
                    <div>
                        {isSignIn ? (
                            <>
                                Dont have an account? Please{" "}
                                <span onClick={() => navigate('/users/sign-up')} className="font-bold text-green-500 cursor-pointer underline">
                                    Sign up
                                </span>
                            </>
                        ) : (
                            <>
                                Already have an account? Please{" "}
                                <span onClick={() => navigate('/users/sign-in')} className="font-bold text-green-500 cursor-pointer underline">
                                    Sign in
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form;
