'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { uploadDocument } from "@/actions/misc";

export function DocumentUpload({ userId }: { userId: string }) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState<string>('KYC_Documents');
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setMessage(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('category', category);
        formData.append('file', file);

        try {
            const result = await uploadDocument(null, formData);
            if (result.success) {
                setMessage("Success");
                setFile(null);
            } else {
                const errorMessage = typeof result.error === 'string'
                    ? result.error
                    : "Validation failed: " + Object.values(result.error || {}).flat().join(", ");
                setMessage(errorMessage);
            }
        } catch (e) {
            setMessage("Error uploading");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-card p-6 rounded-xl border border-border">
            <h3 className="font-bold text-foreground mb-4">Document Hub</h3>

            <div className="space-y-4">
                {/* Category Select */}
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Document Category</label>
                    <select
                        className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground focus:ring-1 focus:ring-primary"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="KYC_Documents">KYC Documents (ID, Passport)</option>
                        <option value="Signed_Tenancy_Agreement">Signed Tenancy Agreement</option>
                        <option value="Guarantor_Forms">Guarantor Forms</option>
                        <option value="Property_Handover">Property Handover (Checklist/Photos)</option>
                    </select>
                </div>

                {/* Drop Zone */}
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {message === 'Success' ? (
                        <div className="flex flex-col items-center text-green-500">
                            <CheckCircle size={32} className="mb-2" />
                            <p className="font-medium">Upload Successful!</p>
                            <Button variant="link" size="sm" onClick={() => setMessage(null)} className="text-green-600">Upload Another</Button>
                        </div>
                    ) : (
                        <>
                            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground">
                                    {file ? file.name : "Drag a file here"}
                                </p>
                                {!file && (
                                    <p className="text-xs text-muted-foreground">
                                        or <label className="text-primary hover:underline cursor-pointer font-bold">
                                            browse to upload
                                            <input type="file" className="hidden" onChange={handleFileChange} />
                                        </label>
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                {file && message !== 'Success' && (
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setFile(null)}>Cancel</Button>
                        <Button
                            size="sm"
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : 'Upload Document'}
                        </Button>
                    </div>
                )}
                {message && message !== 'Success' && <p className="text-sm text-red-500 text-center">{message}</p>}
            </div>
        </div>
    );
}
