import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Form from "../Components/Form/Form";
import Dashboard from "../Components/Dashbord/Dashbord";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            { path: '/', element: <Dashboard /> },
            { path: '/users/sign-in', element: <Form isSignIn={true} /> },
            { path: '/users/sign-up', element: <Form isSignIn={false} /> }
        ]
    },
]);

export default router;