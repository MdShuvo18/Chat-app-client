/* eslint-disable react/prop-types */
import { useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";


const Form = ({ isSignIn = true, }) => {
    const [data, setData] = useState({
        ...(!isSignIn && { fullName: '' }),
        email: '',
        password: ''
    })
    console.log(data)
    return (
        <div className="bg-white w-[400px] h-[600px] shadow-lg p-10 space-y-4">
            <div className="text-4xl font-bold">Welcome {isSignIn && "Back"}</div>
            <div className="text-2xl font-semibold">{isSignIn ? "Sign in to explore" : "Sign Up for Start"}</div>
            <div className="space-y-4">
                <form className="space-y-4" onSubmit={()=>console.log("submitted")}>
                    {!isSignIn && <Input label="Full name" name="name" placeholder="write your name" type="text" isRequired="true" value={data.fullName} onChange={(e) => setData({ ...data, fullName: e.target.value })}></Input>}

                    <Input label="Email address" name="email" placeholder="enter your email" type="email" isRequired="true" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })}></Input>

                    <Input label="Password" name="password" placeholder="set your password" type="password" isRequired="true" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })}></Input>

                    <Button label={isSignIn ? "Sign in" : "Sign up"} type="submit"></Button>

                </form>
                <div>
                    {isSignIn ? (
                        <>
                            Dont have an account? Please{" "}
                            <span className="font-bold text-green-500 cursor-pointer underline">
                                Sign up
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account? Please{" "}
                            <span className="font-bold text-green-500 cursor-pointer underline">
                                Sign in
                            </span>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Form;