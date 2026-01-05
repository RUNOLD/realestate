'use client';

import { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, Link as LinkIcon, Upload, X, Plus } from "lucide-react";

interface ImageUploadProps {
    defaultValue?: string | string[];
    name?: string;
    maxFiles?: number;
}

export function ImageUpload({ defaultValue = [], name = "images", maxFiles = 5 }: ImageUploadProps) {
    const initialUrls = Array.isArray(defaultValue)
        ? defaultValue
        : (defaultValue ? [defaultValue as string] : []);

    const [mode, setMode] = useState<'url' | 'upload'>(
        initialUrls.length > 0 && !initialUrls[0].startsWith('data:') ? 'url' : 'upload'
    );
    const [previews, setPreviews] = useState<string[]>(initialUrls);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        // Count how many new submittable files we can add
        const currentUploadCount = previews.filter(p => p.startsWith('data:')).length;
        const availableSlots = maxFiles - previews.length;
        const filesToAdd = files.slice(0, availableSlots);

        if (files.length > availableSlots) {
            alert(`You can only have a total of ${maxFiles} images.`);
        }

        filesToAdd.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removePreview = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant={mode === 'upload' ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 text-[10px] uppercase font-bold tracking-wider"
                    onClick={() => setMode('upload')}
                >
                    <Upload size={12} className="mr-1" /> Device Upload
                </Button>
                <Button
                    type="button"
                    variant={mode === 'url' ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 text-[10px] uppercase font-bold tracking-wider"
                    onClick={() => setMode('url')}
                >
                    <LinkIcon size={12} className="mr-1" /> External URLs
                </Button>
            </div>

            {mode === 'upload' ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {previews.map((src, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-muted">
                                <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8 rounded-full"
                                        onClick={() => removePreview(index)}
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {previews.length < maxFiles && (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-muted/50 cursor-pointer transition-all hover:border-primary/50 group"
                            >
                                <div className="p-2 bg-primary/5 rounded-full text-primary group-hover:scale-110 transition-transform">
                                    <Plus size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Add Photo</span>
                            </div>
                        )}
                    </div>

                    {/* Hidden inputs for form data */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        // If we want multiple files in the same field name, we need to handle it in action
                        name={name}
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {/* For existing images that are already URLs, we need to pass them back to the action 
                        if they haven't been removed. We'll use a hidden field for this. */}
                    <input
                        type="hidden"
                        name={`${name}_existing`}
                        value={JSON.stringify(previews.filter(p => !p.startsWith('data:')))}
                    />
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            name={name}
                            placeholder='["https://...", "https://..."]'
                            defaultValue={initialUrls.length > 0 ? JSON.stringify(initialUrls) : ""}
                            className="pl-9 h-12 font-mono text-xs bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                            onChange={(e) => {
                                try {
                                    const val = e.target.value;
                                    if (val.startsWith('[')) {
                                        setPreviews(JSON.parse(val));
                                    } else if (val) {
                                        setPreviews([val]);
                                    } else {
                                        setPreviews([]);
                                    }
                                } catch {
                                    setPreviews(e.target.value ? [e.target.value] : []);
                                }
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {previews.map((src, index) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden border border-border">
                                <img src={src} alt="External Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <p className="text-[10px] text-muted-foreground/70 ml-1">
                {mode === 'upload' ? `Upload up to ${maxFiles} images. Keep files under 5MB.` : "Enter a JSON array of image URLs."}
            </p>
        </div>
    );
}
