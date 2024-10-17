import { useEffect, useState } from "react";
import Input from "../Input/Input";
import useAxiosPublic from "../../useAxios/useAxios";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const axios = useAxiosPublic();

    // Fetch user info from localStorage
    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem('user'));
        if (storedUserData) {
            setUser(storedUserData);
        }
    }, []);

    // Fetch conversations from API
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                if (user?.id) {
                    const response = await axios.get(`/api/conversation/${user.id}`);
                    if (response.status === 200) {
                        setConversations(response.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
    }, [user, axios]);

    return (
        <div className="w-screen flex">
            {/* Left Sidebar - User Info & Messages */}
            <div className="w-[25%] bg-indigo-50 border h-screen">
                <div className="flex justify-center items-center p-14">
                    <img
                        src="https://i.ibb.co/kqSnnFn/download-1.jpg"
                        alt=""
                        width={75}
                        height={75}
                        className="rounded-full"
                    />
                    <div className="ml-4">
                        <h1 className="text-2xl font-semibold">{user?.name || "User"}</h1>
                        <h1 className="text-lg font-medium">My Account</h1>
                    </div>
                </div>
                <hr />
                <div className="p-8">
                    <div className="text-lg text-green-500 font-semibold">Messages</div>
                    <div>
                        {conversations.map((conversation) => {
                            return (
                                <div key={conversation.id} className="flex items-center my-8 cursor-pointer">
                                    <img
                                        src={'https://i.ibb.co/kqSnnFn/download-1.jpg'}
                                        alt="photo"
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                    <div className="ml-4">
                                        <h1 className="text-lg font-semibold">{conversation.userName || "User"}</h1>
                                        <h1 className="text-sm font-medium">{conversation.email}</h1>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="w-[50%] bg-white border  h-screen flex flex-col items-center">
                <div className="w-[75%] mt-10 bg-indigo-50 rounded-full h-[70px] flex items-center px-6">
                    <div className="cursor-pointer">
                        <img src="https://i.ibb.co/kqSnnFn/download-1.jpg" alt="" width={50} height={50} className="rounded-full" />
                    </div>
                    <div className="ml-3 mr-auto">
                        <h1 className="text-lg font-medium">John</h1>
                        <h2 className="text-sm text-gray-500 font-semibold">online</h2>
                    </div>
                    <div className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-phone"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" /></svg>
                    </div>
                </div>
                <div className="h-[75%]  w-full overflow-auto mt-2">
                    <div className="h-[1000px] px-10 py-10 ">
                        <div className="max-w-[60%] mb-6 p-4 rounded-b-xl bg-gray-200 rounded-tr-xl">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit, dolor!
                        </div>
                        <div className="ml-auto mb-6 p-4 max-w-[60%] rounded-b-xl bg-stone-200 rounded-tl-xl">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi, soluta.
                        </div>
                        <div className="max-w-[60%] mb-6 p-4 rounded-b-xl bg-gray-200 rounded-tr-xl">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit, dolor!
                        </div>
                        <div className="ml-auto mb-6 p-4 max-w-[60%] rounded-b-xl bg-stone-200 rounded-tl-xl">
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Modi, soluta.
                        </div>
                    </div>
                </div>
                <div className="p-10 w-full flex items-center">
                    <Input placeholder="Type your message here ..." />
                    <div className="ml-2 p-2 rounded-full cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-send"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></svg>
                    </div>
                    <div className="ml-2 p-2 rounded-full cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                    </div>
                </div>
            </div>

            <div className="w-[25%] border  h-screen"></div>
        </div>
    );
};

export default Dashboard;
