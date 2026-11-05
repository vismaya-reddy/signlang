'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Users,
  Search,
  UserPlus,
  MessageSquare,
  Trophy,
  Flame,
} from 'lucide-react';
import { useState } from 'react';

type User = {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  isFriend: boolean;
};

const mockUsers: User[] = [
  { id: '1', name: 'Sarah Chen', avatar: '👩‍🦰', level: 8, xp: 4200, streak: 14, isFriend: true },
  { id: '2', name: 'Marcus Johnson', avatar: '👨‍🦱', level: 6, xp: 3100, streak: 9, isFriend: false },
  { id: '3', name: 'Emma Davis', avatar: '👩‍🦲', level: 5, xp: 2450, streak: 7, isFriend: true },
  { id: '4', name: 'James Wilson', avatar: '👨‍🦲', level: 7, xp: 3800, streak: 11, isFriend: false },
  { id: '5', name: 'Lisa Zhang', avatar: '👩', level: 4, xp: 1900, streak: 5, isFriend: false },
  { id: '6', name: 'David Brown', avatar: '👨', level: 6, xp: 2900, streak: 8, isFriend: true },
];

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<User[]>(mockUsers.filter(u => u.isFriend));

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFriend = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;

    if (friends.find(f => f.id === userId)) {
      setFriends(friends.filter(f => f.id !== userId));
    } else {
      setFriends([...friends, user]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-display font-bold">Community</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search learners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Your Friends */}
        {friends.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-display font-bold">Your Friends</h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {friends.map((user) => (
                <motion.div key={user.id} variants={itemVariants}>
                  <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{user.avatar}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-xs text-muted-foreground">Level {user.level}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                      <div className="bg-background/50 rounded p-2">
                        <p className="text-muted-foreground">XP</p>
                        <p className="font-semibold">{user.xp}</p>
                      </div>
                      <div className="bg-background/50 rounded p-2 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <div>
                          <p className="text-muted-foreground">Streak</p>
                          <p className="font-semibold">{user.streak}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFriend(user.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}

        {/* Browse Learners */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-display font-bold">
            {searchQuery ? 'Search Results' : 'Find Learners'}
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredUsers
              .filter(u => !friends.find(f => f.id === u.id))
              .map((user) => (
                <motion.div key={user.id} variants={itemVariants}>
                  <Card className="p-4 hover:border-secondary/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{user.avatar}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-xs text-muted-foreground">Level {user.level}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                      <div className="bg-muted rounded p-2">
                        <p className="text-muted-foreground">XP</p>
                        <p className="font-semibold">{user.xp}</p>
                      </div>
                      <div className="bg-muted rounded p-2 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <div>
                          <p className="text-muted-foreground">Streak</p>
                          <p className="font-semibold">{user.streak}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-secondary to-secondary/80"
                      onClick={() => toggleFriend(user.id)}
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Add Friend
                    </Button>
                  </Card>
                </motion.div>
              ))}
          </motion.div>
        </motion.section>

        {/* Leaderboard */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-display font-bold">Top Learners</h2>
          <Card className="overflow-hidden bg-card/50 border-border/50">
            <div className="space-y-2 p-4">
              {mockUsers
                .sort((a, b) => b.xp - a.xp)
                .slice(0, 5)
                .map((user, idx) => (
                  <div key={user.id} className="flex items-center gap-4 p-3 hover:bg-accent/5 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">Level {user.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{user.xp} XP</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {user.streak}-day streak
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}
