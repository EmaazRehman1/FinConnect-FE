import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Terminal, Shield, Code, Zap, Database, Lock } from 'lucide-react';
import Navbar from '@/components/Shared/Navbar';

const features = [
  {
    icon: <Terminal className="h-8 w-8" />,
    title: "Transaction-Focused",
    description: "Powerful system for managing, tracking, and automating financial transactions across multiple endpoints."
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "End-to-End Security",
    description: "Secure transactions with JWT, RBAC, encryption protocols, and built-in fraud detection mechanisms."
  },
  {
    icon: <Code className="h-8 w-8" />,
    title: "Integrated Test Mode",
    description: "Use mock transaction data to safely test workflows without risking live operations."
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Instant Transaction Processing",
    description: "Support for real-time transaction events, alerts, and automatic ledger updates."
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: "Comprehensive Ledger",
    description: "Full transaction history with smart filtering, export capabilities, and audit trail."
  },
  {
    icon: <Lock className="h-8 w-8" />,
    title: "Admin & Compliance",
    description: "Manage users, monitor activity, and ensure transaction-level compliance via an intuitive admin console."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
        <Navbar/>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-20 rounded-xl mt-16">
        <div className="container max-w-screen-xl mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The Transaction Engine Built for Scale
          </motion.h1>
          <motion.p
            className="text-xl max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            FinConnect gives you secure, developer-first tools to initiate, monitor, and manage transactions seamlessly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button asChild variant="secondary">
              <Link to="/pricing">View Pricing</Link>
            </Button>
            <Button variant="outline" className="bg-transparent hover:bg-white/10 border-white text-white">
              API Documentation
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Overview */}
      <div className="container max-w-screen-xl mx-auto px-4 py-16">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6">Built for Financial Operations</h2>
          <p className="text-xl text-muted-foreground mb-8">
            FinConnect streamlines transactional workflows — from initiation to confirmation — all in a secure, scalable environment tailored for modern fintech teams.
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-card border rounded-2xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>


        {/* CTA */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-8 text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Get Started with FinConnect</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Launch, test, and scale your transaction flows with confidence. Get the tools and APIs trusted by fintech teams.
          </p>
          <Button asChild variant="secondary">
            <Link to="/pricing">Choose Your Plan</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
