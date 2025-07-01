import { Link } from "react-router-dom";
export default function Header() {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-transparent px-6 py-4 flex items-center justify-between">
      <Link to="/home">
        <div className="text-white text-2xl font-bold tracking-wide flex items-center gap-3">
          <img className="h-8" src="../../../logo.jpeg" alt="Ember Guard" />
          EMBER GUARD
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/stats">
          <button className="bg-transparent border border-white text-white px-4 py-2 text-sm font-bold hover:bg-white hover:text-black transition-colors duration-200">
            STATS
          </button>
        </Link>
        <Link to="/login">
          <button className="bg-transparent border border-white text-white px-4 py-2 text-sm font-bold hover:bg-white hover:text-black transition-colors duration-200">
            Account
          </button>
        </Link>
        <Link to="/encryption">
          <button className="bg-transparent border border-white text-white px-4 py-2 text-sm font-bold hover:bg-white hover:text-black transition-colors duration-200">
            ENCRYPTION
          </button>
        </Link>
        <Link to="/decrypt">
          <button className="bg-transparent border border-white text-white px-4 py-2 text-sm font-bold hover:bg-white hover:text-black transition-colors duration-200">
            DECRYPTION
          </button>
        </Link>
      </div>
    </div>
  );
}
