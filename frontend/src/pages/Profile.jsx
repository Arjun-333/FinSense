import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, User as UserIcon, Mail, Camera, Save, LogOut } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleSave = () => {
        // Implement update logic here
        setIsEditing(false);
    };

    return (
        <div className="pb-24 pt-6 px-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                Profile
            </h1>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 text-center mb-4">
                <div className="relative w-24 h-24 mx-auto mb-4">
                     <div className="w-full h-full rounded-full bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-primary dark:text-indigo-400 text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-lg">
                        {user?.name?.[0]}
                    </div>
                </div>
                
                {isEditing ? (
                    <div className="space-y-4 text-left mt-6">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase ml-1">Full Name</label>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                                <UserIcon size={18} className="text-gray-400" />
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-transparent w-full outline-none text-gray-900 dark:text-white font-medium"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase ml-1">Email</label>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                                <Mail size={18} className="text-gray-400" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-transparent w-full outline-none text-gray-900 dark:text-white font-medium"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleSave}
                            className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">{email}</p>
                        
                        <button 
                             onClick={() => setIsEditing(true)}
                             className="py-2 px-6 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-sm"
                        >
                            Edit Profile
                        </button>
                    </>
                )}
            </div>

            {/* Settings Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden mb-6">
                <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-primary dark:text-indigo-400">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">Dark Mode</span>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-indigo-500' : 'bg-gray-200'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>
                
                <button 
                    onClick={logout}
                    className="w-full p-4 flex items-center gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                >
                    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <LogOut size={20} />
                    </div>
                    <span className="font-semibold">Sign Out</span>
                </button>
            </div>
            
            <p className="text-center text-xs text-gray-400 mt-8">FinSense v1.0.1 (By Arjun R)</p>
        </div>
    );
};

export default Profile;
