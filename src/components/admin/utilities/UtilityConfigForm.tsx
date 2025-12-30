"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Zap } from "lucide-react";

export function UtilityConfigForm() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" /> Provider Configuration
                </CardTitle>
                <CardDescription>Manage active settings for Electricity vending.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between border p-4 rounded-lg bg-muted/20">
                    <div className="space-y-0.5">
                        <Label className="text-base">Enable Purchase</Label>
                        <p className="text-xs text-muted-foreground">Master switch to allow/disallow new transactions.</p>
                    </div>
                    <Switch defaultChecked />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Commission Fee (₦)</Label>
                        <Input type="number" defaultValue="100" />
                        <p className="text-[10px] text-muted-foreground">Fixed fee added to every transaction.</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Provider Selection</Label>
                        <Input defaultValue="Monnify / Paystack" disabled />
                        <p className="text-[10px] text-muted-foreground">Currently locked to hardcoded provider.</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Min. Amount (₦)</Label>
                        <Input type="number" defaultValue="1000" />
                    </div>
                    <div className="space-y-2">
                        <Label>Max. Amount (₦)</Label>
                        <Input type="number" defaultValue="50000" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </CardContent>
        </Card>
    );
}
