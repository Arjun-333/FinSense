import { useState } from 'react';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Moon, Sun, User as UserIcon, Mail, Camera, Save, LogOut, Download, Upload, Database } from 'lucide-react';
import LocalService from '../services/LocalService';

const Profile = () => {
    const { user, logout, updateProfile } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { addToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');

    const handleSave = async () => {
        try {
            await updateProfile({ name });
            addToast("Profile updated successfully", "success");
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            addToast("Failed to update profile", "error");
        }
    };

    const handleBackup = async () => {
        try {
            const data = LocalService.exportAllData();
            const fileName = `finsense_backup_${new Date().toISOString().split('T')[0]}.json`;

            try {
                // Try Native Share (Mobile)
                await Filesystem.writeFile({
                    path: fileName,
                    data: data,
                    directory: Directory.Cache,
                    encoding: Encoding.UTF8,
                });

                const uriResult = await Filesystem.getUri({
                    directory: Directory.Cache,
                    path: fileName,
                });

                await Share.share({
                    title: 'FinSense Backup',
                    url: uriResult.uri,
                    dialogTitle: 'Save Backup'
                });
                
                addToast("Backup ready to save/share", "success");
            } catch (nativeErr) {
                // Fallback to Web Download
                console.warn("Native share skipped, using web download:", nativeErr);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                addToast("Backup downloaded", "success");
            }
        } catch (e) {
            console.error(e);
            addToast("Failed to create backup", "error");
        }
    };

    const handleRestore = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                LocalService.importAllData(event.target.result);
                addToast("Data restored successfully! reloading...", "success");
                setTimeout(() => window.location.reload(), 1500);
            } catch (err) {
                addToast(err.message, "error");
            }
        };
        reader.readAsText(file);
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
                        
                        <button 
                             onClick={() => setIsEditing(true)}
                             className="py-2 px-6 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-full hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-sm mt-4"
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
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </span>
                    </div>
                    <button 
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-indigo-500' : 'bg-gray-200'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>

                <div className="border-b border-gray-100 dark:border-slate-700 p-4">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Data Management</h3>
                     <div className="flex gap-3">
                         <button 
                            onClick={handleBackup}
                            className="flex-1 py-3 px-4 bg-gray-50 dark:bg-slate-700 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                         >
                             <Download size={20} className="text-blue-500" />
                             <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Backup</span>
                         </button>
                         <label className="flex-1 py-3 px-4 bg-gray-50 dark:bg-slate-700 rounded-xl flex flex-col items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors cursor-pointer relative">
                             <Upload size={20} className="text-emerald-500" />
                             <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Restore</span>
                             <input type="file" accept=".json" onChange={handleRestore} className="absolute inset-0 opacity-0 cursor-pointer" />
                         </label>
                     </div>
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
