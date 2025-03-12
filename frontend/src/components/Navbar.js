import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; 

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 shadow-md">
      <h1 className="text-xl font-bold">AI Career</h1>
      <div className="flex items-center gap-4">
        <Link to="/profile">
        <FaUserCircle className="text-2xl hover:text-blue-500" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;