import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const features = [
  {
    title: "Real-time Collaboration",
    description: "Code together in real-time with your team members. See changes instantly as they happen.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  },
  {
    title: "Integrated Video Calls",
    description: "Connect face-to-face with built-in video calls. Make collaboration more personal and effective.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
  },
  {
    title: "Interactive Whiteboard",
    description: "Visualize ideas and explain concepts using our built-in whiteboard feature.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>
  },
  {
    title: "Multiple Language Support",
    description: "Code in various programming languages with syntax highlighting and auto-completion.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
  },
  {
    title: "Chat & Communication",
    description: "Built-in chat system for quick communication and file sharing with your team.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  },
  {
    title: "Version Control",
    description: "Track changes and manage code versions with integrated version control support.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  }
];

const Home = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen flex flex-col bg-[#232329] text-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
            <div className="absolute inset-0 -z-10 h-full w-full bg-[#1c1e29] bg-[linear-gradient(to_right,#393E46_1px,transparent_1px),linear-gradient(to_bottom,#393E46_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

            <div className="text-center max-w-3xl mx-auto mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-[#bbb8ff] to-[#232329] text-transparent bg-clip-text">
              Collaborative Code Editor
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
                Experience seamless collaboration with real-time code editing, integrated video calls, and interactive whiteboard.
                The perfect platform for remote pair programming and team collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/room" className="inline-flex items-center justify-center rounded-full h-12 px-8 text-base bg-[#bbb8ff] text-black decoration-transparent hover:bg-[#aaaaff] transition-colors">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative mx-auto max-w-5xl">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-[#393E46] bg-[#1c1e29]">
                <img
                  src="../public/2.png"
                  alt="Code Together Editor Preview"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-16 bg-[#232329]">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-8">
              <div className="rounded-full px-4 py-1.5 text-sm font-medium bg-[#aaaaff]/20 text-[#bbb8ff]">
                Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Everything You Need to Collaborate</h2>
              <p className="max-w-[800px] text-gray-300 md:text-lg">
                Our platform provides all the essential tools for effective remote collaboration and pair programming.
                Code, communicate, and create together seamlessly.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div key={i} className="h-full overflow-hidden rounded-lg border border-[#393E46] bg-[#2A2A30] transition-colors">
                  <div className="p-6 flex flex-col h-full">
                    <div className="h-10 w-10 rounded-full bg-[#aaaaff]/20 flex items-center justify-center text-[#bbb8ff] mb-3">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
    <Footer />
    </>
  );
};

export default Home; 