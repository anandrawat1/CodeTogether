import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { 
  LuCode, 
  LuVideo, 
  LuMonitorPlay, 
  LuPlay, 
  LuDownload, 
  LuPenTool 
} from "react-icons/lu";

const features = [
  {
    title: "Real-Time Code Editing",
    description: "Code together in real-time with your team members. See changes instantly as they happen.",
    icon: <LuCode size={24} />
  },
  {
    title: "Video Calls & Live Chat",
    description: "Connect with your team using built-in video calls and live chat for smooth, effective collaboration.",
    icon: <LuVideo size={24} />
  },
  {
    title: "Real-Time Preview",
    description: "See frontend output update in real-time as you write HTML, CSS, or JavaScript.",
    icon: <LuMonitorPlay size={24} />
  },
  {
    title: "Compilation & Execution",
    description: "Write, compile, and execute code live within the platform no external setup required.",
    icon: <LuPlay  size={24} />
  },
  {
    title: "Download Code",
    description: "Download your code files with a single click. Take your work with you or share it anywhere.",
    icon: <LuDownload size={24} />
  },
  {
    title: "Collaborative Whiteboard",
    description: "Draw, sketch, and visualize ideas together using a shared interactive whiteboard.",
    icon: <LuPenTool size={24} />
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

            <div className="text-center max-w-4xl mx-auto mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-[#bbb8ff] to-[#232329] text-transparent bg-clip-text">
              Collaborative Code Editor
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-4xl mx-auto">
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
              <p className="max-w-4xl text-gray-300 md:text-lg">
                Our platform offers a powerful suite of tools designed for seamless remote programming, team collaboration, and real-time productivity. Code, communicate, and create together.
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