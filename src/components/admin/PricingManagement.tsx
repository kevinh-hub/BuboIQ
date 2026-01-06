import React from 'react';
import { CreditCard, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export const PricingManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Pricing & Plans</h2>
        <p className="text-mist-gray">Manage subscription tiers, pricing models, and feature entitlements.</p>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList className="bg-dark-midnight/50 border border-slate-gray/20">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="addons">Add-ons</TabsTrigger>
          <TabsTrigger value="coupons">Coupons & Discounts</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <Card className="bg-dark-midnight/40 border-slate-gray/30">
              <CardHeader>
                <CardTitle className="text-white">Starter</CardTitle>
                <CardDescription>For small MSPs and startups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-white">$19</span>
                  <span className="text-mist-gray ml-1">/mo</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-mist-gray">Device Limit</span>
                    <span className="text-white">50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mist-gray">Users</span>
                    <span className="text-white">2</span>
                  </div>
                </div>
                <Button className="w-full border-slate-gray text-slate-gray hover:bg-slate-gray/10" variant="outline">
                  Edit Plan
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-iq-neon-green/5 border-iq-neon-green/30">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white">Pro</CardTitle>
                  <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">Most Popular</Badge>
                </div>
                <CardDescription>For growing IT teams</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-white">$79</span>
                  <span className="text-mist-gray ml-1">/mo</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-mist-gray">Device Limit</span>
                    <span className="text-white">Unlimited</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mist-gray">Users</span>
                    <span className="text-white">5</span>
                  </div>
                </div>
                <Button className="w-full bg-iq-neon-green/20 text-iq-neon-green hover:bg-iq-neon-green/30 border border-iq-neon-green/30">
                  Edit Plan
                </Button>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card className="bg-dark-midnight/40 border-slate-gray/30">
              <CardHeader>
                <CardTitle className="text-white">Team</CardTitle>
                <CardDescription>For established organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-white">$149</span>
                  <span className="text-mist-gray ml-1">/mo</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-mist-gray">Device Limit</span>
                    <span className="text-white">Unlimited</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mist-gray">Users</span>
                    <span className="text-white">Unlimited</span>
                  </div>
                </div>
                <Button className="w-full border-slate-gray text-slate-gray hover:bg-slate-gray/10" variant="outline">
                  Edit Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="addons">
             <div className="p-8 text-center text-mist-gray bg-dark-midnight/30 rounded-xl border border-slate-gray/20">
                 <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                 <h3 className="text-lg font-medium text-white mb-2">Add-on Management</h3>
                 <p>Configure optional add-ons like Compliance Packs and White Labeling here.</p>
             </div>
        </TabsContent>

        <TabsContent value="coupons">
             <div className="p-8 text-center text-mist-gray bg-dark-midnight/30 rounded-xl border border-slate-gray/20">
                 <h3 className="text-lg font-medium text-white mb-2">Active Coupons</h3>
                 <p>No active coupons found.</p>
             </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
