"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import Notes from "@/components/Notes";
import Timeline from "@/components/Timeline";
import Chatbot from "@/components/Chatbot";
import QuickLearn from "@/components/QuickLearn";
import Usage from "@/components/Usage";
import CreateNoteDialog from "@/components/CreateNoteDialog";
import InitialSurvey from "@/components/InitialSurvey";
import SettingsButton from "@/components/SettingsButton";
import StudyFocusTimer from "@/components/StudyFocusTimer";


const getGreeting = (name: string) => {
  const currentHour = new Date().getHours();
  let greeting = "Good Morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good Evening";
  }

  const firstName = name.split(" ")[0];
  return `${greeting}, ${firstName} 👋`;
};

const formatDate = () => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};

const DashboardPage = () => {
  const today = formatDate();
  const [isMobile, setIsMobile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [userName, setUserName] = useState("");
  const { userId } = useAuth();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        console.log("Fetching user status");
        let response;
        if (userId) {
          console.log("Fetching user status for userId:", userId);
          response = await axios.get(`/api/getUserStatus?userId=${userId}`);
        } else {
          console.log("No userId available, fetching default status");
          response = await axios.get(`/api/getUserStatus`);
        }
        console.log("User status response:", response.data);
        const { name } = response.data;

        setUserName(name || "Guest");
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    };

    checkUserStatus();
  }, [userId]);

  const handleSurveyComplete = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`/api/getUserStatus?userId=${userId}`);
      console.log("Survey completed, updated user status:", response.data);
      setUserName(response.data.name || "");
      setShowSurvey(false);
    } catch (error) {
      console.error('Error fetching user name after survey completion:', error);
    }
  };

  const handleSurveyClose = () => {
    setShowSurvey(false);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-[#f4f4f4] min-h-screen font-['MD_Grotesk_Regular']">
      {showSurvey && <InitialSurvey onComplete={handleSurveyComplete} onClose={handleSurveyClose} />}
      <div className="max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
          <div className="flex flex-col items-start mb-4 sm:mb-0">
            <h1 className="text-3xl sm:text-3xl font-bold text-gray-900 mt-2">
              {getGreeting(userName)}
            </h1>
            <p className="text-gray-500 mt-2 text-xl">{today}</p>
          </div>
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-center space-y-4 sm:space-y-0 sm:space-x-4`}>
            <QuickLearn />
            <CreateNoteDialog open={isDialogOpen} onClose={handleDialogClose} />
            <SettingsButton />
          </div>
        </div>
        <Separator className="mb-6" />
        {isMobile ? (
          <div className="grid grid-cols-1 gap-6">
            <div className="text-white p-4 overflow-hidden rounded-lg h-60">
              <Notes />
            </div>
            <div className="bg-white p-4 overflow-y-auto rounded-lg custom-scrollbar h-60">
              <Timeline />
            </div>
            <div className="bg-white text-white p-4 overflow-y-auto rounded-lg h-60">
              <Usage />
            </div>
            <div className="bg-white p-4 overflow-y-auto rounded-lg h-60">
              <Chatbot />
            </div>
          </div>
        ) : (
          <div className="grid grid-rows-[1fr_auto] gap-6" style={{ height: 'calc(100vh - 300px)' }}>
            <div className="text-white p-4 overflow-y-auto rounded-lg mb-4 h-72">
              <Notes />
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white p-4 overflow-y-auto rounded-lg custom-scrollbar h-[26rem]">
                <StudyFocusTimer />
              </div>
              <div className="bg-white text-white p-4 overflow-y-auto rounded-lg custom-scrollbar h-[26rem]">
                <Usage />
              </div>
              <div className="bg-white p-4 overflow-y-auto rounded-lg custom-scrollbar h-[26rem]">
                <Chatbot />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
