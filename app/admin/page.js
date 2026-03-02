"use client"
import React, { useState, useEffect, useCallback, Profiler, } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReportDetailView from './components/ReportDetailView';

const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>);
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const CloseIcon = ({ size = 24, strokeWidth = 2.5 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const CheckIcon = ({ size = 20, strokeWidth = 2.5 }) => (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
const HomeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const SparklesIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>);
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>);
const BuildingIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="18"></line><line x1="15" y1="22" x2="15" y2="18"></line><path d="M9 9h6v6H9z"></path><path d="M22 12h-4"></path><path d="M2 12h4"></path><path d="M12 2v2"></path><path d="M12 22v-2"></path></svg>);
const GridIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>);
const MapPinIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>);
const UserPlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const MailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>);
const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>);
const ShieldIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>);
// --- Sub-Components ---
const VerifiedBadgeIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#2b52c6e0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);
// --- Sub-Components ---

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const data = await authApi.getProfile();
                setProfileData(data.user);
            } catch (error) {
                toast.error(`Failed to fetch profile: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleEditToggle = () => {
        if (isEditing) {
            // TODO: Add API call to update profile data
            toast.success("Profile updated successfully!");
        }
        setIsEditing(!isEditing);
    };

    const InfoField = ({ icon, label, value, isEditing }) => (
        <div>
            <label className="text-sm font-semibold text-slate-500">{label}</label>
            <div className="flex items-center mt-1">
                <span className="text-slate-400">{icon}</span>
                {isEditing && (label === 'Full Name' || label === 'Phone Number') ? (
                    <input type="text" defaultValue={value} className="w-full ml-3 p-1 text-gray-800 rounded bg-slate-100 border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none" />
                ) : (
                    <p className="text-slate-800 ml-3 text-base">{value}</p>
                )}
            </div>
        </div>
    );

    if (isLoading) {
        return <div className="text-center p-10">Loading profile...</div>;
    }
    if (!profileData) {
        return <div className="text-center p-10 text-red-500">Could not load profile data.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Profile</h1>
            <p className="text-slate-500 mt-1">Manage your profile information and account settings.</p>
            <div className="w-full bg-white p-8 mt-8 rounded-xl shadow-md border border-slate-200">
                <div className="flex flex-col items-center text-center border-b border-slate-200 pb-6">
                    <img src={`https://ui-avatars.com/api/?name=${profileData.fullName}&background=random`} alt="Profile Avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-orange-100" />
                    <h2 className="mt-4 text-2xl font-bold text-slate-900">{profileData.fullName}</h2>
                    <p className="text-slate-600">{profileData.designation || 'Admin'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <InfoField icon={<MailIcon />} label="Email Address" value={profileData.email} />
                    <InfoField icon={<PhoneIcon />} label="Phone Number" value={profileData.phone} isEditing={isEditing} />
                    <InfoField icon={<BuildingIcon />} label="User Id" value={profileData.userId} />
                    <InfoField icon={<ShieldIcon />} label="Authority Level" value="Admin" />
                </div>
                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button onClick={handleEditToggle} className={`w-full py-2.5 px-5 font-semibold rounded-lg transition-colors ${isEditing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}>
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                    <button className="w-full py-2.5 px-5 font-semibold rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors">Change Password</button>
                </div>
            </div>
        </div>
    );
};//ADDED THIS PAGE TO SEE THE PROFILE PAGE AFTER CLICKING PROFILE IN SIDEBAR


const Sidebar = ({ isOpen, onClose, pendingCount, approvedCount, rejectedCount, currentView, setCurrentView, onLogout }) => {
    const reportNavItems = [
        { id: 'pending', label: 'Pending Reports', icon: <HomeIcon /> },
        { id: 'verified', label: 'Verified Reports', icon: <CheckIcon size={20} /> },
        { id: 'rejected', label: 'Rejected Reports', icon: <CloseIcon size={20} /> },
    ];
    const managementNavItems = [
        { id: 'registerMunicipality', label: 'Register Municipality', icon: <BuildingIcon /> },
        { id: 'registerWard', label: 'Register Ward', icon: <GridIcon /> },
        { id: 'locateWard', label: 'Locate Ward', icon: <MapPinIcon /> },
        { id: 'addAdminHead', label: 'Add Admin Head', icon: <UserPlusIcon /> },
        { id: 'addAdmin', label: 'Add Admin', icon: <UserPlusIcon /> },
        { id: 'profile', label: 'Profile', icon: <UserIcon /> },
    ];

    return (
        <>
            <AnimatePresence>
                {isOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />)}
            </AnimatePresence>
            <aside className={`bg-white text-slate-700 max-w-1/5 min-w-64 fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 h-16 border-b border-slate-200 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <Image
                            src="/images/logo.png"
                            alt="Civic Saathi Logo"
                            width={100}
                            height={100}
                            className="w-[12vw] h-[12vw] md:w-[3.5vw] md:h-[3.5vw]"
                        />
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Civic साथी</h1>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors lg:hidden" aria-label="Close menu"><CloseIcon size={22} /></button>
                </div>
                <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
                    <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reports</h3>
                    {reportNavItems.map(item => (<button key={item.id} onClick={() => { setCurrentView(item.id); onClose(); }} className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center ${currentView === item.id ? 'bg-orange-100 text-orange-800 font-semibold' : 'hover:bg-slate-100'}`}><span className="mr-3">{item.icon}</span>{item.label}</button>))}
                    <h3 className="px-2 pt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Management</h3>
                    {managementNavItems.map(item => (<button key={item.id} onClick={() => { setCurrentView(item.id); onClose(); }} className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center ${currentView === item.id ? 'bg-orange-100 text-orange-800 font-semibold' : 'hover:bg-slate-100'}`}><span className="mr-3">{item.icon}</span>{item.label}</button>))}
                </nav>
                <div className="p-4 border-t border-slate-200 flex-shrink-0">
                    <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Statistics</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-blue-50 p-3 rounded-lg text-center"><div className="text-2xl font-bold text-blue-600">{pendingCount}</div><div className="text-xs text-blue-500 mt-1">Pending</div></div>
                        <div className="bg-green-50 p-3 rounded-lg text-center"><div className="text-2xl font-bold text-green-600">{approvedCount}</div><div className="text-xs text-green-500 mt-1">Approved</div></div>
                        <div className="bg-red-50 p-3 rounded-lg text-center"><div className="text-2xl font-bold text-red-600">{rejectedCount}</div><div className="text-xs text-red-500 mt-1">Rejected</div></div>
                    </div>
                    <button className="w-full mt-4 text-left px-3 py-2.5 rounded-lg transition-colors flex items-center text-slate-600 hover:bg-slate-100" onClick={onLogout}><span className="mr-3"><LogoutIcon /></span>Logout</button>
                </div>
            </aside>
        </>
    );
};

const Header = ({ onOpenMenu }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 lg:hidden">
        <div className="max-w-6xl mx-auto px-4"><div className="flex items-center justify-between h-16 border-b border-slate-200"><h1 className="text-xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h1><button onClick={onOpenMenu} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors" aria-label="Open menu"><MenuIcon /></button></div></div>
    </header>
);

const IssueCard = ({ issue, onSelect, onApprove, onReject }) => (
    <div onClick={() => onSelect(issue)} className={`group p-4 rounded-2xl shadow-sm border border-slate-200 cursor-pointer flex items-center space-x-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 ${issue.verified === true ? "bg-green-50" : "bg-white"}`}>
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100"><img src={issue.image} alt={issue.Description} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" /></div>
        <div className="flex-grow"><p className="font-semibold text-slate-800">{issue.Description} </p><p className="text-sm text-slate-500 mt-1">{issue.Title} • Reported by: {issue.ReporterName || 'Anonymous'}</p></div>
        {issue.verified ? <abbr title='Ai verified'><VerifiedBadgeIcon /></abbr> : ''}
        <div className="flex-shrink-0 flex items-center space-x-2">
            <button onClick={(e) => { e.stopPropagation(); onReject(issue); }} className="p-3 rounded-full text-white bg-red-500 hover:bg-red-600 transition-all duration-200 transform hover:scale-110" aria-label="Reject issue"><CloseIcon size={18} /></button>
            <button onClick={(e) => { e.stopPropagation(); onApprove(issue); }} className="p-3 rounded-full text-white bg-green-500 hover:bg-green-600 transition-all duration-200 transform hover:scale-110" aria-label="Approve issue"><CheckIcon size={18} /></button>
        </div>
    </div>
);

const ArchivedIssueCard = ({ issue, onSelect, onMakePending }) => {
    const isApproved = issue.status === 'verified';
    return (
        <div onClick={() => onSelect(issue)} className={`p-4 rounded-2xl shadow-sm border cursor-pointer flex items-center space-x-4 transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-0.5 ${isApproved ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
            <div className="flex-grow">
                <p className={`font-semibold ${isApproved ? 'text-green-900' : 'text-slate-800'} ${issue.status === 'rejected' ? 'line-through' : ''}`}>{issue.Description}</p>
                {issue.status === 'rejected' && issue.rejectionReason && (<p className="text-sm text-red-600 mt-1">Reason: {issue.rejectionReason}</p>)}
            </div>
            <div className="flex-shrink-0 flex items-center space-x-3">
                <button onClick={(e) => { e.stopPropagation(); onMakePending(issue._id); }} className="text-sm px-3 py-1 rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors">Make Pending</button>
                {isApproved && <div className="p-2 rounded-full bg-green-500 text-white"><CheckIcon size={16} /></div>}
                {issue.status === 'rejected' && <div className="p-2 rounded-full bg-red-500 text-white"><CloseIcon size={16} /></div>}
            </div>
        </div>
    );
};

const getSeverityClasses = (severity) => {
    switch (severity) {
        case 'High': return 'bg-red-100 text-red-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'Low': return 'bg-green-100 text-green-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const IssueDetailModal = ({ issue, onClose, onImageClick, file, onGenerateSummary, aiSummary, isGeneratingSummary }) => {
    if (!issue) return null;
    const formattedDate = new Date(issue.timeOfReporting || issue.reportedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
    const handleOpenMap = () => {
        let url;
        if (issue.locationCoordinates?.coordinates) url = `https://www.google.com/maps?q=${issue.locationCoordinates.coordinates[1]},${issue.locationCoordinates.coordinates[0]}`;
        else if (issue.address) url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(issue.address)}`;
        if (url) window.open(url, "_blank");
    };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
                <div className="p-2 bg-slate-50 relative"><img src={issue.image} alt="Issue" onClick={async () => { onImageClick(issue.image) }} className="w-full h-64 object-cover rounded-xl cursor-pointer" /><button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-2 z-10" aria-label="Close"><CloseIcon size={22} strokeWidth={3} /></button></div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div><p className="font-semibold text-slate-500">Reported On</p><p className="text-slate-900">{formattedDate}</p></div>
                        <div><p className="font-semibold text-slate-500">Issue Type</p><p className="text-slate-900">{issue.Title}</p></div>
                        <div><p className="font-semibold text-slate-500">Severity</p><span className={`px-2 py-1 rounded-full font-medium text-xs ${getSeverityClasses(issue.severity)}`}>{issue.severity}</span></div>
                        <div><p className="font-semibold text-slate-500">Ward No</p><p className="text-slate-900">{issue.ward}</p></div>
                    </div>
                    <div className="border-t border-slate-200 pt-4"><h3 className="text-lg font-bold mb-2 text-slate-900">Description</h3><p className="text-slate-600 text-base h-24 overflow-y-auto pr-2">{issue.Description}</p></div>
                    <div className="border-t border-slate-200 pt-4 mt-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">AI Summary</h3>
                            <button onClick={() => onGenerateSummary(issue.Description)} disabled={isGeneratingSummary} className="flex items-center text-sm font-semibold text-orange-600 hover:text-orange-800 disabled:text-slate-400 disabled:cursor-wait transition-colors"><SparklesIcon className={`mr-2 h-5 w-5 ${isGeneratingSummary ? 'animate-spin' : ''}`} />{isGeneratingSummary ? 'Generating...' : 'Generate with AI'}</button>
                        </div>
                        {aiSummary && <div className="mt-2 text-slate-600 bg-orange-50 p-3 rounded-lg border border-orange-200">{aiSummary}</div>}
                    </div>
                    {(issue.locationCoordinates || issue.address) ? <div className="mt-6"><button onClick={handleOpenMap} className="w-full bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700">View on Map</button></div> : null}
                </div>
            </motion.div>
        </motion.div>
    );
};

const RejectionModal = ({ issue, onConfirm, onCancel, onSuggestReason, isSuggesting, suggestedReason }) => {
    const [reason, setReason] = React.useState('');
    React.useEffect(() => { if (suggestedReason) setReason(suggestedReason); }, [suggestedReason]);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onCancel}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-900">Reason for Rejection</h3>
                    <button onClick={() => onSuggestReason(issue.Description)} disabled={isSuggesting} className="flex items-center text-sm font-semibold text-orange-600 hover:text-orange-800 disabled:text-slate-400"><SparklesIcon className={`mr-2 h-5 w-5 ${isSuggesting ? 'animate-spin' : ''}`} />{isSuggesting ? 'Thinking...' : 'Suggest Reason'}</button>
                </div>
                <p className="text-sm text-slate-600 mb-3">Rejecting report: <span className="font-medium">"{issue.Description}"</span></p>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., Duplicate report, insufficient information..." className="w-full text-black h-28 p-3 rounded-lg bg-slate-100 border border-slate-300"></textarea>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onCancel} className="px-5 py-2.5 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold">Cancel</button>
                    <button onClick={() => onConfirm(reason)} disabled={!reason.trim()} className="px-5 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:bg-red-300">Confirm Rejection</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ApprovalModal = ({ issue, onConfirm, onCancel }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onCancel}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6">
            <h3 className="text-xl font-bold mb-4 text-slate-900">Confirm Approval</h3>
            <p className="text-sm text-slate-600 mb-3">Are you sure you want to approve this report?</p>
            <div className="bg-slate-100 p-4 rounded-lg mb-4"><p className="font-medium text-slate-800">{issue.Description}</p><p className="text-sm text-slate-600 mt-1">Reported by: {issue.ReporterName || 'Anonymous'}</p></div>
            <div className="mt-6 flex justify-end space-x-3">
                <button onClick={onCancel} className="px-5 py-2.5 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold">Cancel</button>
                <button onClick={onConfirm} className="px-5 py-2.5 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600">Confirm Approval</button>
            </div>
        </motion.div>
    </motion.div>
);

// const ImageFullscreenModal = ({ imageUrl, onClose }) => {
//     const panoramaRef = React.useRef(null);
//     React.useEffect(() => {
//         if (!imageUrl || !panoramaRef.current || !window.pannellum) return;
//         const viewer = window.pannellum.viewer(panoramaRef.current, { type: "equirectangular", panorama: imageUrl, autoLoad: true, showZoomCtrl: false, showFullscreenCtrl: false });
//         return () => { viewer.destroy(); };
//     }, [imageUrl]);
//     if (!imageUrl) return null;
//     return (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50">
//             <button onClick={onClose} className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 z-10"><CloseIcon strokeWidth={3} /></button>
//             <div ref={panoramaRef} style={{ width: "100vw", height: "100vh" }} />
//         </motion.div>
//     );
// };

const MediaFullscreenModal = ({ imageUrl, fileType, onClose }) => {//ADDED THIS TO INCLUDE BOTH IMAGES AND VIDEOS
    const panoramaRef = React.useRef(null);

    React.useEffect(() => {
        if (!imageUrl || !panoramaRef.current || !window.pannellum) return;
        const viewer = window.pannellum.viewer(panoramaRef.current, { type: "equirectangular", panorama: imageUrl, autoLoad: true, showZoomCtrl: false, showFullscreenCtrl: false });
        return () => { viewer.destroy(); };
    }, [imageUrl]);

    if (!imageUrl) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50" onClick={onClose}>
            <button onClick={onClose} className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 z-10"><CloseIcon strokeWidth={3} /></button>
            {fileType === 'video' ? (
                <video src={imageUrl} controls autoPlay className="max-w-full max-h-full" onClick={(e) => e.stopPropagation()} />
            ) : (
                // <div ref={panoramaRef} style={{ width: "100vw", height: "100vh" }} />
                <div ref={panoramaRef} style={{ width: "100vw", height: "100vh" }} onClick={(e) => e.stopPropagation()} />
            )}
        </motion.div>
    );
};


const RegisterMunicipalityPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-slate-800">Register Municipality</h1>
        <p className="text-slate-500 mt-1">This page will contain a form to register a new municipality.</p>
        <div className="mt-8 p-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
            <p className="text-center text-slate-400">Municipality Registration Form coming soon.</p>
        </div>
    </div>
);

const RegisterWardPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-slate-800">Register Ward</h1>
        <p className="text-slate-500 mt-1">This page will contain a form to register a new ward within a municipality.</p>
        <div className="mt-8 p-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
            <p className="text-center text-slate-400">Ward Registration Form coming soon.</p>
        </div>
    </div>
);

const LocateWardPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-slate-800">Locate Ward</h1>
        <p className="text-slate-500 mt-1">This page will feature a map to locate and view details of registered wards.</p>
        <div className="mt-8 p-8 border border-dashed border-slate-300 rounded-lg bg-slate-50 h-96 flex items-center justify-center">
            <p className="text-center text-slate-400">Interactive Map coming soon.</p>
        </div>
    </div>
);

const RegisterAdminHeadPage = () => {
    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        designation: '',
        authority: '',
        municipality: '',
        password: '',
    });
    const [errors, setErrors] = React.useState({});
    const [apiError, setApiError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const authorityCategory = ['High', 'Medium', 'Low'];

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        // Clear the specific error when the user starts typing
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    // --- VALIDATION ---
    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be exactly 10 digits';
        if (!formData.age) newErrors.age = 'Age is required';
        else if (isNaN(formData.age) || formData.age < 18) newErrors.age = 'Must be a number and at least 18 years old';
        if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
        if (!formData.authority) newErrors.authority = 'Please select an authority level';
        if (!formData.municipality.trim()) newErrors.municipality = 'Municipality is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';

        return newErrors;
    };

    // --- FORM SUBMISSION ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(''); // Reset previous API errors
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                // The API call uses the entire formData object
                await authApi.administrationSignup(formData);
                toast.success('Administrative Head registered successfully!');
                // Reset form on success
                setFormData({ fullName: '', email: '', phone: '', age: '', designation: '', authority: '', municipality: '', password: '' });
            } catch (error) {
                const errorMessage = error.message || 'Failed to register admin head. Please try again.';
                toast.error(errorMessage);
                setApiError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.error("Please correct the errors in the form.");
        }
    };

    // --- RENDER ---
    return (
        <div className='text-gray-600'>
            <h1 className="text-3xl font-bold text-slate-800">Add Administrative Head</h1>
            <p className="text-slate-500 mt-1">Create a new administrative head account for a municipality.</p>
            <div className="w-full max-w-2xl bg-white p-8 mt-8 rounded-xl shadow-md border border-slate-200">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* --- Dynamic Input Fields --- */}
                    {Object.entries({
                        fullName: { label: 'Full Name', type: 'text', placeholder: 'e.g., Jane Doe' },
                        email: { label: 'Email Address', type: 'email', placeholder: 'e.g., jane.doe@example.com' },
                        phone: { label: 'Phone Number', type: 'tel', placeholder: 'e.g., 9876543210' },
                        age: { label: 'Age', type: 'number', placeholder: 'e.g., 45' },
                        designation: { label: 'Designation', type: 'text', placeholder: 'e.g., Municipal Commissioner' },
                        municipality: { label: 'Municipality', type: 'text', placeholder: 'e.g., Kolkata Municipal Corporation' },
                        password: { label: 'Password', type: 'password', placeholder: '••••••••' },
                    }).map(([id, { label, type, placeholder }]) => (
                        <div key={id}>
                            <label htmlFor={id} className="font-medium text-slate-700">{label}</label>
                            <input
                                id={id}
                                type={type}
                                placeholder={placeholder}
                                value={formData[id]}
                                onChange={handleChange}
                                className={`w-full mt-2 p-3 border rounded-md outline-none focus:ring-2 ${errors[id] ? 'border-red-500 ring-red-300' : 'border-slate-300 focus:ring-orange-500 focus:border-orange-500'}`}
                                disabled={isLoading}
                            />
                            {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
                        </div>
                    ))}

                    <div>
                        <label htmlFor="authority" className="font-medium text-slate-700">Authority Level</label>
                        <select
                            id="authority"
                            value={formData.authority}
                            onChange={handleChange}
                            className={`w-full mt-2 p-3 border rounded-md outline-none focus:ring-2 bg-white ${errors.authority ? 'border-red-500 ring-red-300' : 'border-slate-300 focus:ring-orange-500 focus:border-orange-500'}`}
                            disabled={isLoading}
                        >
                            <option value="">Select an authority level</option>
                            {authorityCategory.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        {errors.authority && <p className="text-red-500 text-sm mt-1">{errors.authority}</p>}
                    </div>

                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                            <span className="block sm:inline">{apiError}</span>
                        </div>
                    )}


                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition flex justify-center items-center disabled:bg-orange-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </>
                        ) : 'Register Administrative Head'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const RegisterAdminPage = () => {
    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        address: '',
        password: '',
    });
    const [errors, setErrors] = React.useState({});
    const [apiError, setApiError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const authorityCategory = ['High', 'Medium', 'Low'];

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        // Clear the specific error when the user starts typing
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    // --- VALIDATION ---
    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be exactly 10 digits';
        if (!formData.age) newErrors.age = 'Age is required';
        else if (isNaN(formData.age) || formData.age < 18) newErrors.age = 'Must be a number and at least 18 years old';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';

        return newErrors;
    };

    // --- FORM SUBMISSION ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(''); // Reset previous API errors
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                // The API call uses the entire formData object
                await authApi.adminSignup(formData);
                toast.success('Administrative Head registered successfully!');
                // Reset form on success
                setFormData({ fullName: '', email: '', phone: '', age: '', address: '', password: '' });
            } catch (error) {
                const errorMessage = error.message || 'Failed to register admin head. Please try again.';
                toast.error(errorMessage);
                setApiError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.error("Please correct the errors in the form.");
        }
    };

    // --- RENDER ---
    return (
        <div className='text-gray-600'>
            <h1 className="text-3xl font-bold text-slate-800">Add Admin</h1>
            <p className="text-slate-500 mt-1">Create a new administrative head account for a municipality.</p>
            <div className="w-full max-w-2xl bg-white p-8 mt-8 rounded-xl shadow-md border border-slate-200">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* --- Dynamic Input Fields --- */}
                    {Object.entries({
                        fullName: { label: 'Full Name', type: 'text', placeholder: 'e.g., Jane Doe' },
                        email: { label: 'Email Address', type: 'email', placeholder: 'e.g., jane.doe@example.com' },
                        phone: { label: 'Phone Number', type: 'tel', placeholder: 'e.g., 1212121212' },
                        age: { label: 'Age', type: 'number', placeholder: 'e.g., 45' },
                        password: { label: 'Password', type: 'password', placeholder: '••••••••' },
                        address: { label: 'Address', type: 'text', placeholder: 'e.g., Kolkata, WestBangal' }
                    }).map(([id, { label, type, placeholder }]) => (
                        <div key={id}>
                            <label htmlFor={id} className="font-medium text-slate-700">{label}</label>
                            <input
                                id={id}
                                type={type}
                                placeholder={placeholder}
                                value={formData[id]}
                                onChange={handleChange}
                                className={`w-full mt-2 p-3 border rounded-md outline-none focus:ring-2 ${errors[id] ? 'border-red-500 ring-red-300' : 'border-slate-300 focus:ring-orange-500 focus:border-orange-500'}`}
                                disabled={isLoading}
                            />
                            {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
                        </div>
                    ))}

                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                            <span className="block sm:inline">{apiError}</span>
                        </div>
                    )}


                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition flex justify-center items-center disabled:bg-orange-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </>
                        ) : 'Register Administrative Head'}
                    </button>
                </form>
            </div>
        </div>
    );
};



export default function AdminDashboardPage() {
    const router = useRouter();
    const [allIssues, setAllIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [fullscreenImageUrl, setFullscreenImageUrl] = useState(null);
    const [fileType, setFileType] = useState('');
    const [rejectionTarget, setRejectionTarget] = useState(null);
    const [approvalTarget, setApprovalTarget] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentView, setCurrentView] = useState('pending');
    const [sortOrder, setSortOrder] = useState('newest');
    const [filterBy, setFilterBy] = useState('none');
    const [filterValue, setFilterValue] = useState('');
    const [aiSummary, setAiSummary] = useState('');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [suggestedReason, setSuggestedReason] = useState('');
    const [isSuggestingReason, setIsSuggestingReason] = useState(false);
    const [profile, setProfile] = useState([]);

    // --- Data Fetching ---
    const fetchAllIssues = useCallback(async () => {
        setIsLoading(true);
        try {
            const prof = await authApi.getProfile();
            setProfile(prof || []);
        } catch (error) {
            router.replace('/')
        } finally {

            try {
                const issuesFromDb = await authApi.getReports();
                setAllIssues(issuesFromDb.reports || []);
                console.log(allIssues)

            } catch (error) {
                toast.error(`Failed to fetch issues: ${error.message}`);
                setAllIssues([]);
            } finally {
                setIsLoading(false);
            }
        }

    }, []);

    const handleLogout = useCallback(() => {
        authApi.logout(); // This function from lib/auth clears cookies
        toast.success("You have been logged out.");
        router.push('/'); // Redirect to admin login page
    }, [router]);

    useEffect(() => {
        fetchAllIssues();
    }, [fetchAllIssues]);

    useEffect(() => { console.log("Current master issue list:", allIssues); }, [allIssues]);

    const callGeminiAPI = async (prompt) => {
        console.log(prompt)
        const apiKey = "AIzaSyBbeBGU73nXaJ26DtLp7vj_2_aEg60lAHg";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        try {
            const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const result = await response.json();
            return result.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate a response.";
        } catch (error) {
            console.error("Gemini API call failed:", error);
            return "Failed to get a response from AI.";
        }
    };

    const handleGenerateSummary = async (description) => {
        setIsGeneratingSummary(true);
        setAiSummary('');
        const prompt = `Summarize the following civic issue report into one concise, professional sentence: ${description}`;
        const summary = await callGeminiAPI(prompt);
        setAiSummary(summary);
        setIsGeneratingSummary(false);
    };

    const handleSuggestReason = async (description) => {
        setIsSuggestingReason(true);
        setSuggestedReason('');
        const prompt = `Based on the following civic issue report, suggest a brief, professional reason for rejection. The reason should be suitable for a citizen's portal. Issue: "${description}"`;
        const reason = await callGeminiAPI(prompt);
        setSuggestedReason(reason);
        setIsSuggestingReason(false);
    };

    React.useEffect(() => { if (!selectedIssue) setAiSummary(''); }, [selectedIssue]);

    const updateIssueStatusInApi = async (issue, newStatus, reason = null) => {
        const originalIssues = [...allIssues];
        const uiStatus = newStatus;
        const updatedIssues = allIssues.map(i => i._id === issue._id ? { ...i, status: uiStatus, rejectionReason: reason } : i);
        setAllIssues(updatedIssues);
        try {
            await authApi.updateReportStatus(issue._id, newStatus, reason);
            toast.success(`Report has been updated to ${newStatus}.`);
        } catch (error) {
            toast.error(`Failed to update report: ${error.message}`);
            setAllIssues(originalIssues);
        }
    };

    const handleConfirmApproval = () => {
        if (!approvalTarget) return;
        updateIssueStatusInApi(approvalTarget, 'verified');
        setApprovalTarget(null);
    };

    const handleConfirmRejection = (reason) => {
        if (!rejectionTarget) return;
        updateIssueStatusInApi(rejectionTarget, 'rejected', reason);
        setRejectionTarget(null);
    };

    const handleMakePending = (issueId) => {
        const issueToUpdate = allIssues.find(i => i._id === issueId);
        if (issueToUpdate) updateIssueStatusInApi(issueToUpdate, 'pending');
    };

    const filteredAndSortedIssues = React.useMemo(() => {
        const statusToFilter = currentView === 'verified' ? 'verified' : currentView;
        let list = allIssues.filter(issue => issue.status === statusToFilter);
        console.log(list)

        const trimmedFilter = filterValue.trim().toLowerCase();
        if (trimmedFilter) {
            const filterKey = filterBy === 'reporter' ? 'ReporterName' : filterBy;
            if (filterBy !== 'none') {
                list = list.filter(i => String(i[filterKey] || '').toLowerCase().includes(trimmedFilter));
            } else {
                list = list.filter(i => Object.values(i).some(val => String(val).toLowerCase().includes(trimmedFilter)));
            }
        }
        return list.sort((a, b) => {
            const dateA = new Date(a.timeOfReporting || a.reportedAt || 0).getTime();
            const dateB = new Date(b.timeOfReporting || b.reportedAt || 0).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [allIssues, currentView, filterValue, filterBy, sortOrder]);

    const renderCurrentView = () => {
        if (isLoading && allIssues.length === 0) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center text-slate-500">
                        <svg className="animate-spin mx-auto h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p className="mt-4">Loading Reports...</p>
                    </div>
                </div>
            );
        }

        const reportViews = ['pending', 'verified', 'rejected'];
        if (reportViews.includes(currentView)) {
            // Show detail card if a report is selected, otherwise show the list
            if (selectedIssue) {
                return (
                    <ReportDetailView 
                        report={selectedIssue} 
                        onClose={() => setSelectedIssue(null)} 
                        userRole="admin"
                        onApprove={() => {
                            updateIssueStatusInApi(selectedIssue, 'verified');
                            setSelectedIssue(null);
                        }}
                        onReject={(reason) => {
                            if (selectedIssue.status === 'rejected') {
                                // Convert rejected to pending directly
                                updateIssueStatusInApi(selectedIssue, 'pending');
                                setSelectedIssue(null);
                            } else {
                                // For pending reports, set for rejection (will show modal)
                                setRejectionTarget(selectedIssue);
                                setSelectedIssue(null);
                            }
                        }}
                    />
                );
            }
            return (
                <>
                    <div className="flex text-gray-500 flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div><h1 className="text-3xl font-bold text-slate-800">{currentView.charAt(0).toUpperCase() + currentView.slice(1)} Reports</h1><p className="text-slate-500 mt-1">Manage and filter the reports below.</p></div>
                        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-2"><label className="text-sm text-slate-600 shrink-0">Filter By</label><select value={filterBy} onChange={e => { setFilterBy(e.target.value); setFilterValue(''); }} className="px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"><option value="none">All Fields</option><option value="ward">Ward</option><option value="reporter">Reporter</option></select></div>
                            <div className="relative w-full sm:w-auto"><input value={filterValue} onChange={e => setFilterValue(e.target.value)} placeholder={`Search...`} className="pl-10 pr-4 py-2 w-full sm:w-48 rounded-md border border-slate-300 bg-white" /><svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
                            <div className="flex items-center space-x-2"><label className="text-sm text-slate-600">Sort</label><select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="px-3 py-2 rounded-md border border-slate-300 bg-white text-sm text-slate-900 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="newest">Newest</option><option value="oldest">Oldest</option></select></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {filteredAndSortedIssues.length > 0 ? (
                            filteredAndSortedIssues.map(issue => {
                                if (currentView === 'pending') {
                                    return <IssueCard key={issue._id} issue={issue} onSelect={setSelectedIssue} onApprove={setApprovalTarget} onReject={setRejectionTarget} />;
                                }
                                return <ArchivedIssueCard key={issue._id} issue={issue} onSelect={setSelectedIssue} onMakePending={handleMakePending} />;
                            })
                        ) : (
                            <div className="text-center py-12 text-slate-500"><p>No reports found for this category or filter.</p></div>
                        )}
                    </div>
                </>
            );
        }

        switch (currentView) {
            case 'registerMunicipality': return <div><RegisterMunicipalityPage /></div>;
            case 'registerWard': return <div><RegisterWardPage /></div>;
            case 'locateWard': return <div><LocateWardPage /></div>;
            case 'addAdminHead': return <div><RegisterAdminHeadPage /></div>;
            case 'addAdmin': return <div><RegisterAdminPage /></div>;
            case 'profile': return <div><ProfilePage profile={profile} /></div>;
            default: return null;
        }
    };

    return (
        <div className="relative min-h-screen lg:flex bg-slate-50">
            <Sidebar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                pendingCount={allIssues.filter(i => i.status === 'pending').length}
                approvedCount={allIssues.filter(i => i.status === 'verified').length}
                rejectedCount={allIssues.filter(i => i.status === 'rejected').length}
                currentView={currentView}
                setCurrentView={setCurrentView}
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col lg:ml-64">
                <Header onOpenMenu={() => setIsMenuOpen(true)} />
                <main className="flex-grow max-w-6xl mx-auto p-4 md:p-8 w-full">
                    {renderCurrentView()}
                </main>
            </div>
            <AnimatePresence>
                {fullscreenImageUrl && (
                    <MediaFullscreenModal
                        key="fullscreen-media" // Unique key for this modal
                        imageUrl={fullscreenImageUrl}
                        fileType={fileType}
                        onClose={() => setFullscreenImageUrl(null)}
                    />
                )}
                {rejectionTarget && (
                    <RejectionModal
                        key={`reject-${rejectionTarget._id}`} // Unique key for this modal
                        issue={rejectionTarget}
                        onCancel={() => setRejectionTarget(null)}
                        onConfirm={handleConfirmRejection}
                        onSuggestReason={handleSuggestReason}
                        isSuggesting={isSuggestingReason}
                        suggestedReason={suggestedReason}
                    />
                )}
                {approvalTarget && (
                    <ApprovalModal
                        key={`approve-${approvalTarget._id}`} // Unique key for this modal
                        issue={approvalTarget}
                        onCancel={() => setApprovalTarget(null)}
                        onConfirm={handleConfirmApproval}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

/*
"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
// import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';


const StarIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> );
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg> );
const CloseIcon = ({ size = 24, strokeWidth = 2.5 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> );
const CheckIcon = ({ size = 20, strokeWidth = 2.5 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );
const HomeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> );
const SparklesIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg> );
const LogoutIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> );
const BuildingIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="18"></line><line x1="15" y1="22" x2="15" y2="18"></line><path d="M9 9h6v6H9z"></path><path d="M22 12h-4"></path><path d="M2 12h4"></path><path d="M12 2v2"></path><path d="M12 22v-2"></path></svg> );
const GridIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> );
const MapPinIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> );
const UserPlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line></svg> );
const UserIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> );
const MailIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> );
const PhoneIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> );
const ShieldIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> );
// --- Sub-Components ---

const Sidebar = ({ isOpen, onClose, pendingCount, approvedCount, rejectedCount, currentView, setCurrentView }) => {
    const reportNavItems = [
        { id: 'pending', label: 'Pending Reports', icon: <HomeIcon /> },
        { id: 'verified', label: 'Verified Reports', icon: <CheckIcon size={20} /> },
        { id: 'rejected', label: 'Rejected Reports', icon: <CloseIcon size={20} /> },
    ];
    const managementNavItems = [
        { id: 'registerMunicipality', label: 'Register Municipality', icon: <BuildingIcon /> },
        { id: 'registerWard', label: 'Register Ward', icon: <GridIcon /> },
        { id: 'locateWard', label: 'Locate Ward', icon: <MapPinIcon /> },
        { id: 'addAdminHead', label: 'Add Admin Head', icon: <UserPlusIcon /> },
        { id: 'profile', label: 'Profile', icon: <UserIcon /> },
    ];

    return (
        <>
            <AnimatePresence>
                {isOpen && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} /> )}
            </AnimatePresence>
            <aside className={bg-white text-slate-700 max-w-1/5 min-w-64 fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}}>
                <div className="flex items-center justify-between p-4 h-16 border-b border-slate-200 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="bg-orange-500 p-2 rounded-lg shadow-lg shadow-orange-500/30"><StarIcon /></div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Civic साथी</h1>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors lg:hidden" aria-label="Close menu"><CloseIcon size={22} /></button>
                </div>
                <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
                    <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reports</h3>
                    {reportNavItems.map(item => ( <button key={item.id} onClick={() => { setCurrentView(item.id); onClose(); }} className={w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center ${currentView === item.id ? 'bg-orange-100 text-orange-800 font-semibold' : 'hover:bg-slate-100'}}><span className="mr-3">{item.icon}</span>{item.label}</button>))}
                    <h3 className="px-2 pt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Management</h3>
                    {managementNavItems.map(item => ( <button key={item.id} onClick={() => { setCurrentView(item.id); onClose(); }} className={w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center ${currentView === item.id ? 'bg-orange-100 text-orange-800 font-semibold' : 'hover:bg-slate-100'}}><span className="mr-3">{item.icon}</span>{item.label}</button>))}
                </nav>
                <div className="p-4 border-t border-slate-200 flex-shrink-0">
                    <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Statistics</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-blue-50 p-3 rounded-lg text-center"><div className="text-2xl font-bold text-blue-600">{pendingCount}</div><div className="text-xs text-blue-500 mt-1">Pending</div></div>
                        <div className="bg-green-50 p-3 rounded-lg text-center"><div className="text-2xl font-bold text-green-600">{approvedCount}</div><div className="text-xs text-green-500 mt-1">Approved</div></div>
                        <div className="bg-red-50 p-3 rounded-lg text-center"><div className="text-2xl font-bold text-red-600">{rejectedCount}</div><div className="text-xs text-red-500 mt-1">Rejected</div></div>
                    </div>
                    <button className="w-full mt-4 text-left px-3 py-2.5 rounded-lg transition-colors flex items-center text-slate-600 hover:bg-slate-100"><span className="mr-3"><LogoutIcon /></span>Logout</button>
                </div>
            </aside>
        </>
    );
};

const Header = ({ onOpenMenu }) => (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md z-20 lg:hidden">
        <div className="max-w-6xl mx-auto px-4"><div className="flex items-center justify-between h-16 border-b border-slate-200"><h1 className="text-xl font-bold text-slate-800 tracking-tight">Admin Dashboard</h1><button onClick={onOpenMenu} className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors" aria-label="Open menu"><MenuIcon /></button></div></div>
    </header>
);

const IssueCard = ({ issue, onSelect, onApprove, onReject }) => (
    <div onClick={() => onSelect(issue)} className="group bg-white p-4 rounded-2xl shadow-sm border border-slate-200 cursor-pointer flex items-center space-x-4 transition-all duration-300 ease-in-out hover:shadow-lg hover:border-slate-300 hover:-translate-y-1">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100"><img src={issue.thumbnailUrl || issue.image} alt={issue.Description} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" /></div>
        <div className="flex-grow"><p className="font-semibold text-slate-800">{issue.Description}</p><p className="text-sm text-slate-500 mt-1">{issue.Title} • Reported by: {issue.ReporterName || 'Anonymous'}</p></div>
        <div className="flex-shrink-0 flex items-center space-x-2">
            <button onClick={(e) => { e.stopPropagation(); onReject(issue); }} className="p-3 rounded-full text-white bg-red-500 hover:bg-red-600 transition-all duration-200 transform hover:scale-110" aria-label="Reject issue"><CloseIcon size={18} /></button>
            <button onClick={(e) => { e.stopPropagation(); onApprove(issue); }} className="p-3 rounded-full text-white bg-green-500 hover:bg-green-600 transition-all duration-200 transform hover:scale-110" aria-label="Approve issue"><CheckIcon size={18} /></button>
        </div>
    </div>
);

const ArchivedIssueCard = ({ issue, onSelect, onMakePending }) => {
    const isApproved = issue.status === 'solved';
    return (
        <div onClick={() => onSelect(issue)} className={p-4 rounded-2xl shadow-sm border cursor-pointer flex items-center space-x-4 transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-0.5 ${isApproved ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}}>
            <div className="flex-grow">
                <p className={font-semibold ${isApproved ? 'text-green-900' : 'text-slate-800'} ${issue.status === 'rejected' ? 'line-through' : ''}}>{issue.Description}</p>
                {issue.status === 'rejected' && issue.rejectionReason && (<p className="text-sm text-red-600 mt-1">Reason: {issue.rejectionReason}</p>)}
            </div>
            <div className="flex-shrink-0 flex items-center space-x-3">
                <button onClick={(e) => { e.stopPropagation(); onMakePending(issue._id); }} className="text-sm px-3 py-1 rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors">Make Pending</button>
                {isApproved && <div className="p-2 rounded-full bg-green-500 text-white"><CheckIcon size={16} /></div>}
                {issue.status === 'rejected' && <div className="p-2 rounded-full bg-red-500 text-white"><CloseIcon size={16} /></div>}
            </div>
        </div>
    );
};

const getSeverityClasses = (severity) => {
    switch (severity) {
        case 'High': return 'bg-red-100 text-red-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'Low': return 'bg-green-100 text-green-800';
        default: return 'bg-slate-100 text-slate-800';
    }
};

const IssueDetailModal = ({ issue, onClose, onMediaClick, onGenerateSummary, aiSummary, isGeneratingSummary }) => {
    if (!issue) return null;
    const formattedDate = new Date(issue.timeOfReporting || issue.reportedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
    const handleOpenMap = () => {
        let url;
        if (issue.locationCoordinates?.coordinates) url = https://www.google.com/maps?q=${issue.locationCoordinates.coordinates[1]},${issue.locationCoordinates.coordinates[0]};
        else if (issue.address) url = https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(issue.address)};
        if (url) window.open(url, "_blank");
    };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-40" onClick={onClose}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden">
                <div className="p-2 bg-slate-50 relative"> 
                    {issue.mediaType === 'video' ? (//CHANGED it with this new block that includes the video logic:
                        <video 
                            src={issue.mediaUrl} 
                            controls 
                            autoPlay 
                            muted 
                            loop 
                            onClick={() => onMediaClick(issue.mediaUrl, 'video')}
                            className="w-full h-64 object-cover rounded-xl cursor-pointer bg-black"
                        />
                    ) : (
                        <img 
                            src={issue.image} // Fallback for old panorama images
                            alt="Issue" 
                            onClick={() => onMediaClick(issue.image, 'image')}
                            className="w-full h-64 object-cover rounded-xl cursor-pointer" 
                        />
                    )}
                    <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-2 z-10" aria-label="Close">
                        <CloseIcon size={22} strokeWidth={3} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div><p className="font-semibold text-slate-500">Reported On</p><p className="text-slate-900">{formattedDate}</p></div>
                        <div><p className="font-semibold text-slate-500">Issue Type</p><p className="text-slate-900">{issue.Title}</p></div>
                        <div><p className="font-semibold text-slate-500">Severity</p><span className={px-2 py-1 rounded-full font-medium text-xs ${getSeverityClasses(issue.severity)}}>{issue.severity}</span></div>
                        <div><p className="font-semibold text-slate-500">Ward No</p><p className="text-slate-900">{issue.ward}</p></div>
                    </div>
                    <div className="border-t border-slate-200 pt-4"><h3 className="text-lg font-bold mb-2 text-slate-900">Description</h3><p className="text-slate-600 text-base h-24 overflow-y-auto pr-2">{issue.Description}</p></div>
                    <div className="border-t border-slate-200 pt-4 mt-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">AI Summary</h3>
                            <button onClick={() => onGenerateSummary(issue.Description)} disabled={isGeneratingSummary} className="flex items-center text-sm font-semibold text-orange-600 hover:text-orange-800 disabled:text-slate-400 disabled:cursor-wait transition-colors"><SparklesIcon className={mr-2 h-5 w-5 ${isGeneratingSummary ? 'animate-spin' : ''}} />{isGeneratingSummary ? 'Generating...' : 'Generate with AI'}</button>
                        </div>
                        {aiSummary && <div className="mt-2 text-slate-600 bg-orange-50 p-3 rounded-lg border border-orange-200">{aiSummary}</div>}
                    </div>
                    {(issue.locationCoordinates || issue.address) ? <div className="mt-6"><button onClick={handleOpenMap} className="w-full bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700">View on Map</button></div> : null}
                </div>
            </motion.div>
        </motion.div>
    );
};

const RejectionModal = ({ issue, onConfirm, onCancel, onSuggestReason, isSuggesting, suggestedReason }) => {
    const [reason, setReason] = React.useState('');
    React.useEffect(() => { if (suggestedReason) setReason(suggestedReason); }, [suggestedReason]);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onCancel}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-900">Reason for Rejection</h3>
                    <button onClick={() => onSuggestReason(issue.Description)} disabled={isSuggesting} className="flex items-center text-sm font-semibold text-orange-600 hover:text-orange-800 disabled:text-slate-400"><SparklesIcon className={mr-2 h-5 w-5 ${isSuggesting ? 'animate-spin' : ''}} />{isSuggesting ? 'Thinking...' : 'Suggest Reason'}</button>
                </div>
                <p className="text-sm text-slate-600 mb-3">Rejecting report: <span className="font-medium">"{issue.Description}"</span></p>
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., Duplicate report, insufficient information..." className="w-full h-28 p-3 rounded-lg bg-slate-100 border border-slate-300"></textarea>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onCancel} className="px-5 py-2.5 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold">Cancel</button>
                    <button onClick={() => onConfirm(reason)} disabled={!reason.trim()} className="px-5 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:bg-red-300">Confirm Rejection</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const ApprovalModal = ({ issue, onConfirm, onCancel }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onCancel}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6">
            <h3 className="text-xl font-bold mb-4 text-slate-900">Confirm Approval</h3>
            <p className="text-sm text-slate-600 mb-3">Are you sure you want to approve this report?</p>
            <div className="bg-slate-100 p-4 rounded-lg mb-4"><p className="font-medium text-slate-800">{issue.Description}</p><p className="text-sm text-slate-600 mt-1">Reported by: {issue.ReporterName || 'Anonymous'}</p></div>
            <div className="mt-6 flex justify-end space-x-3">
                <button onClick={onCancel} className="px-5 py-2.5 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold">Cancel</button>
                <button onClick={onConfirm} className="px-5 py-2.5 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600">Confirm Approval</button>
            </div>
        </motion.div>
    </motion.div>
);

// const ImageFullscreenModal = ({ imageUrl, onClose }) => {
//     const panoramaRef = React.useRef(null);
//     React.useEffect(() => {
//         if (!imageUrl || !panoramaRef.current || !window.pannellum) return;
//         const viewer = window.pannellum.viewer(panoramaRef.current, { type: "equirectangular", panorama: imageUrl, autoLoad: true, showZoomCtrl: false, showFullscreenCtrl: false });
//         return () => { viewer.destroy(); };
//     }, [imageUrl]);
//     if (!imageUrl) return null;
//     return (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50">
//             <button onClick={onClose} className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 z-10"><CloseIcon strokeWidth={3} /></button>
//             <div ref={panoramaRef} style={{ width: "100vw", height: "100vh" }} />
//         </motion.div>
//     );
// };
const MediaFullscreenModal = ({ media, onClose }) => {//ADDED THIS TO INCLUDE BOTH IMAGES AND VIDEOS
    const panoramaRef = React.useRef(null);
    
    React.useEffect(() => {
        if (!media || media.type !== 'image' || !panoramaRef.current || !window.pannellum) return;
        const viewer = window.pannellum.viewer(panoramaRef.current, { type: "equirectangular", panorama: media.url, autoLoad: true, showZoomCtrl: false, showFullscreenCtrl: false });
        return () => { viewer.destroy(); };
    }, [media]);

    if (!media) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50" onClick={onClose}>
            <button onClick={onClose} className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 z-10"><CloseIcon strokeWidth={3} /></button>
            {media.type === 'video' ? (
                <video src={media.url} controls autoPlay className="max-w-full max-h-full" onClick={(e) => e.stopPropagation()} />
            ) : (
                // <div ref={panoramaRef} style={{ width: "100vw", height: "100vh" }} />
                <div ref={panoramaRef} style={{ width: "100vw", height: "100vh" }} onClick={(e) => e.stopPropagation()} />
            )}
        </motion.div>
    );
};

const RegisterMunicipalityPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-slate-800">Register Municipality</h1>
        <p className="text-slate-500 mt-1">This page will contain a form to register a new municipality.</p>
        <div className="mt-8 p-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
            <p className="text-center text-slate-400">Municipality Registration Form coming soon.</p>
        </div>
    </div>
);

const RegisterWardPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-slate-800">Register Ward</h1>
        <p className="text-slate-500 mt-1">This page will contain a form to register a new ward within a municipality.</p>
        <div className="mt-8 p-8 border border-dashed border-slate-300 rounded-lg bg-slate-50">
            <p className="text-center text-slate-400">Ward Registration Form coming soon.</p>
        </div>
    </div>
);

const LocateWardPage = () => (
    <div>
        <h1 className="text-3xl font-bold text-slate-800">Locate Ward</h1>
        <p className="text-slate-500 mt-1">This page will feature a map to locate and view details of registered wards.</p>
        <div className="mt-8 p-8 border border-dashed border-slate-300 rounded-lg bg-slate-50 h-96 flex items-center justify-center">
            <p className="text-center text-slate-400">Interactive Map coming soon.</p>
        </div>
    </div>
);
// Replace your old ProfilePage component with this new one

const ProfilePage = () => {
    // --- STATE MANAGEMENT ---
    // In a real app, this data would come from an API call
    const [adminData, setAdminData] = React.useState({
        fullName: 'Arup Roy',
        email: 'arup.roy@kmc.gov.in',
        phone: '9876543210',
        designation: 'Municipal Commissioner',
        municipality: 'Howrah Municipal Corporation',
        authority: 'High',
        avatarUrl: https://i.pravatar.cc/150?u=admin${new Date().getTime()} // Placeholder avatar
    });
    const [isEditing, setIsEditing] = React.useState(false);

    // --- HANDLERS ---
    const handleEditToggle = () => {
        if (isEditing) {
            // Here you would typically make an API call to save the data
            toast.success("Profile updated successfully!");
        }
        setIsEditing(!isEditing);
    };

    // Helper component for displaying information fields
    const InfoField = ({ icon, label, value, isEditing }) => (
        <div>
            <label className="text-sm font-semibold text-slate-500">{label}</label>
            <div className="flex items-center mt-1">
                <span className="text-slate-400">{icon}</span>
                {isEditing && (label === 'Full Name' || label === 'Phone Number') ? (
                    <input 
                        type="text" 
                        defaultValue={value}
                        className="w-full ml-3 p-1 rounded bg-slate-100 border border-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                ) : (
                    <p className="text-slate-800 ml-3 text-base">{value}</p>
                )}
            </div>
        </div>
    );
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800">User Profile</h1>
            <p className="text-slate-500 mt-1">Manage your profile information and account settings.</p>

            <div className="w-full  bg-white p-8 mt-8 rounded-xl shadow-md border border-slate-200">
                <div className="flex flex-col items-center text-center border-b border-slate-200 pb-6">
                    <img 
                        src={adminData.avatarUrl} 
                        alt="Profile Avatar"
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-orange-100"
                    />
                    <h2 className="mt-4 text-2xl font-bold text-slate-900">{adminData.fullName}</h2>
                    <p className="text-slate-600">{adminData.designation}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <InfoField icon={<MailIcon />} label="Email Address" value={adminData.email} />
                    <InfoField icon={<PhoneIcon />} label="Phone Number" value={adminData.phone} isEditing={isEditing} />
                    <InfoField icon={<BuildingIcon />} label="Municipality" value={adminData.municipality} />
                    <InfoField icon={<ShieldIcon />} label="Authority Level" value={adminData.authority} />
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button 
                        onClick={handleEditToggle}
                        className={w-full py-2.5 px-5 font-semibold rounded-lg transition-colors ${isEditing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'}}
                    >
                        {isEditing ? 'Save Changes' : 'Edit Profile'}
                    </button>
                    <button className="w-full py-2.5 px-5 font-semibold rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors">
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
};//ADDED THIS PAGE TO SEE THE PROFILE PAGE AFTER CLICKING PROFILE IN SIDEBAR

const RegisterAdminHeadPage = () => {
    // --- STATE MANAGEMENT ---
    const [formData, setFormData] = React.useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        designation: '',
        authority: '',
        municipality: '',
        password: '',
    });
    const [errors, setErrors] = React.useState({});
    const [apiError, setApiError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const authorityCategory = ['High', 'Medium', 'Low'];

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        // Clear the specific error when the user starts typing
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    // --- VALIDATION ---
    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be exactly 10 digits';
        if (!formData.age) newErrors.age = 'Age is required';
        else if (isNaN(formData.age) || formData.age < 18) newErrors.age = 'Must be a number and at least 18 years old';
        if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
        if (!formData.authority) newErrors.authority = 'Please select an authority level';
        if (!formData.municipality.trim()) newErrors.municipality = 'Municipality is required';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';

        return newErrors;
    };

    // --- FORM SUBMISSION ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(''); // Reset previous API errors
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                // The API call uses the entire formData object
                // await authApi.administrationSignup(formData);
                toast.success('Administrative Head registered successfully!');
                // Reset form on success
                setFormData({ fullName: '', email: '', phone: '', age: '', designation: '', authority: '', municipality: '', password: '' });
            } catch (error) {
                const errorMessage = error.message || 'Failed to register admin head. Please try again.';
                toast.error(errorMessage);
                setApiError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.error("Please correct the errors in the form.");
        }
    };

    // --- RENDER ---
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Add Administrative Head</h1>
            <p className="text-slate-500 mt-1">Create a new administrative head account for a municipality.</p>
            <div className="w-full max-w-2xl bg-white p-8 mt-8 rounded-xl shadow-md border border-slate-200">
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {Object.entries({
                        fullName: { label: 'Full Name', type: 'text', placeholder: 'e.g., Jane Doe' },
                        email: { label: 'Email Address', type: 'email', placeholder: 'e.g., jane.doe@example.com' },
                        phone: { label: 'Phone Number', type: 'tel', placeholder: 'e.g., 9876543210' },
                        age: { label: 'Age', type: 'number', placeholder: 'e.g., 45' },
                        designation: { label: 'Designation', type: 'text', placeholder: 'e.g., Municipal Commissioner' },
                        municipality: { label: 'Municipality', type: 'text', placeholder: 'e.g., Kolkata Municipal Corporation' },
                        password: { label: 'Password', type: 'password', placeholder: '••••••••' },
                    }).map(([id, { label, type, placeholder }]) => (
                        <div key={id}>
                            <label htmlFor={id} className="font-medium text-slate-700">{label}</label>
                            <input
                                id={id}
                                type={type}
                                placeholder={placeholder}
                                value={formData[id]}
                                onChange={handleChange}
                                className={w-full mt-2 p-3 border rounded-md outline-none focus:ring-2 ${errors[id] ? 'border-red-500 ring-red-300' : 'border-slate-300 focus:ring-orange-500 focus:border-orange-500'}}
                                disabled={isLoading}
                            />
                            {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
                        </div>
                    ))}

                    <div>
                        <label htmlFor="authority" className="font-medium text-slate-700">Authority Level</label>
                        <select
                            id="authority"
                            value={formData.authority}
                            onChange={handleChange}
                            className={w-full mt-2 p-3 border rounded-md outline-none focus:ring-2 bg-white ${errors.authority ? 'border-red-500 ring-red-300' : 'border-slate-300 focus:ring-orange-500 focus:border-orange-500'}}
                            disabled={isLoading}
                        >
                            <option value="">Select an authority level</option>
                            {authorityCategory.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        {errors.authority && <p className="text-red-500 text-sm mt-1">{errors.authority}</p>}
                    </div>
                    
                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                            <span className="block sm:inline">{apiError}</span>
                        </div>
                    )}


                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition flex justify-center items-center disabled:bg-orange-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </>
                        ) : 'Register Administrative Head'}
                    </button>
                </form>
            </div>
        </div>
    );
};



export default function AdminDashboardPage() {
    const [allIssues, setAllIssues] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [fetchedStatuses, setFetchedStatuses] = React.useState({});
    const [selectedIssue, setSelectedIssue] = React.useState(null);
    // const [fullscreenImageUrl, setFullscreenImageUrl] = React.useState(null);
    const [fullscreenMedia, setFullscreenMedia] = React.useState(null);
    const [rejectionTarget, setRejectionTarget] = React.useState(null);
    const [approvalTarget, setApprovalTarget] = React.useState(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [currentView, setCurrentView] = React.useState('pending');
    const [sortOrder, setSortOrder] = React.useState('newest');
    const [filterBy, setFilterBy] = React.useState('none');
    const [filterValue, setFilterValue] = React.useState('');
    const [aiSummary, setAiSummary] = React.useState('');
    const [isGeneratingSummary, setIsGeneratingSummary] = React.useState(false);
    const [suggestedReason, setSuggestedReason] = React.useState('');
    const [isSuggestingReason, setIsSuggestingReason] = React.useState(false);

    React.useEffect(() => {
        const pannellumScript = document.createElement('script');
        pannellumScript.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
        pannellumScript.async = true;
        document.body.appendChild(pannellumScript);
        const pannellumCss = document.createElement('link');
        pannellumCss.rel = "stylesheet";
        pannellumCss.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
        document.head.appendChild(pannellumCss);
        return () => {
            if (document.body.contains(pannellumScript)) document.body.removeChild(pannellumScript);
            if (document.head.contains(pannellumCss)) document.head.removeChild(pannellumCss);
        };
    }, []);

    React.useEffect(() => {
        const fetchInitialIssues = async () => {
            setIsLoading(true);
            try {
                // const issuesFromDb = await authApi.getReports();
                const issuesFromDb = [
                  {
                      _id: 'dummyreport01',
                      Description: 'Severe waterlogging under the Tala bridge after a short spell of rain, causing major traffic jams.',
                      Title: 'Waterlogging Issue',
                      ReporterName: 'M. Das',
                      image: 'https://placehold.co/600x400/5F9EA0/FFFFFF?text=Waterlogging',
                      status: 'pending',
                      timeOfReporting: new Date().toISOString(),
                      severity: 'High',
                      ward: '35',
                      locationCoordinates: { coordinates: [82.2917, 25.5801] }, 
                      address: 'Tala bridge, kolkata-7000000'
                  },
                  {
                    _id: 'dummyVideo01',
                    Description: 'Garbage has not been collected for over a week at Tikiapara Station road, causing a severe hygiene issue.',
                    Title: 'Waste Management',
                    ReporterName: 'N. Sharma',
                    // --- Add these new fields ---
                    mediaType: 'video', 
                    mediaUrl: 'https://videos.pexels.com/video-files/853879/853879-sd_640_360_25fps.mp4',
                    thumbnailUrl: 'https://placehold.co/600x400/8B4513/FFFFFF?text=Waste+Video',
                    // --------------------------
                    status: 'pending',
                    timeOfReporting: new Date().toISOString(),
                    severity: 'Medium',
                    ward: '18',
                    locationCoordinates: { coordinates: [88.3243, 22.5760] }, // Approx. Tikiapara
                    address: 'Tikiapara Station Rd, Howrah, West Bengal 711101'
                  }
              ];// JUST ADDED THIS FOR DUMMY REPORT TESTING
                setAllIssues(issuesFromDb || []);
                setFetchedStatuses({ pending: true });
            } catch (error) {
                toast.error(Failed to fetch pending issues: ${error.message});
                setAllIssues([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialIssues();
    }, []);

    React.useEffect(() => {
        const fetchMoreIssues = async () => {
            const statusToFetch = currentView === 'verified' ? 'verified' : currentView;
            if (currentView === 'pending' || isLoading || fetchedStatuses[currentView]) {
                return;
            }
            setIsLoading(true);
            try {
                // const newIssues = await authApi.getReportsByStatus(statusToFetch);
                const newIssues = []; // ADDED THIS LINE TO PREVENT CRASHES BY CLICKING ANY PAGE OTHER THAN PENDING REPORTS
                setAllIssues(prevIssues => {
                    const existingIds = new Set(prevIssues.map(i => i._id));
                    const uniqueNewIssues = newIssues.filter(i => !existingIds.has(i._id));
                    return [...prevIssues, ...uniqueNewIssues];
                });
                setFetchedStatuses(prev => ({ ...prev, [currentView]: true }));
            } catch (error) {
                toast.error(Failed to fetch ${currentView} issues: ${error.message});
            } finally {
                setIsLoading(false);
            }
        };
        fetchMoreIssues();
    }, [currentView, isLoading, fetchedStatuses]);

    useEffect(() => { console.log("Current master issue list:", allIssues); }, [allIssues]);

    const callGeminiAPI = async (prompt) => {
        const apiKey = "";
        const url = https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey};
        try {
            const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
            if (!response.ok) throw new Error(API Error: ${response.statusText});
            const result = await response.json();
            return result.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate a response.";
        } catch (error) {
            console.error("Gemini API call failed:", error);
            return "Failed to get a response from AI.";
        }
    };

    const handleGenerateSummary = async (description) => {
        setIsGeneratingSummary(true);
        setAiSummary('');
        const prompt = Summarize the following civic issue report into one concise, professional sentence: ${description};
        const summary = await callGeminiAPI(prompt);
        setAiSummary(summary);
        setIsGeneratingSummary(false);
    };
    
    const handleSuggestReason = async (description) => {
        setIsSuggestingReason(true);
        setSuggestedReason('');
        const prompt = "Based on the following civic issue report, suggest a brief, professional reason for rejection. The reason should be suitable for a citizen's portal. Issue: ${description}";
        const reason = await callGeminiAPI(prompt);
        setSuggestedReason(reason);
        setIsSuggestingReason(false);
    };

    React.useEffect(() => { if (!selectedIssue) setAiSummary(''); }, [selectedIssue]);

    const updateIssueStatusInApi = async (issue, newStatus, reason = null) => {
        const originalIssues = [...allIssues];
        const uiStatus = newStatus;
        const updatedIssues = allIssues.map(i => i._id === issue._id ? { ...i, status: uiStatus, rejectionReason: reason } : i);
        setAllIssues(updatedIssues);
        try {
            // await authApi.updateReportStatus(issue._id, newStatus, reason);
            toast.success(`Report has been updated to ${newStatus}.`);
        } catch (error) {
            toast.error(`Failed to update report: ${error.message}`);
            setAllIssues(originalIssues);
        }
    };

    const handleConfirmApproval = () => {
        if (!approvalTarget) return;
        updateIssueStatusInApi(approvalTarget, 'verified');
        setApprovalTarget(null);
    };

    const handleConfirmRejection = (reason) => {
        if (!rejectionTarget) return;
        updateIssueStatusInApi(rejectionTarget, 'rejected', reason);
        setRejectionTarget(null);
    };

    const handleMakePending = (issueId) => {
        const issueToUpdate = allIssues.find(i => i._id === issueId);
        if (issueToUpdate) updateIssueStatusInApi(issueToUpdate, 'pending');
    };

    const filteredAndSortedIssuesV2 = React.useMemo(() => {
        const statusToFilter = currentView === 'verified' ? 'verified' : currentView;
        let list = allIssues.filter(issue => issue.status === statusToFilter);
        const trimmedFilter = filterValue.trim().toLowerCase();
        if (trimmedFilter) {
            const filterKey = filterBy === 'reporter' ? 'ReporterName' : filterBy;
            if (filterBy !== 'none') {
                list = list.filter(i => String(i[filterKey] || '').toLowerCase().includes(trimmedFilter));
            } else {
                list = list.filter(i => Object.values(i).some(val => String(val).toLowerCase().includes(trimmedFilter)));
            }
        }
        return list.sort((a, b) => {
            const dateA = new Date(a.timeOfReporting || a.reportedAt || 0).getTime();
            const dateB = new Date(b.timeOfReporting || b.reportedAt || 0).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [allIssues, currentView, filterValue, filterBy, sortOrder]);

    const renderCurrentView = () => {
        if (isLoading && !fetchedStatuses[currentView]) {
            return ( <div className="flex justify-center items-center h-64"><div className="text-center text-slate-500"><svg className="animate-spin mx-auto h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="mt-4">Loading Reports...</p></div></div> );
        }
        const reportViews = ['pending', 'verified', 'rejected'];
        if (reportViews.includes(currentView)) {
            // Show detail card if a report is selected, otherwise show the list
            if (selectedIssue) {
                return (
                    <ReportDetailView 
                        report={selectedIssue} 
                        onClose={() => setSelectedIssue(null)} 
                        userRole="admin"
                        onApprove={() => {
                            updateIssueStatusInApi(selectedIssue, 'verified');
                            setSelectedIssue(null);
                        }}
                        onReject={(reason) => {
                            if (selectedIssue.status === 'rejected') {
                                // Convert rejected to pending directly
                                updateIssueStatusInApi(selectedIssue, 'pending');
                                setSelectedIssue(null);
                            } else {
                                // For pending reports, set for rejection (will show modal)
                                setRejectionTarget(selectedIssue);
                                setSelectedIssue(null);
                            }
                        }}
                    />
                );
            }
            return (
                <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div><h1 className="text-3xl font-bold text-slate-800">{currentView.charAt(0).toUpperCase() + currentView.slice(1)} Reports</h1><p className="text-slate-500 mt-1">Manage and filter the reports below.</p></div>
                        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-2"><label className="text-sm text-slate-600 shrink-0">Filter By</label><select value={filterBy} onChange={e => { setFilterBy(e.target.value); setFilterValue(''); }} className="px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"><option value="none">All Fields</option><option value="ward">Ward</option><option value="reporter">Reporter</option></select></div>
                            <div className="relative w-full sm:w-auto"><input value={filterValue} onChange={e => setFilterValue(e.target.value)} placeholder={Search by ${filterBy === 'none' ? 'all' : filterBy}...} className="pl-10 pr-4 py-2 w-full sm:w-48 rounded-md border border-slate-300 bg-white" /><svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
                            <div className="flex items-center space-x-2"><label className="text-sm text-slate-600">Sort</label><select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="px-3 py-2 rounded-md border border-slate-300 bg-white text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {filteredAndSortedIssues.length > 0 ? (
                            filteredAndSortedIssues.map(issue => {
                                if (currentView === 'pending') {
                                    return <IssueCard key={issue._id} issue={issue} onSelect={setSelectedIssue} onApprove={setApprovalTarget} onReject={setRejectionTarget} />;
                                }
                                return <ArchivedIssueCard key={issue._id} issue={issue} onSelect={setSelectedIssue} onMakePending={handleMakePending} />;
                            })
                        ) : (<div className="text-center py-12 text-slate-500"><p>No reports found for this category or filter.</p></div>)}
                    </div>
                </>
            );
        }
        switch (currentView) {
            case 'registerMunicipality': return <RegisterMunicipalityPage />;
            case 'registerWard': return <RegisterWardPage />;
            case 'locateWard': return <LocateWardPage />;
            case 'addAdminHead': return <RegisterAdminHeadPage />;
            case 'profile': return <ProfilePage />;
            default: return null;
        }
    };

    return (
        <>
            <div className="min-h-screen lg:flex bg-slate-50">
                <Sidebar
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    pendingCount={allIssues.filter(i => i.status === 'pending').length}
                    approvedCount={allIssues.filter(i => i.status === 'solved').length}
                    rejectedCount={allIssues.filter(i => i.status === 'rejected').length}
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />
                <div className="flex-1 flex flex-col lg:ml-64">
                    <Header onOpenMenu={() => setIsMenuOpen(true)} />
                    <main className="flex-grow max-w-6xl mx-auto p-4 md:p-8 w-full">{renderCurrentView()}</main>
                </div>
            </div>
            <AnimatePresence>
                {fullscreenMedia && <MediaFullscreenModal key="fullscreen-modal" media={fullscreenMedia} onClose={() => setFullscreenMedia(null)} />}
                {rejectionTarget && <RejectionModal key="rejection-modal" issue={rejectionTarget} onCancel={() => setRejectionTarget(null)} onConfirm={handleConfirmRejection} onSuggestReason={handleSuggestReason} isSuggesting={isSuggestingReason} suggestedReason={suggestedReason}/>}
                {approvalTarget && <ApprovalModal key="approval-modal" issue={approvalTarget} onCancel={() => setApprovalTarget(null)} onConfirm={handleConfirmApproval} />}
            </AnimatePresence>
        </>
    );
}
*/