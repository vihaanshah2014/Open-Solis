"use client";

import React, { useEffect, useState } from 'react';
import { CalendarDays, Calendar, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const Timeline: React.FC = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('today');
  const [activeButton, setActiveButton] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/getGCal');
        const data = await response.json();
        setEvents(data);
        setInitialView(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (activeButton) {
      const button = document.getElementById(view);
      if (button) {
        setActiveButton(button as HTMLButtonElement);
      }
    }
  }, [view]);

  const setInitialView = (events) => {
    const views = ['today', 'tomorrow', 'exams'];
    for (let v of views) {
      if (filterEvents(events, v).length > 0) {
        setView(v);
        break;
      }
    }
  };

  const getRandomEmoji = () => {
    const emojis = ['🌟', '🚀', '🎉', '📚', '💡', '🏆', '🔔', '🎯', '🧩', '🌈'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const filterEvents = (events, view) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return events.filter(event => {
      const eventDate = new Date(event.start.dateTime);
      if (view === 'today') return eventDate.toDateString() === today.toDateString();
      if (view === 'tomorrow') return eventDate.toDateString() === tomorrow.toDateString();
      if (view === 'exams') return ['exam', 'test', 'quiz', 'midterm', 'final'].some(keyword => event.summary.toLowerCase().includes(keyword));
    }).slice(0, 5);
  };

  const filteredEvents = loading ? [] : filterEvents(events, view);

  const getEmptyMessage = (view) => {
    switch (view) {
      case 'today':
        return "You're all done for the day! 🎉";
      case 'tomorrow':
        return "You have nothing planned for tomorrow.";
      case 'exams':
        return "You have no exams coming up.";
      default:
        return "No events scheduled.";
    }
  };

  const getDaysAway = (eventDate: Date) => {
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const views = [
    { name: 'today', icon: CalendarDays, label: 'Today' },
    { name: 'tomorrow', icon: Calendar, label: 'Tomorrow' },
    { name: 'exams', icon: FileText, label: 'Exams' }
  ];

  return (
    <div className="bg-white text-black font-['MD_Grotesk_Regular'] py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <Link href="/planner" className="group flex items-center cursor-pointer">
            <h2 className="text-xl md:text-2xl font-bold group-hover:text-green-700 transition-colors">Schedule</h2>
            <ChevronRight className="ml-1 w-5 h-5 text-gray-400 group-hover:text-green-700 transition-colors" />
          </Link>
          <div className="flex p-0.5 bg-gray-200 rounded-lg relative">
            {views.map((v) => {
              const Icon = v.icon;
              return (
                <button
                  key={v.name}
                  id={v.name}
                  onClick={() => setView(v.name)}
                  className={`p-2 rounded relative transition-colors duration-300 ${view === v.name ? 'text-gray-900' : 'text-gray-600'}`}
                  ref={view === v.name ? (button) => setActiveButton(button) : null}
                >
                  <Icon className="xl:hidden" size={20} />
                  <span className="hidden xl:inline">{v.label}</span>
                </button>
              );
            })}
            <div
              className="absolute top-1 bottom-1 bg-gray-500 rounded opacity-10 transition-transform duration-300 ease-in-out"
              style={{
                width: activeButton ? activeButton.offsetWidth : 0,
                transform: activeButton ? `translateX(${activeButton.offsetLeft}px)` : 'translateX(0)',
              }}
            ></div>
          </div>
        </div>
        <div className="space-y-2 min-h-[300px] max-h-[350px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <p>Loading...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <React.Fragment key={event.id || index}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                    {getRandomEmoji()}
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="text-sm font-semibold">{event.summary}</div>
                    <div className="text-xs text-gray-600">
                      {view === 'exams' ? 
                        `${getDaysAway(new Date(event.start.dateTime))} days away` :
                        new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    </div>
                  </div>
                </div>
                {index < filteredEvents.length - 1 && (
                  <div className="flex items-center ml-4 mt-1 mb-1">
                    <div className="w-px h-3 bg-gray-600"></div>
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-sm">{getEmptyMessage(view)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;