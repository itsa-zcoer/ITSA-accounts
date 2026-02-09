import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expenditureAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
    FiDollarSign,
    FiFileText,
    FiCalendar,
    FiCheck,
    FiPlus,
    FiTag,
    FiEdit3,
    FiTrendingUp,
    FiClock,
    FiArrowRight,
    FiPackage,
    FiTool,
    FiClipboard,
    FiStar,
    FiSettings,
    FiMoreHorizontal
} from 'react-icons/fi';
import { BiRupee } from 'react-icons/bi';

const AddExpenditure = () => {
    const [expenditures, setExpenditures] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Helper to get local datetime string for datetime-local input
    const getLocalDateTimeString = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localDate = new Date(now.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    };

    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        category: 'other',
        customCategory: '',
        senderName: '',
        receiverName: '',
        date: getLocalDateTimeString(),
        notes: ''
    });

    const categories = [
        { value: 'infrastructure', label: 'Infrastructure', icon: FiPackage, color: 'blue' },
        { value: 'equipment', label: 'Equipment', icon: FiTool, color: 'purple' },
        { value: 'stationery', label: 'Stationery', icon: FiClipboard, color: 'green' },
        { value: 'events', label: 'Events', icon: FiStar, color: 'pink' },
        { value: 'maintenance', label: 'Maintenance', icon: FiSettings, color: 'orange' },
        { value: 'other', label: 'Other', icon: FiMoreHorizontal, color: 'gray' }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [expResponse, summaryResponse] = await Promise.all([
                expenditureAPI.getAll({ limit: 8, sortBy: 'date', sortOrder: 'desc' }),
                expenditureAPI.getSummary()
            ]);
            setExpenditures(expResponse.data.data?.expenditures || []);
            setSummary(summaryResponse.data.data);
        } catch (err) {
            console.error('Failed to load expenditures:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (!formData.description.trim()) {
            setError('Please enter a description');
            return;
        }

        if (formData.category === 'other' && !formData.customCategory.trim()) {
            setError('Please enter a custom category name');
            return;
        }

        if (!formData.senderName.trim()) {
            setError('Please enter sender name');
            return;
        }

        if (!formData.receiverName.trim()) {
            setError('Please enter receiver name');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await expenditureAPI.add({
                amount: parseFloat(formData.amount),
                description: formData.description.trim(),
                category: formData.category === 'other' && formData.customCategory.trim() 
                    ? formData.customCategory.trim() 
                    : formData.category,
                senderName: formData.senderName.trim(),
                receiverName: formData.receiverName.trim(),
                date: formData.date,
                notes: formData.notes.trim() || undefined
            });

            setSuccess('Expenditure added successfully!');

            setFormData({
                amount: '',
                description: '',
                category: 'other',
                customCategory: '',
                senderName: '',
                receiverName: '',
                date: getLocalDateTimeString(),
                notes: ''
            });

            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expenditure. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        }

        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const getCategoryInfo = (categoryValue) => {
        const predefinedCategory = categories.find(c => c.value === categoryValue);
        if (predefinedCategory) {
            return predefinedCategory;
        }
        // For custom categories, return a custom info object with the actual category name
        return {
            value: categoryValue,
            label: categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1),
            icon: FiMoreHorizontal,
            color: 'gray'
        };
    };

    const getCategoryStyles = (category) => {
        const styles = {
            infrastructure: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'bg-blue-100', border: 'border-blue-200' },
            equipment: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'bg-purple-100', border: 'border-purple-200' },
            stationery: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'bg-emerald-100', border: 'border-emerald-200' },
            events: { bg: 'bg-pink-50', text: 'text-pink-700', icon: 'bg-pink-100', border: 'border-pink-200' },
            maintenance: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'bg-orange-100', border: 'border-orange-200' },
            other: { bg: 'bg-gray-50', text: 'text-gray-700', icon: 'bg-gray-100', border: 'border-gray-200' }
        };
        return styles[category] || styles.other;
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link>
                    <span>/</span>
                    <span className="text-gray-700">Expenditure</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Expenditure Management</h1>
                        <p className="text-gray-500 mt-1">Track and manage all financial expenditures</p>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                                <BiRupee className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Total Spent</p>
                                <p className="text-lg font-bold text-gray-800">{formatCurrency(summary.totalAmount)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                <FiTrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">This Month</p>
                                <p className="text-lg font-bold text-gray-800">{formatCurrency(summary.thisMonth)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <FiClock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Today</p>
                                <p className="text-lg font-bold text-gray-800">{formatCurrency(summary.today)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                                <FiFileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Records</p>
                                <p className="text-lg font-bold text-gray-800">{summary.count || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Add Expenditure Form - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <FiPlus className="w-5 h-5" />
                                Add New Expenditure
                            </h2>
                            <p className="text-primary-100 text-sm mt-1">Record a new expense entry</p>
                        </div>

                        <div className="p-6">
                            {success && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fadeIn">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiCheck className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-sm text-green-700 font-medium">{success}</span>
                                </div>
                            )}

                            {error && (
                                <div className="mb-6">
                                    <ErrorMessage message={error} onClose={() => setError('')} />
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Amount */}
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                                            <BiRupee className="w-4 h-4 text-primary-600" />
                                        </div>
                                        <input
                                            type="number"
                                            id="amount"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            min="1"
                                            step="1"
                                            className="w-full pl-16 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 
                                                   focus:ring-primary-500 focus:border-primary-500 text-gray-800 text-lg font-medium
                                                   placeholder-gray-400 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FiFileText className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="What was this expense for?"
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 
                                                   focus:ring-primary-500 focus:border-primary-500 text-gray-800
                                                   placeholder-gray-400 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Category Selection - Visual Cards */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Category
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {categories.map(cat => {
                                            const isSelected = formData.category === cat.value;
                                            const styles = getCategoryStyles(cat.value);
                                            const IconComponent = cat.icon;
                                            return (
                                                <button
                                                    key={cat.value}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                                                    className={`p-3 rounded-xl border-2 transition-all text-center ${isSelected
                                                        ? `${styles.bg} ${styles.border} ${styles.text} ring-2 ring-offset-1`
                                                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                    style={isSelected ? { ringColor: styles.border } : {}}
                                                >
                                                    <IconComponent className={`w-5 h-5 mx-auto mb-1 ${isSelected ? styles.text : 'text-gray-400'}`} />
                                                    <span className={`text-xs font-medium ${isSelected ? styles.text : 'text-gray-600'}`}>
                                                        {cat.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Custom Category Input - Only shown when Other is selected */}
                                    {formData.category === 'other' && (
                                        <div className="mt-3">
                                            <div className="relative">
                                                <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    id="customCategory"
                                                    name="customCategory"
                                                    value={formData.customCategory}
                                                    onChange={handleChange}
                                                    placeholder="Enter custom category"
                                                    className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 
                                                           focus:ring-primary-500 focus:border-primary-500 text-gray-800 text-sm
                                                           placeholder-gray-400 transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Transaction Details Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Transaction Details
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="senderName" className="block text-xs text-gray-500 mb-1.5">
                                                Sender Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    id="senderName"
                                                    name="senderName"
                                                    value={formData.senderName}
                                                    onChange={handleChange}
                                                    placeholder="Sender name"
                                                    className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 
                                                           focus:ring-primary-500 focus:border-primary-500 text-gray-800 text-sm
                                                           placeholder-gray-400 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="receiverName" className="block text-xs text-gray-500 mb-1.5">
                                                Receiver Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    id="receiverName"
                                                    name="receiverName"
                                                    value={formData.receiverName}
                                                    onChange={handleChange}
                                                    placeholder="Receiver name"
                                                    className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 
                                                           focus:ring-primary-500 focus:border-primary-500 text-gray-800 text-sm
                                                           placeholder-gray-400 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Date Field */}
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                        Date & Time
                                    </label>
                                    <div className="relative">
                                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="datetime-local"
                                            id="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            max={getLocalDateTimeString()}
                                            className="w-full pl-11 pr-2 py-2.5 border border-gray-200 rounded-xl focus:ring-2 
                                                   focus:ring-primary-500 focus:border-primary-500 text-gray-800 text-sm transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes <span className="text-gray-400">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <FiEdit3 className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            placeholder="Any additional details..."
                                            rows="2"
                                            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 
                                                   focus:ring-primary-500 focus:border-primary-500 text-gray-800 text-sm
                                                   placeholder-gray-400 resize-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r 
                                           from-primary-600 to-primary-700 text-white font-semibold rounded-xl 
                                           hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 
                                           disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-200/50
                                           transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Adding...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiPlus className="w-5 h-5" />
                                            <span>Add Expenditure</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Recent Expenditures - Takes 3 columns */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Recent Expenditures</h2>
                                <p className="text-sm text-gray-500">Latest transactions at a glance</p>
                            </div>
                            <Link
                                to="/admin/transactions"
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 
                                       hover:gap-2 transition-all"
                            >
                                View All <FiArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="p-12">
                                <Loading size="md" text="Loading expenditures..." />
                            </div>
                        ) : expenditures.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FiDollarSign className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 mb-1">No Expenditures Yet</h3>
                                <p className="text-gray-500 text-sm">Start by adding your first expense record</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {expenditures.map((exp, index) => {
                                    const catInfo = getCategoryInfo(exp.category);
                                    const styles = getCategoryStyles(exp.category);
                                    const IconComponent = catInfo.icon;

                                    return (
                                        <div
                                            key={exp._id}
                                            className="p-5 hover:bg-gray-50/50 transition-all group"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Category Icon */}
                                                <div className={`w-12 h-12 ${styles.icon} rounded-xl flex items-center justify-center 
                                                            flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                    <IconComponent className={`w-6 h-6 ${styles.text}`} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-gray-800 mb-0.5 truncate">
                                                                {exp.description}
                                                            </h3>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles.bg} ${styles.text}`}>
                                                                    {catInfo.label}
                                                                </span>
                                                                {exp.department && (
                                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                                                        {exp.department}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Amount */}
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-lg font-bold text-gray-800">
                                                                {formatCurrency(exp.amount)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Footer - Date & Notes */}
                                                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <FiClock className="w-3 h-3" />
                                                            {formatDate(exp.date)} at {formatTime(exp.date)}
                                                        </span>
                                                        {exp.notes && (
                                                            <span className="text-gray-400 truncate max-w-[200px]" title={exp.notes}>
                                                                • {exp.notes}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Footer with quick stats */}
                        {expenditures.length > 0 && (
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        Showing {expenditures.length} most recent entries
                                    </span>
                                    <Link
                                        to="/admin/transactions"
                                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                                    >
                                        View complete history <FiArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExpenditure;
