
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Calendar, Share2, UserPlus, Shield, BookOpen, Award, User } from "lucide-react";
import ChatRoom from "@/components/ChatRoom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PersonalChatContainer from "@/components/chat/PersonalChatContainer";

const Community = () => {
  const forumTopics = [
    {
      id: 1,
      title: "Best warmup exercises for BJJ",
      author: "johnsmith",
      replies: 24,
      views: 156,
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      title: "Muay Thai vs Kickboxing - Main differences?",
      author: "kickmaster",
      replies: 37,
      views: 302,
      lastActivity: "5 hours ago"
    },
    {
      id: 3,
      title: "Tips for improving your guard in BJJ",
      author: "bjjprofessor",
      replies: 19,
      views: 142,
      lastActivity: "1 day ago"
    },
    {
      id: 4,
      title: "Upcoming tournaments in California",
      author: "competitor123",
      replies: 8,
      views: 95,
      lastActivity: "2 days ago"
    },
    {
      id: 5,
      title: "Recommended gear for beginners",
      author: "newbiefighter",
      replies: 42,
      views: 278,
      lastActivity: "3 days ago"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Annual BJJ Championship",
      date: "June 15, 2023",
      location: "Los Angeles, CA",
      participants: 156
    },
    {
      id: 2,
      title: "Muay Thai Seminar with World Champion",
      date: "July 22, 2023",
      location: "San Francisco, CA",
      participants: 78
    },
    {
      id: 3,
      title: "Women's Self-Defense Workshop",
      date: "August 5, 2023",
      location: "San Diego, CA",
      participants: 45
    }
  ];

  const communityGroups = [
    {
      id: 1,
      name: "BJJ Fundamentals",
      description: "A group focused on Brazilian Jiu-Jitsu fundamentals and techniques for beginners and intermediates",
      members: 156,
      icon: <BookOpen className="h-10 w-10 text-blue-500" />,
      category: "Brazilian Jiu-Jitsu",
      activity: "Very Active"
    },
    {
      id: 2,
      name: "Muay Thai Practitioners",
      description: "Discuss training methods, techniques, and events related to Muay Thai",
      members: 128,
      icon: <Award className="h-10 w-10 text-red-500" />,
      category: "Muay Thai",
      activity: "Active"
    },
    {
      id: 3,
      name: "MMA Strategy Discussion",
      description: "Analysis of fight strategies and techniques across various MMA events",
      members: 203,
      icon: <Shield className="h-10 w-10 text-green-500" />,
      category: "Mixed Martial Arts",
      activity: "Very Active"
    },
    {
      id: 4,
      name: "Women in Martial Arts",
      description: "A supportive community for women practicing all forms of martial arts",
      members: 92,
      icon: <Users className="h-10 w-10 text-purple-500" />,
      category: "Various",
      activity: "Active"
    },
    {
      id: 5,
      name: "Traditional Martial Arts",
      description: "Discussion about traditional martial arts, philosophy, and techniques",
      members: 76,
      icon: <BookOpen className="h-10 w-10 text-orange-500" />,
      category: "Traditional Arts",
      activity: "Moderate"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Martial Arts Community</h1>
        
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Input placeholder="Search the community..." className="max-w-md" />
            <Button className="bg-green-600 hover:bg-green-700">Search</Button>
          </div>
        </div>
        
        <Tabs defaultValue="forum" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="forum" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Forum
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Groups
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Live Chat
            </TabsTrigger>
            <TabsTrigger value="personal-chat" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="forum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Discussions</CardTitle>
                <CardDescription>Join the conversation with fellow martial artists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {forumTopics.map(topic => (
                    <div key={topic.id} className="py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer">{topic.title}</h3>
                          <p className="text-sm text-gray-500">Posted by {topic.author} • Last activity {topic.lastActivity}</p>
                        </div>
                        <div className="text-sm text-gray-500 text-right">
                          <p>{topic.replies} replies</p>
                          <p>{topic.views} views</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700">Start a New Discussion</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="groups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Groups</CardTitle>
                <CardDescription>Join groups related to your martial arts interests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {communityGroups.map(group => (
                    <Card key={group.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {group.icon}
                            <div>
                              <CardTitle className="text-lg">{group.name}</CardTitle>
                              <p className="text-xs font-medium text-gray-500">{group.category}</p>
                            </div>
                          </div>
                          <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {group.activity}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-3">{group.description}</p>
                        <p className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="h-4 w-4" /> {group.members} members
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 bg-gray-50">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                          <UserPlus className="h-4 w-4" /> Join Group
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" /> Share
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-between items-center">
                  <Button variant="outline" className="border-green-600 text-green-600">
                    Browse All Groups
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Create a New Group
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Martial arts events, tournaments, and seminars</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map(event => (
                    <Card key={event.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="flex items-center gap-2 text-sm mb-1">
                          <Calendar className="h-4 w-4" /> {event.date}
                        </p>
                        <p className="flex items-center gap-2 text-sm mb-1">
                          <Users className="h-4 w-4" /> {event.participants} participants
                        </p>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">Join</Button>
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" /> Share
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700">View All Events</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Members</CardTitle>
                <CardDescription>Connect with martial arts enthusiasts</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  Sign in to view and connect with community members
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-600 hover:bg-green-700">Sign In to View Members</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Chat</CardTitle>
                <CardDescription>Chat with fellow martial arts enthusiasts in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChatRoom />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal-chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Chat</CardTitle>
                <CardDescription>Have private conversations with other community members</CardDescription>
              </CardHeader>
              <CardContent>
                <PersonalChatContainer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;
