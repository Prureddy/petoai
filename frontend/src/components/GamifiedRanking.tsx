import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Share2,
  Star,
  Heart,
  Activity,
  Award,
  Gift,
  MessageSquare,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  ArrowUp,
  Users,
  Crown,
  Zap,
} from 'lucide-react';

interface HealthScore {
  category: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'needsImprovement';
  description: string;
}

interface LeaderboardEntry {
  rank: number;
  petName: string;
  score: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  isCurrentUser: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  total: number;
  earned: boolean;
}

const GamifiedRanking: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  const communityPosts = [
    {
      id: 1,
      author: "Sarah & Max",
      imageUrl: "https://images.unsplash.com/photo-1517423568366-8b83523034fd",
      timeAgo: "2 hours ago",
      likes: 24,
      comments: 12
    },
    {
      id: 2,
      author: "Mike & Luna",
      imageUrl: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9",
      timeAgo: "3 hours ago",
      likes: 18,
      comments: 8
    },
    {
      id: 3,
      author: "Emily & Bella",
      imageUrl: "https://images.unsplash.com/photo-1517849845537-4d257902454a",
      timeAgo: "4 hours ago",
      likes: 31,
      comments: 15
    }
  ];

  const healthScores: HealthScore[] = [
    {
      category: 'Activity',
      score: 90,
      maxScore: 100,
      status: 'excellent',
      description: 'Your pet is getting plenty of exercise!',
    },
    {
      category: 'Diet',
      score: 85,
      maxScore: 100,
      status: 'good',
      description: 'Diet plan adherence is good, with room for improvement.',
    },
    {
      category: 'Vet Checkups',
      score: 100,
      maxScore: 100,
      status: 'excellent',
      description: 'All checkups are up to date!',
    },
    {
      category: 'Weight Management',
      score: 75,
      maxScore: 100,
      status: 'needsImprovement',
      description: 'Consider adjusting portion sizes.',
    },
  ];

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, petName: 'Luna', score: 95, tier: 'platinum', isCurrentUser: false },
    { rank: 2, petName: 'Max', score: 92, tier: 'gold', isCurrentUser: true },
    { rank: 3, petName: 'Bella', score: 88, tier: 'gold', isCurrentUser: false },
    { rank: 4, petName: 'Charlie', score: 85, tier: 'silver', isCurrentUser: false },
    { rank: 5, petName: 'Rocky', score: 82, tier: 'silver', isCurrentUser: false },
  ];

  const badges: Badge[] = [
    {
      id: '1',
      name: 'Activity Champion',
      description: 'Maintained high activity levels for 7 consecutive days',
      icon: <Activity className="w-8 h-8" />,
      progress: 5,
      total: 7,
      earned: false,
    },
    {
      id: '2',
      name: 'Diet Master',
      description: 'Perfect diet adherence for 30 days',
      icon: <Heart className="w-8 h-8" />,
      progress: 30,
      total: 30,
      earned: true,
    },
    {
      id: '3',
      name: 'Social Star',
      description: 'Shared 10 achievements with the community',
      icon: <Star className="w-8 h-8" />,
      progress: 8,
      total: 10,
      earned: false,
    },
  ];

  const getStatusColor = (status: HealthScore['status']) => {
    switch (status) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-blue-500';
      case 'needsImprovement':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTierColor = (tier: LeaderboardEntry['tier']) => {
    switch (tier) {
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      case 'bronze':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A90E2] to-[#A8E6CF] p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Pet Health Ranking</h1>
          <p className="text-white/90">Track your pet's health score and compete with others!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overall Score Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-8 border-[#4A90E2] flex items-center justify-center bg-white">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#333333]">85</div>
                    <div className="text-sm text-[#666666]">Points</div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-[#FF6F61] text-white p-2 rounded-full">
                  <Crown className="w-5 h-5" />
                </div>
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold text-[#333333]">Gold Tier</h2>
                <p className="text-[#666666] mb-2">200 points to Platinum</p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <Trophy className="w-4 h-4 mr-1" />
                    Rank #2
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    +5 this week
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#357ABD] transition-colors flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
              <button className="bg-[#FF6F61] text-white px-4 py-2 rounded-md hover:bg-[#ff8a7f] transition-colors flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Rewards
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: <Activity className="w-5 h-5" /> },
            { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-5 h-5" /> },
            { id: 'achievements', label: 'Achievements', icon: <Award className="w-5 h-5" /> },
            { id: 'community', label: 'Community', icon: <Users className="w-5 h-5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#4A90E2] text-white'
                  : 'bg-white text-[#333333] hover:bg-[#F5F5F5]'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Score Breakdown */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {healthScores.map((score) => (
              <div key={score.category} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-[#333333]">{score.category}</h3>
                  <span className={`text-sm font-medium ${getStatusColor(score.status)}`}>
                    {score.score}/{score.maxScore}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-[#4A90E2] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[#666666]">{score.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[#333333]">Top Performers</h3>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-1 border border-gray-200 rounded-md text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="space-y-4">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    entry.isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'bg-[#F5F5F5]'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 flex items-center justify-center font-semibold text-[#333333]">
                      #{entry.rank}
                    </div>
                    <div>
                      <h4 className="font-medium text-[#333333]">{entry.petName}</h4>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getTierColor(entry.tier)}`}>
                        {entry.tier.charAt(0).toUpperCase() + entry.tier.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-semibold text-[#333333]">{entry.score}</div>
                    {entry.isCurrentUser && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        You
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`bg-white rounded-lg shadow-md p-6 ${
                  badge.earned ? 'border-2 border-green-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${badge.earned ? 'bg-green-100' : 'bg-[#F5F5F5]'}`}>
                    {badge.icon}
                  </div>
                  {badge.earned && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Earned
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">{badge.name}</h3>
                <p className="text-sm text-[#666666] mb-4">{badge.description}</p>
                {!badge.earned && (
                  <div>
                    <div className="flex justify-between text-sm text-[#666666] mb-1">
                      <span>Progress</span>
                      <span>{badge.progress}/{badge.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#4A90E2] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Community */}
        {activeTab === 'community' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-4">Community Feed</h3>
              <div className="space-y-4">
                {communityPosts.map((post) => (
                  <div key={post.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center mb-2">
                      <img
                        src={`${post.imageUrl}?auto=format&fit=crop&w=50&h=50`}
                        alt={post.author}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <h4 className="font-medium text-[#333333]">{post.author}</h4>
                        <p className="text-xs text-[#666666]">{post.timeAgo}</p>
                      </div>
                    </div>
                    <p className="text-[#333333] mb-2">
                      Just earned the Activity Champion badge! 🎉 Here's how we did it...
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-[#666666]">
                      <button className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {post.likes}
                      </button>
                      <button className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {post.comments}
                      </button>
                      <button className="flex items-center">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-4">Share Your Journey</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors">
                  <span className="flex items-center">
                    <Facebook className="w-5 h-5 mr-2" />
                    Share on Facebook
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors">
                  <span className="flex items-center">
                    <Twitter className="w-5 h-5 mr-2" />
                    Share on Twitter
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-[#E4405F] text-white rounded-lg hover:bg-[#d93a54] transition-colors">
                  <span className="flex items-center">
                    <Instagram className="w-5 h-5 mr-2" />
                    Share on Instagram
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#333333] mb-4">Quick Tips</h3>
              <div className="space-y-3">
                {[
                  'Complete daily health check-ins',
                  'Share your achievements',
                  'Engage with the community',
                ].map((tip, index) => (
                  <div key={index} className="flex items-center text-[#333333]">
                    <Zap className="w-5 h-5 text-[#FF6F61] mr-2" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default GamifiedRanking;