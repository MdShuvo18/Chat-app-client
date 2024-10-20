import { useEffect, useState } from "react";
import useAxiosPublic from "../../useAxios/useAxios";
import Input from "../Input/Input";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('')
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

    useEffect(() => {
        // Fetch all users (for autocomplete feature)
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
            console.log("Fetching conversation with ID:", conversationId);

            // Set the selected conversation
            const selectedConv = conversations.find(conv => conv.conversationId === conversationId);
            setSelectedConversation(selectedConv);

            // Make API call to fetch messages
            const res = await axios.get(`/api/messages/${conversationId}`);
            console.log("API call completed. Status:", res);

            if (res.status === 200) {
                const data = res.data || [];
                setMessages(data);
            }
        } catch (error) {
            console.error("Error fetching conversation:", error.message || error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!selectedConversation) {
            console.error("No conversation selected for sending messages.");
            return;
        }
    
        try {
            const response = await axios.post(`/api/messages`, {
                conversationId: selectedConversation.conversationId,
                senderId: user.id,
                message: messageInput,
            });
    
            if (response.status === 201) {
                console.log("Message sent successfully!");
                setMessageInput(''); // Clear the message input
                handleMessages(selectedConversation.conversationId); // Refresh messages after sending
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    

    const handleUserClick = async (selectedUserId) => {
        try {
            const selectedUserProfile = allUsers.find(user => user._id === selectedUserId);
            setSelectedUser(selectedUserProfile);
    
            // Check if the conversation already exists
            let conversation = conversations.find(conv =>
                conv.participants?.includes(user.id) && conv.participants?.includes(selectedUserId)
            );
    
            if (!conversation) {
                // If no conversation exists, create a new one by hitting the backend POST API
                const response = await axios.post('/api/conversation', {
                    senderId: user.id,
                    receiverId: selectedUserId
                });
    
                if (response.status === 201) {
                    conversation = response.data;
                    setConversations(prevConversations => [...prevConversations, conversation]);
                    console.log("New conversation created successfully!");
                }
            }
    
            // Set the selected conversation to ensure it's properly set for sending messages
            setSelectedConversation(conversation);
    
            // Fetch messages for the conversation if needed
            handleMessages(conversation.conversationId);
        } catch (error) {
            console.error("Error handling user click:", error);
        }
    };
    

    return (
        <div className="w-screen flex">
            <div className="w-[25%] bg-indigo-50 border h-screen">
                {/* User Information */}
                <div className="flex justify-center items-center p-14">
                    <img
                        src="https://i.ibb.co/kqSnnFn/download-1.jpg"
                        alt="User Avatar"
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
                {/* Conversations List */}
                <div className="p-8">
                    <div className="text-lg text-green-500 font-semibold">Messages</div>
                    <div>
                        {conversations.length > 0 ? (
                            conversations.map(({ conversationId, userName, email }) => (
                                <div
                                    key={conversationId}
                                    className="flex items-center my-8 cursor-pointer"
                                    onClick={() => handleMessages(conversationId)} // Pass conversation ID
                                >
                                    <img
                                        src={'https://i.ibb.co/kqSnnFn/download-1.jpg'}
                                        alt="Conversation Avatar"
                                        width={50}
                                        height={50}
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
            <div className="w-[50%] bg-white border h-screen flex flex-col items-center">
                {selectedConversation ? (
                    <div className="w-[75%] mt-10 bg-indigo-50 rounded-full h-[70px] flex items-center px-6">
                        <div className="cursor-pointer">
                            <img src="https://i.ibb.co/kqSnnFn/download-1.jpg" alt="" width={50} height={50} className="rounded-full" />
                        </div>
                        <div className="ml-3 mr-auto">
                            <h1 className="text-lg font-medium">{selectedConversation?.userName || ""}</h1>
                            <h2 className="text-sm text-gray-500 font-semibold">online</h2>
                        </div>
                    </div>
                ) : null}

                {/* Messages */}
                <div className="h-[75%] w-full overflow-x-scroll mt-2">
                    <div className="h-[1000px] px-10 py-10">
                        {messages.length > 0 ? (
                            messages.map(({ message, user: { id } = {} }, index) => (
                                id === user?.id ? (
                                    <div key={index} className="ml-auto mb-6 p-4 max-w-[60%] rounded-b-xl bg-primary text-white rounded-tl-xl">
                                        {message}
                                    </div>
                                ) : (
                                    <div key={index} className="max-w-[60%] mb-6 p-4 rounded-b-xl bg-gray-200 rounded-tr-xl">
                                        {message}
                                    </div>
                                )
                            ))
                        ) : (
                            <div className="p-14  w-full text-xl font-bold">No conversation selected</div>
                        )}
                    </div>
                </div>

                {/* Send Message Input */}
                <div className="p-10 w-full flex items-center">
                    <Input placeholder="Type your message here ..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
                    <div className={`ml-2 p-2 rounded-full cursor-pointer ${!messageInput && "pointer-events-none"}`} onClick={sendMessage}>
                        <button className="btn btn-outline ">Send</button>
                    </div>
                </div>
            </div>

            {/* Display All Users Except Logged-in User */}
            <div className="w-[25%] border h-screen">
                <div className="text-lg text-green-500 font-semibold px-10 py-16">People</div>
                {allUsers
                    .filter((allUser) => allUser._id !== user?.id) // Filter out the logged-in user
                    .map((e) => (
                        <div
                            key={e._id}  // Use _id instead of id
                            className="flex items-center my-8 px-10 cursor-pointer"
                            onClick={() => handleUserClick(e._id)} // Call handleUserClick with selected user ID
                        >
                            <img
                                src="https://i.ibb.co/kqSnnFn/download-1.jpg"
                                alt="User Avatar"
                                width={50}
                                height={50}
                                className="rounded-full"
                            />
                            <div className="ml-4">
                                <h1 className="text-lg font-semibold">{e.fullName}</h1>
                                <h1 className="text-sm font-medium">{e.email}</h1>
                            </div>
                        </div>
                    ))}
            </div>

        </div>
    );
};

export default Dashboard;
