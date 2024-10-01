"use client";
import React, { useState, useEffect } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, CreditCard, User } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import LoadingSpinner from '@/components/LoadingSpinner'

// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SettingsPage = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();
  const { signOut } = useClerk();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`/api/getUser?userId=${userId}`);
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLogout = () => {
    signOut();
  };

  const getMentalLevelInfo = (score: string) => {
    const numScore = Number(score);
    if (numScore < 20) return { description: "Weak", color: "text-red-500" };
    if (numScore < 40) return { description: "Neutral", color: "text-yellow-500" };
    if (numScore < 60) return { description: "Strong", color: "text-green-500" };
    if (numScore < 80) return { description: "Very Strong", color: "text-green-700" };
    return { description: "Basically Young Sheldon", color: "text-yellow-600" };
  };

  const handleUpgradeSubscription = () => {
    window.location.href = "https://buy.stripe.com/test_dR6bMv1813N1fL2144";
  };

  const handleCancelSubscription = async () => {
    if (confirm("Are you sure you want to cancel your subscription?")) {
      try {
        const response = await axios.post('/api/cancelSubscription', { userId });
        if (response.data.success) {
          alert("Subscription cancelled successfully. Changes will be reflected soon.");
          // Optionally, refresh the user data here
          fetchUserData();
        }
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        alert("Failed to cancel subscription. Please try again later.");
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const mentalLevelInfo = getMentalLevelInfo(userInfo?.mentalStudyScoreCode);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2" size={20} />
            Back to Dashboard
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{userInfo?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Mental Level</label>
                <p className={`${mentalLevelInfo.color}`}>
                  {mentalLevelInfo.description}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Details</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
        <p className="text-sm text-blue-800">
          You are currently on the <span className="font-semibold capitalize">{userInfo?.subscriptionType}</span> plan.
        </p>
      </div>
      <div className="flex space-x-4">
        {userInfo?.subscriptionType === 'free' ? (
          <Button variant="outline" onClick={handleUpgradeSubscription}>
            <CreditCard className="mr-2 h-4 w-4" />
            Upgrade to Premium
          </Button>
        ) : (
          <>
            <Button variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Manage Subscription
            </Button>
            <Button variant="destructive" onClick={handleCancelSubscription}>
              Cancel Subscription
            </Button>
          </>
        )}
        <Button variant="outline">
          <User className="mr-2 h-4 w-4" />
          Update Profile
        </Button>
      </div>
    </div>
          <Separator />

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
