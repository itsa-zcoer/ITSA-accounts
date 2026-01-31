import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import {
    FiUser,
    FiMail,
    FiLock,
    FiSave,
    FiAlertCircle,
    FiCheck,
    FiEye,
    FiEyeOff,
    FiArrowLeft,
    FiSettings,
    FiTrash2,
    FiAlertTriangle,
    FiDatabase,
    FiX
} from 'react-icons/fi';

const SystemAdmin = () => {
    const { admin, isAuthenticated, updateAdmin } = useAuth();
    const navigate = useNavigate();

    // Profile state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // UI state
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Database reset state
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetStep, setResetStep] = useState(1); // 1: warning, 2: password, 3: confirmation
    const [resetPassword, setResetPassword] = useState('');
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [confirmationPhrase, setConfirmationPhrase] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login', { replace: true });
            return;
        }

        // Load admin data
        if (admin) {
            setName(admin.name || '');
            setEmail(admin.email || '');
        }
    }, [admin, isAuthenticated, navigate]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess('');

        if (!name.trim()) {
            setProfileError('Please enter a name');
            return;
        }

        setIsProfileLoading(true);

        try {
            const response = await authAPI.updateProfile({ name: name.trim() });
            // Update the admin context with the new name
            updateAdmin({ name: response.data.data.name });
            setProfileSuccess('Profile updated successfully');
        } catch (err) {
            setProfileError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsProfileLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (!currentPassword) {
            setPasswordError('Please enter your current password');
            return;
        }

        if (!newPassword) {
            setPasswordError('Please enter a new password');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        setIsPasswordLoading(true);

        try {
            const response = await authAPI.changePassword({
                currentPassword,
                newPassword
            });

            // Update token if returned
            if (response.data.data?.token) {
                localStorage.setItem('adminToken', response.data.data.token);
            }

            setPasswordSuccess('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setIsPasswordLoading(false);
        }
    };

    // Database reset handlers
    const openResetModal = () => {
        setShowResetModal(true);
        setResetStep(1);
        setResetPassword('');
        setConfirmationPhrase('');
        setResetError('');
        setResetSuccess(null);
    };

    const closeResetModal = () => {
        setShowResetModal(false);
        setResetStep(1);
        setResetPassword('');
        setConfirmationPhrase('');
        setResetError('');
        setShowResetPassword(false);
    };

    const handleDatabaseReset = async () => {
        if (resetStep === 1) {
            // Move to password verification step
            setResetStep(2);
            setResetError('');
            return;
        }

        if (resetStep === 2) {
            // Verify password is entered
            if (!resetPassword) {
                setResetError('Please enter your password');
                return;
            }

            // Verify password with server
            setIsResetting(true);
            setResetError('');

            try {
                await authAPI.verifyPassword(resetPassword);
                // Password verified, move to confirmation phrase step
                setResetStep(3);
            } catch (err) {
                setResetError(err.response?.data?.message || 'Password verification failed');
            } finally {
                setIsResetting(false);
            }
            return;
        }

        if (resetStep === 3) {
            // Verify confirmation phrase
            if (confirmationPhrase !== 'DELETE EVERYTHING') {
                setResetError('Please type "DELETE EVERYTHING" exactly as shown');
                return;
            }

            setIsResetting(true);
            setResetError('');

            try {
                const response = await authAPI.resetDatabase({
                    password: resetPassword,
                    confirmationPhrase: confirmationPhrase
                });

                setResetSuccess(response.data.data);
                setResetStep(4); // Success step
            } catch (err) {
                setResetError(err.response?.data?.message || 'Failed to reset database');
            } finally {
                setIsResetting(false);
            }
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                        <FiSettings className="w-8 h-8 text-primary-600" />
                        <span>System Admin</span>
                    </h1>
                    <p className="text-gray-600 mt-1">Manage your account settings</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 
                           bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                        <FiUser className="w-5 h-5 text-primary-600" />
                        <span>Profile Settings</span>
                    </h2>

                    {profileError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700">{profileError}</p>
                        </div>
                    )}

                    {profileSuccess && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
                            <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <p className="text-sm text-green-700">{profileSuccess}</p>
                        </div>
                    )}

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg 
                                           bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Email is configured in system settings</p>
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Display Name
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                                           text-gray-800 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isProfileLoading}
                            className="w-full flex items-center justify-center space-x-2 py-3 px-4 
                                   bg-primary-600 text-white font-medium rounded-lg 
                                   hover:bg-primary-700 focus:outline-none focus:ring-2 
                                   focus:ring-offset-2 focus:ring-primary-500 
                                   disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isProfileLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <FiSave className="w-5 h-5" />
                                    <span>Save Profile</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                        <FiLock className="w-5 h-5 text-primary-600" />
                        <span>Change Password</span>
                    </h2>

                    {passwordError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-700">{passwordError}</p>
                        </div>
                    )}

                    {passwordSuccess && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2">
                            <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <p className="text-sm text-green-700">{passwordSuccess}</p>
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                                           text-gray-800 placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimum 6 characters"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                                           text-gray-800 placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmNewPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter new password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                                           text-gray-800 placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPasswordLoading}
                            className="w-full flex items-center justify-center space-x-2 py-3 px-4 
                                   bg-primary-600 text-white font-medium rounded-lg 
                                   hover:bg-primary-700 focus:outline-none focus:ring-2 
                                   focus:ring-offset-2 focus:ring-primary-500 
                                   disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isPasswordLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Changing...</span>
                                </>
                            ) : (
                                <>
                                    <FiLock className="w-5 h-5" />
                                    <span>Change Password</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border-2 border-red-200 p-6">
                <h2 className="text-lg font-semibold text-red-700 mb-4 flex items-center space-x-2">
                    <FiAlertTriangle className="w-5 h-5" />
                    <span>Danger Zone</span>
                </h2>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="font-medium text-red-800 flex items-center space-x-2">
                                <FiDatabase className="w-4 h-4" />
                                <span>Reset Database for New Year</span>
                            </h3>
                            <p className="text-sm text-red-600 mt-1">
                                This will permanently delete <strong>all students, transactions, expenditures,
                                    fee ledger entries, and payment categories</strong>. This action cannot be undone.
                                Use this to start fresh for a new academic year.
                            </p>
                        </div>
                        <button
                            onClick={openResetModal}
                            className="ml-4 flex items-center space-x-2 px-4 py-2 bg-red-600 text-white 
                                   font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 
                                   focus:ring-offset-2 focus:ring-red-500 transition-all"
                        >
                            <FiTrash2 className="w-4 h-4" />
                            <span>Reset Database</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Reset Database Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
                        {/* Modal Header */}
                        <div className={`px-6 py-4 flex items-center justify-between ${resetStep === 4 ? 'bg-green-600' : 'bg-red-600'
                            }`}>
                            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                {resetStep === 4 ? (
                                    <>
                                        <FiCheck className="w-5 h-5" />
                                        <span>Database Reset Complete</span>
                                    </>
                                ) : (
                                    <>
                                        <FiAlertTriangle className="w-5 h-5" />
                                        <span>Reset Database</span>
                                    </>
                                )}
                            </h3>
                            <button
                                onClick={closeResetModal}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {resetError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                                    <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-sm text-red-700">{resetError}</p>
                                </div>
                            )}

                            {/* Step 1: Warning */}
                            {resetStep === 1 && (
                                <div className="space-y-4">
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <FiAlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-amber-800">Warning: Irreversible Action</p>
                                                <p className="text-sm text-amber-700 mt-1">
                                                    You are about to delete ALL data from the database. This includes:
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            <span>All student records and their fine history</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            <span>All expenditure records</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            <span>All fee ledger entries and payments</span>
                                        </li>
                                        <li className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                            <span>All payment categories</span>
                                        </li>
                                    </ul>

                                    <p className="text-sm text-gray-500 italic">
                                        Your admin account will be preserved.
                                    </p>
                                </div>
                            )}

                            {/* Step 2: Password Verification */}
                            {resetStep === 2 && (
                                <div className="space-y-4">
                                    <p className="text-gray-600">
                                        Enter your admin password to continue:
                                    </p>
                                    <div className="relative">
                                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showResetPassword ? "text" : "password"}
                                            value={resetPassword}
                                            onChange={(e) => setResetPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                                                   focus:ring-2 focus:ring-red-500 focus:border-red-500 
                                                   text-gray-800 placeholder-gray-400"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowResetPassword(!showResetPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showResetPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Confirmation Phrase */}
                            {resetStep === 3 && (
                                <div className="space-y-4">
                                    <p className="text-gray-600">
                                        To confirm, type <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-1 rounded">DELETE EVERYTHING</span> below:
                                    </p>
                                    <input
                                        type="text"
                                        value={confirmationPhrase}
                                        onChange={(e) => setConfirmationPhrase(e.target.value)}
                                        placeholder="Type confirmation phrase"
                                        className={`w-full px-4 py-3 border rounded-lg text-gray-800 placeholder-gray-400
                                               focus:ring-2 focus:border-transparent transition-all ${confirmationPhrase === 'DELETE EVERYTHING'
                                                ? 'border-green-500 focus:ring-green-500'
                                                : 'border-gray-300 focus:ring-red-500'
                                            }`}
                                        autoFocus
                                    />
                                    {confirmationPhrase && confirmationPhrase !== 'DELETE EVERYTHING' && (
                                        <p className="text-xs text-red-500">
                                            Type exactly as shown: DELETE EVERYTHING
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Step 4: Success */}
                            {resetStep === 4 && resetSuccess && (
                                <div className="space-y-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <FiCheck className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-green-800">Database Reset Successful</p>
                                                <p className="text-sm text-green-700 mt-1">
                                                    All data has been deleted. The system is ready for a fresh start.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Students deleted:</span>
                                            <span className="font-medium text-gray-800">{resetSuccess.studentsDeleted}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Expenditures deleted:</span>
                                            <span className="font-medium text-gray-800">{resetSuccess.expendituresDeleted}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Fee entries deleted:</span>
                                            <span className="font-medium text-gray-800">{resetSuccess.feeLedgerDeleted}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Categories deleted:</span>
                                            <span className="font-medium text-gray-800">{resetSuccess.categoriesDeleted}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                            {resetStep === 4 ? (
                                <button
                                    onClick={() => {
                                        closeResetModal();
                                        navigate('/dashboard');
                                    }}
                                    className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg 
                                           hover:bg-primary-700 transition-colors"
                                >
                                    Go to Dashboard
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={closeResetModal}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 
                                               bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDatabaseReset}
                                        disabled={isResetting || (resetStep === 3 && confirmationPhrase !== 'DELETE EVERYTHING')}
                                        className={`px-6 py-2 font-medium rounded-lg transition-all flex items-center space-x-2
                                               disabled:opacity-50 disabled:cursor-not-allowed ${resetStep === 1
                                                ? 'bg-amber-600 text-white hover:bg-amber-700'
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                    >
                                        {isResetting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>{resetStep === 2 ? 'Verifying...' : 'Resetting...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                {resetStep === 1 && <span>I Understand, Continue</span>}
                                                {resetStep === 2 && <span>Verify Password</span>}
                                                {resetStep === 3 && (
                                                    <>
                                                        <FiTrash2 className="w-4 h-4" />
                                                        <span>Delete Everything</span>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemAdmin;

