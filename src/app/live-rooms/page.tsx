'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Plus,
  Users,
  Play,
  Settings,
  MessageSquare,
  Video,
  Phone,
} from 'lucide-react';

type Room = {
  id: string;
  name: string;
  host: string;
  participants: number;
  maxParticipants: number;
  isActive: boolean;
  type: '1-to-1' | 'group';
};

const mockRooms: Room[] = [
  {
    id: '1',
    name: 'ASL Alphabet Practice',
    host: 'Teacher Sarah',
    participants: 3,
    maxParticipants: 10,
    isActive: true,
    type: 'group',
  },
  {
    id: '2',
    name: 'One-on-One Lesson',
    host: 'Coach Mike',
    participants: 2,
    maxParticipants: 2,
    isActive: true,
    type: '1-to-1',
  },
  {
    id: '3',
    name: 'Numbers Learning Session',
    host: 'Instructor Emma',
    participants: 5,
    maxParticipants: 8,
    isActive: false,
    type: 'group',
  },
];

export default function LiveRoomsPage() {
  const [rooms] = useState<Room[]>(mockRooms);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

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
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-display font-bold">Live Rooms</h1>
          <Button
            onClick={() => setShowCreateRoom(true)}
            className="bg-gradient-to-r from-primary to-accent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Room
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Create Room Modal */}
        {showCreateRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <Card className="p-6 w-full max-w-md bg-background border-border/50">
              <h2 className="text-xl font-display font-bold mb-4">Create New Room</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Room Name</label>
                  <Input
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="E.g., Daily Conversation Practice"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Room Type</label>
                  <select className="w-full p-2 rounded-lg border border-border/50 bg-background/50">
                    <option value="group">Group Room (Up to 10 people)</option>
                    <option value="1-to-1">1-to-1 Lesson (Private)</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setShowCreateRoom(false);
                      setNewRoomName('');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowCreateRoom(false);
                      setNewRoomName('');
                    }}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                  >
                    Create
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Active Rooms */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <h2 className="text-2xl font-display font-bold">Active Rooms</h2>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-4"
          >
            {rooms
              .filter((r) => r.isActive)
              .map((room) => (
                <motion.div key={room.id} variants={itemVariants}>
                  <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/50 transition-colors group cursor-pointer">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-lg">{room.name}</h3>
                          <p className="text-sm text-muted-foreground">Host: {room.host}</p>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {room.participants}/{room.maxParticipants} participants
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-background/50 rounded text-xs font-medium">
                          {room.type === '1-to-1' ? 'Private' : 'Group'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-primary to-accent"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Room
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </motion.div>
        </motion.section>

        {/* Available Rooms */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-display font-bold">All Rooms</h2>

          <motion.div
            variants={containerVariants}
            className="space-y-3"
          >
            {rooms.map((room) => (
              <motion.div key={room.id} variants={itemVariants}>
                <Card
                  className={`p-4 transition-colors ${
                    room.isActive
                      ? 'hover:border-primary/50'
                      : 'opacity-60 hover:border-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{room.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {room.host} • {room.participants}/{room.maxParticipants} participants
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-1 bg-muted rounded">
                        {room.type === '1-to-1' ? 'Private' : 'Group'}
                      </span>
                      <span className={`text-xs font-medium ${room.isActive ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                        {room.isActive ? 'Live' : 'Upcoming'}
                      </span>
                      <Button size="sm" variant="ghost">
                        {room.isActive ? (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Join
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Notify
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}
