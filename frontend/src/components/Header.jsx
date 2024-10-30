import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-blue-600 text-white py-4 shadow-md">
      <nav className="container mx-auto flex justify-between">
        <h1 className="text-2xl font-bold">Procurement App</h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/suppliers" className="hover:underline">
              Suppliers
            </Link>
          </li>
          <li>
            <Link to="/items" className="hover:underline">
              Items
            </Link>
          </li>
          <li>
            <Link to="/purchase" className="hover:underline">
              Purchase Orders
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
