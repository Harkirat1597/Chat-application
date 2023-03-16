import { createContext, useContext, useState, useEffect } from "react"
import useLocalStorage from "../Utility/useLocalStorage.js";
import { StreamChat } from 'stream-chat';
import { SERVER_URL, API_KEY, API_SECRET_KEY } from "../env_Variables/variables.js";
import { useNavigate } from "react-router-dom";
import uuid from 'react-uuid';

const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user");
    const [token, setToken] = useLocalStorage("token");
    const [client, setClient] = useState(null);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [users, setAllUsers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const newClient = new StreamChat(API_KEY);

        const handleConnectionChange = ({ online = false }) => {
            if (!online) return console.log('connection lost');
            setClient(newClient);
        };

        newClient.on('connection.changed', handleConnectionChange);

        newClient.connectUser(
            user,
            token,
        );

        return () => {
            newClient.off('connection.changed', handleConnectionChange);
            newClient.disconnectUser().then(() => console.log('connection closed'));
        };
    }, [token, user]);

    useEffect(() => {
        if (!client) return navigate("/");
        else {
            // Set all users
            getAllUsers();
            navigate("/dashboard");
        }
    }, [client]);

    const signup = async (id, name, image) => {
        try {
            const newUser = { id, name, image };
            const res = await fetch(`${SERVER_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json;charset=utf-8'
                },
                body: JSON.stringify(newUser)
            })
            const data = await res.json();
            if (data.success) {
                login(id);
            } else {
                return { success: data.success, error: data.error };
            }
        } catch(err) {
            console.log(err);
            return { success: false, error: "Internal error" };
        }
    }

    const login = async (id) => {
        try {
            const res = await fetch(`${SERVER_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json;charset=utf-8'
                },
                body: JSON.stringify({ id })
            })
            const data = await res.json();
            if (data.success) {
                setToken(data.token);
                setUser({ id: data.user.id, name: data.user.name, image: data.user.name });
                setLoggedIn(true);
                navigate("/dashboard");
            } else {
                return { success: data.success, error: data.error }
            }
        } catch (err) {
            console.log(err.TypeError);
            return { success: false, error: "Internal error" }
        }
    }

    const signout = async () => {
        try {
            const res = await fetch(`${SERVER_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json;charset=utf-8'
                },
                body: JSON.stringify({ token })
            });
            const data = await res.json();
            if (data.success) {
                setUser(null);
                setToken("");
                setClient(null);
                setLoggedIn(false);
            }
        } catch(err) {
            console.log(err);
            return { success: false, error: "Internal error" }
        }
    }

    const getAllUsers = async () => {
        if (!client) return;
        const res = await client.queryUsers({ id: { $ne: user.id } }, { name: 1 });
        setAllUsers(res.users);
    }

    const createNewChannel = async (name, url, members) => {
        if (!name || !members || client == null) return;
        if (!url) url = "";
        const channel = client.channel('messaging', uuid(), {
            name,
            image: url,
            members: [user.id, ...members],
        });
        await channel.create();
    }

    let value = {
        user,
        token,
        client,
        signup,
        login,
        signout,
        createNewChannel,
        users
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}