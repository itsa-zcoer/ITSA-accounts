import React from 'react';
import { FiGithub, FiMail, FiUsers, FiDollarSign, FiFileText, FiPieChart, FiShield, FiZap, FiTarget, FiEye } from 'react-icons/fi';
import { SiReact, SiNodedotjs, SiMongodb, SiTailwindcss, SiExpress } from 'react-icons/si';

const TeamMemberCard = ({ name, image, github, email, linkedin }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100 group">
        <div className="p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary-50 group-hover:border-primary-100 transition-colors shadow-lg">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>

            <div className="flex items-center justify-center space-x-3 mt-2 h-8">
                {github && (
                    <a href={github} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors">
                        <FiGithub className="w-5 h-5" />
                    </a>
                )}
                {email && (
                    <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                        <FiMail className="w-5 h-5" />
                    </a>
                )}
            </div>

            <a href={linkedin || "#"} target="_blank" rel="noopener noreferrer" className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline">
                View LinkedIn Profile
            </a>
        </div>
    </div>
);

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
);

const TechBadge = ({ icon: Icon, name, color }) => (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-sm font-medium text-gray-700">{name}</span>
    </div>
);

const About = () => {
    const teamMembers = [
        {
            id: 1,
            name: "Pratik Tawhare",
            image: "/images/Pratik.jpeg",
            github: "https://github.com/pratiktawhare",
            email: "pratiktawhare3@gmail.com",
            linkedin: "https://www.linkedin.com/in/pratik-tawhare"
        },
        {
            id: 2,
            name: "Aary Thasal",
            image: "/images/Aary.jpeg",
            github: "https://github.com/AaryThasal",
            email: "aarythasal1@gmail.com",
            linkedin: "https://www.linkedin.com/in/aary-thasal-9255392a7"
        },
        {
            id: 3,
            name: "Komal Mhaske",
            image: "/images/komal.jpeg",
            github: "https://github.com/Komal251005",
            email: "komalmhaske.253@gmail.com",
            linkedin: "https://www.linkedin.com/in/komal-mhaske-8b554331a/"
        },
        {
            id: 4,
            name: "Tanishka Patil",
            image: "/images/tanishka.jpeg",
            github: "https://github.com/PatilTanishkaa",
            email: "tanishkapatil26oct@gmail.com",
            linkedin: "https://www.linkedin.com/in/tanishkapatillnkdin/"
        },
        {
            id: 5,
            name: "Abhishek Tamte",
            image: "/images/Tamte.jpeg",
            github: "https://github.com/abhishek200604",
            email: "abhishektamte20@gmail.com",
            linkedin: "https://www.linkedin.com/in/abhishek-tamte-09b81421a/"
        },
        {
            id: 6,
            name: "Akash Patil",
            image: "/images/Akash.jpeg",
            github: "https://github.com/Akashpatil2005",
            email: "apatil99448@gmail.com",
            linkedin: "https://www.linkedin.com/in/akash-patil-b08335290/"
        },
        {
            id: 7,
            name: "Arbaj Sande",
            image: "/images/arbaj.jpeg",
            github: "https://github.com/ArbajSande",
            email: "arbajsande786@gmail.com",
            linkedin: "https://www.linkedin.com/in/arbaj-sande-47bb1a31b"
        },
        {
            id: 8,
            name: "Abhijeet Suryawanshi",
            image: "/images/abhijeet.jpeg",
            github: "https://github.com/Abhijeet-dev07",
            email: "abhijeetsuryawanshi23@gmail.com",
            linkedin: "https://www.linkedin.com/in/abhijeet-suryawanshi-21a587294"
        }
    ];

    const features = [
        {
            icon: FiUsers,
            title: "Student Management",
            description: "Comprehensive student database with bulk CSV upload, search, and filter capabilities.",
            color: "bg-gradient-to-br from-blue-500 to-blue-600"
        },
        {
            icon: FiDollarSign,
            title: "Fee & Payment Tracking",
            description: "Complete fee ledger management with payment tracking, receipts, and balance monitoring.",
            color: "bg-gradient-to-br from-green-500 to-green-600"
        },
        {
            icon: FiFileText,
            title: "Transaction Records",
            description: "Detailed income and expenditure tracking with exportable reports and analytics.",
            color: "bg-gradient-to-br from-purple-500 to-purple-600"
        },
        {
            icon: FiPieChart,
            title: "Financial Analytics",
            description: "Real-time dashboard with visual insights into financial health and category breakdowns.",
            color: "bg-gradient-to-br from-amber-500 to-amber-600"
        },
        {
            icon: FiShield,
            title: "Secure & Reliable",
            description: "Role-based authentication with secure data handling and encrypted credentials.",
            color: "bg-gradient-to-br from-red-500 to-red-600"
        },
        {
            icon: FiZap,
            title: "Fast & Responsive",
            description: "Modern, responsive interface optimized for seamless experience across all devices.",
            color: "bg-gradient-to-br from-cyan-500 to-cyan-600"
        }
    ];

    const techStack = [
        { icon: SiReact, name: "React", color: "text-blue-500" },
        { icon: SiNodedotjs, name: "Node.js", color: "text-green-600" },
        { icon: SiExpress, name: "Express", color: "text-gray-700" },
        { icon: SiMongodb, name: "MongoDB", color: "text-green-500" },
        { icon: SiTailwindcss, name: "Tailwind CSS", color: "text-cyan-500" }
    ];

    return (
        <div className="space-y-10 animate-fade-in-up pb-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 rounded-2xl shadow-xl overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
                </div>
                <div className="relative px-8 py-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Zeal College of Engineering & Research
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        ITSA Accounts
                    </h1>
                    <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed mb-6">
                        A comprehensive financial management platform designed for the Information Technology
                        Student Association. Streamline student fee collection, track expenditures, generate
                        reports, and maintain complete financial transparency — all in one powerful application.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {techStack.map((tech, index) => (
                            <TechBadge key={index} {...tech} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <FiTarget className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-blue-900">Our Mission</h2>
                    </div>
                    <p className="text-blue-800/80 leading-relaxed">
                        To simplify and modernize financial management for student associations by providing
                        an intuitive, reliable, and feature-rich platform that eliminates manual paperwork
                        and ensures complete accountability in handling student funds.
                    </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                            <FiEye className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-purple-900">Our Vision</h2>
                    </div>
                    <p className="text-purple-800/80 leading-relaxed">
                        To become the go-to solution for educational institutions seeking transparent and
                        efficient financial management, fostering trust between students, faculty, and
                        administration through digital transformation.
                    </p>
                </div>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Key Features</h2>
                    <p className="text-gray-600">Everything you need to manage association finances effectively</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Meet the Team</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        A passionate group of developers from Zeal College of Engineering & Research,
                        dedicated to building innovative solutions for academic management.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {teamMembers.map((member) => (
                        <TeamMemberCard key={member.id} {...member} />
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-3">Empowering Financial Transparency</h2>
                <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    This project represents our commitment to leveraging technology for better institutional
                    management. We believe in creating solutions that make a real difference in how organizations
                    handle their day-to-day operations.
                </p>
                <div className="mt-6 flex items-center justify-center gap-4 text-gray-400 text-sm">
                    <span>© 2026 ITSA Accounts</span>
                    <span>•</span>
                    <span>Zeal College of Engineering & Research</span>
                </div>
            </div>
        </div>
    );
};

export default About;
