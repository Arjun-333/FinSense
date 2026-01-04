import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, logout } = useAuth();

    return (
        <div className="pb-24">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                User Profile
            </h1>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                     <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                        {user?.name?.[0]}
                    </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500 mb-6">{user?.email}</p>

                <div className="space-y-3">
                    <button className="w-full py-3 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                        Edit Profile
                    </button>
                    <button 
                        onClick={logout}
                        className="w-full py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
            
            <p className="text-center text-xs text-gray-400 mt-8">FinSense v1.0.0 (PWA Enabled)</p>
        </div>
    );
};

export default Profile;
