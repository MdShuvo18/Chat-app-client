import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar bg-base-100">
            <div className="navbar-end gap-4">
                <Link to='/users/sign-in'>SignIn</Link>
                <Link to='/users/sign-up'>SignUp</Link>
            </div>
        </div>
    );
};

export default Navbar;