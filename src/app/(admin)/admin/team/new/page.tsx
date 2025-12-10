'use client'; // Needed for the interactive password toggle, or remove if strictly server

import { createStaffMember } from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
    ArrowLeft, 
    UserPlus, 
    Shield, 
    Check, 
    X, 
    User, 
    Mail, 
    Lock,
    Eye,
    EyeOff
} from "lucide-react";
import { useState } from "react";

export default function NewStaffPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/team">
                        <Button variant="outline" size="icon" className="bg-white border-gray-200">
                            <ArrowLeft size={18} className="text-gray-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add Staff Member</h1>
                        <p className="text-sm text-gray-500">Onboard a new team member and assign access.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* LEFT COLUMN: Role & Permissions Context */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-4 text-blue-700 font-semibold">
                                <Shield className="h-5 w-5" />
                                <h2>Access Level</h2>
                            </div>
                            
                            <div className="p-3 bg-blue-50 rounded-lg mb-6 border border-blue-100">
                                <p className="text-sm font-medium text-blue-900">Role: Operations Viewer</p>
                                <p className="text-xs text-blue-700 mt-1">Best for junior staff or auditors.</p>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">What they can do</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-green-600 mt-0.5" />
                                        <span>View Property Listings</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-green-600 mt-0.5" />
                                        <span>Read Tenant Profiles</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check size={16} className="text-green-600 mt-0.5" />
                                        <span>View Maintenance Tickets</span>
                                    </li>
                                </ul>

                                <div className="h-px bg-gray-100 my-4"></div>

                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Restricted Actions</p>
                                <ul className="space-y-2 text-sm text-gray-500">
                                    <li className="flex items-start gap-2 opacity-75">
                                        <X size={16} className="text-red-500 mt-0.5" />
                                        <span>Delete Records</span>
                                    </li>
                                    <li className="flex items-start gap-2 opacity-75">
                                        <X size={16} className="text-red-500 mt-0.5" />
                                        <span>Change System Settings</span>
                                    </li>
                                    <li className="flex items-start gap-2 opacity-75">
                                        <X size={16} className="text-red-500 mt-0.5" />
                                        <span>Manage Billing</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
                            <form action={createStaffMember} className="space-y-6">
                                
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input 
                                                    id="name" 
                                                    name="name" 
                                                    placeholder="e.g. Sarah Connor" 
                                                    required 
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input 
                                                    id="email" 
                                                    name="email" 
                                                    type="email" 
                                                    placeholder="sarah@company.com" 
                                                    required 
                                                    className="pl-9"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                                    
                                    <div className="space-y-2 max-w-md">
                                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Temporary Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input 
                                                id="password" 
                                                name="password" 
                                                type={showPassword ? "text" : "password"} 
                                                placeholder="••••••••" 
                                                required 
                                                className="pl-9 pr-10"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <input type="checkbox" id="forceChange" name="forceChange" defaultChecked className="rounded border-gray-300 text-black focus:ring-black" />
                                            <label htmlFor="forceChange" className="text-xs text-gray-600">Require user to change password on first login</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex items-center justify-end gap-3">
                                    <Link href="/admin/team">
                                        <Button variant="outline" type="button" className="text-gray-600">Cancel</Button>
                                    </Link>
                                    <Button type="submit" className="bg-gray-900 hover:bg-black text-white gap-2 shadow-sm">
                                        <UserPlus size={16} /> Create Account
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
