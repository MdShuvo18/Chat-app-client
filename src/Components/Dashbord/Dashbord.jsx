import { useEffect, useState } from "react";
import useAxiosPublic from "../../useAxios/useAxios";
import Input from "../Input/Input";
import { io } from 'socket.io-client'

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [socket, setSocket] = useState([]);
    const axios = useAxiosPublic();

    // Socket setup
    useEffect(() => {
        setSocket(io('http://localhost:5050'));
    }, []);

    // Fetch user info from localStorage
    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem('user'));
        if (storedUserData) {
            setUser(storedUserData);
        }
    }, []);

    // Fetch conversations
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

    useEffect(() => {
        // Fetch all users
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                if (response.status === 200) {
                    setAllUsers(response.data);
                }
            } catch (error) {
                console.error("Error fetching all users:", error);
            }
        };
        fetchAllUsers();
    }, []);

    const handleMessages = async (conversationId) => {
        try {
            const selectedConv = conversations.find(conv => conv.conversationId === conversationId);
            setSelectedConversation(selectedConv);

            const res = await axios.get(`/api/messages/${conversationId}`);
            if (res.status === 200) {
                setMessages(res.data);
            }
        } catch (error) {
            console.error("Error fetching conversation:", error.message || error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!selectedConversation) return;

        try {
            const response = await axios.post(`/api/messages`, {
                conversationId: selectedConversation.conversationId,
                senderId: user.id,
                message: messageInput,
            });

            if (response.status === 201) {
                setMessageInput(''); // Clear the input
                handleMessages(selectedConversation.conversationId); // Refresh messages
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleUserClick = async (selectedUserId) => {
        try {
            const selectedUserProfile = allUsers.find(user => user._id === selectedUserId);
            setSelectedUser(selectedUserProfile);

            let conversation = conversations.find(conv =>
                conv.participants?.includes(user.id) && conv.participants?.includes(selectedUserId)
            );

            if (!conversation) {
                const response = await axios.post('/api/conversation', {
                    senderId: user.id,
                    receiverId: selectedUserId
                });

                if (response.status === 201) {
                    conversation = response.data;
                    setConversations(prev => [...prev, conversation]);
                }
            }

            handleMessages(conversation.conversationId);
        } catch (error) {
            console.error("Error handling user click:", error);
        }
    };

    return (
        <div className="w-screen flex flex-col md:flex-row">

            {/* Left Sidebar */}
            <div className="w-full md:w-[25%] bg-indigo-50 border lg:h-screen">
                <div className="flex justify-center items-center p-8 md:p-14">
                    <img
                        src="https://i.ibb.co/kqSnnFn/download-1.jpg"
                        alt="User Avatar"
                        width={60}
                        height={60}
                        className="rounded-full"
                    />
                    <div className="ml-4">
                        <h1 className="text-lg md:text-2xl font-semibold">{user?.name || "User"}</h1>
                        <h1 className="text-sm md:text-lg font-medium">My Account</h1>
                    </div>
                </div>
                <hr />
                <div className="p-4 md:p-8">
                    <div className="text-lg text-green-500 font-semibold">Messages</div>
                    <div className="h-[400px] md:h-auto overflow-y-auto">
                        {conversations.length > 0 ? (
                            conversations.map(({ conversationId, userName, email }) => (
                                <div
                                    key={conversationId}
                                    className="flex items-center my-6 md:my-8 cursor-pointer"
                                    onClick={() => handleMessages(conversationId)}
                                >
                                    <img
                                        src={'https://i.ibb.co/kqSnnFn/download-1.jpg'}
                                        alt="Conversation Avatar"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <div className="ml-4">
                                        <h1 className="text-lg font-semibold">{userName || "User"}</h1>
                                        <h1 className="text-sm font-medium">{email}</h1>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-xl font-semibold p-5">No Conversations Available</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages Section */}
            <div className="w-full md:w-[50%] bg-white border h-screen flex flex-col">
                {selectedConversation && (
                    <div className="w-full bg-indigo-50 rounded-full h-[70px] flex items-center px-6 mt-4 md:mt-10">
                        <div className="cursor-pointer">
                            <img src="https://i.ibb.co/kqSnnFn/download-1.jpg" alt="" width={40} height={40} className="rounded-full" />
                        </div>
                        <div className="ml-3">
                            <h1 className="text-lg font-medium">{selectedConversation?.userName}</h1>
                            <h2 className="text-sm text-gray-500 font-semibold">online</h2>
                        </div>
                    </div>
                )}

                {/* Messages Display */}
                <div className="flex-1 overflow-y-auto mt-4 md:mt-2 px-4 md:px-10 py-10">
                    {messages.length > 0 ? (
                        messages.map(({ message, user: { id } = {} }, index) => (
                            id === user?.id ? (
                                <div key={index} className="ml-auto mb-6 p-4 max-w-[75%] bg-indigo-500 text-white rounded-tl-xl rounded-b-xl">
                                    {message}
                                </div>
                            ) : (
                                <div key={index} className="mr-auto mb-6 p-4 max-w-[75%] bg-gray-200 rounded-tr-xl rounded-b-xl">
                                    {message}
                                </div>
                            )
                        ))
                    ) : (
                        <div className="text-xl font-bold p-10">No conversation selected</div>
                    )}
                </div>

                {/* Send Message Input */}
                <div className="p-4 md:p-10 w-full flex items-center">
                    {/* Input Field */}
                    <input
                        className="flex-grow p-2 border border-gray-300 rounded-lg w-full"
                        placeholder="Type your message here ..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />

                    {/* Button */}
                    <div
                        className={`ml-2 p-2 rounded-full cursor-pointer ${!messageInput && "pointer-events-none"}`}
                        onClick={sendMessage}
                    >
                        <button className="px-4 py-2 text-white bg-blue-500 rounded-lg">Send</button>
                    </div>
                </div>

            </div>

            {/* Right Sidebar */}
            <div className="w-full md:w-[25%] border h-screen p-4 md:px-10">
                <div className="text-lg text-green-500 font-semibold py-4 md:py-16">People</div>
                <div className="overflow-y-auto h-[400px] md:h-auto">
                    {allUsers
                        .filter((allUser) => allUser._id !== user?.id)
                        .map((e) => (
                            <div
                                key={e._id}
                                className="flex items-center my-4 md:my-8 cursor-pointer"
                                onClick={() => handleUserClick(e._id)}
                            >
                                <img src="https://i.ibb.co/kqSnnFn/download-1.jpg" alt="" width={40} height={40} className="rounded-full" />
                                <div className="ml-4">
                                    <h1 className="text-lg font-semibold">{e?.fullName}</h1>
                                    <h2 className="text-sm text-gray-600">{e?.email}</h2>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
