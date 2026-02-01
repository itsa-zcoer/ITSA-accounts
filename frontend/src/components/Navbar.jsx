import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiHome,
    FiSearch,
    FiLogOut,
    FiMenu,
    FiX,
    FiUser,
    FiTag,
    FiFileText,
    FiChevronDown,
    FiInfo,
    FiUsers
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showReports, setShowReports] = useState(false);
    const dropdownRef = useRef(null);
    const { admin, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: FiHome },
        { path: '/admin/students', label: 'Students', icon: FiUsers },
        { path: '/admin/fees-ledger', label: 'Fee Records', icon: FiFileText },
        { path: '/expenditure', label: 'Add Expense', icon: FaRupeeSign },
        { path: '/categories', label: 'Categories', icon: FiTag },
        { path: '/admin/transactions', label: 'Transactions', icon: FiFileText },
    ];

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowReports(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-gradient-to-r from-primary-700 to-primary-800 text-white shadow-lg sticky top-0 z-50">
            <div className="w-full px-2 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <span className="text-xl font-bold text-white">
                                <img src="/images/itsaLogo.jpeg" alt="logo" className="w-8 h-8 rounded-full object-cover" />
                            </span>
                        </div>
                        <span className="font-semibold text-lg hidden sm:block">
                            ITSA Accounts
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(link.path)
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{link.label}</span>
                                </Link>
                            );
                        })}



                        {/* About Link */}
                        <Link
                            to="/about"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive('/about')
                                ? 'bg-white/20 text-white'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <FiInfo className="w-4 h-4" />
                            <span className="text-sm font-medium">About</span>
                        </Link>
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/admin/settings"
                            className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                        >
                            <FiUser className="w-4 h-4" />
                            <span className="text-sm font-medium">{admin?.name || 'Admin'}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 
                         rounded-lg transition-colors duration-200"
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden bg-primary-800/95 backdrop-blur-sm border-t border-white/10">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive(link.path)
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/80 hover:bg-white/10'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            );
                        })}



                        <Link
                            to="/about"
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/about')
                                ? 'bg-white/20 text-white'
                                : 'text-white/80 hover:bg-white/10'
                                }`}
                        >
                            <FiInfo className="w-5 h-5" />
                            <span className="font-medium">About</span>
                        </Link>

                        <hr className="border-white/20 my-2" />
                        <div className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center space-x-2">
                                <FiUser className="w-5 h-5" />
                                <span className="font-medium">{admin?.name || 'Admin'}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-3 py-2 bg-red-500/80 hover:bg-red-500 
                           rounded-lg transition-colors"
                            >
                                <FiLogOut className="w-4 h-4" />
                                <span className="text-sm">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
