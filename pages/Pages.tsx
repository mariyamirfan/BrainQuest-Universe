
import React, { useState } from 'react';
import { GAMES, BLOG_POSTS, ACHIEVEMENTS, DAILY_CHALLENGES, PRIVACY_TEXT, TERMS_TEXT, AVATARS } from '../constants';
import { Card, Button, ProgressBar, Badge, Modal } from '../components/UIComponents';
import { User, GameDef, BlogPost } from '../types';

// --- Home Page ---
export const HomePage: React.FC<{ navigate: (p: string) => void }> = ({ navigate }) => (
  <div className="space-y-12 animate-in fade-in duration-500">
    {/* Hero */}
    <div className="text-center py-16 space-y-6">
      <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
        Train Your <span className="text-brand-600">Brain</span>
        <br /> Unlock the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Universe</span>
      </h1>
      <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        Join the ultimate cognitive training platform. 20+ mini-games, AI coaching, and global leaderboards.
      </p>
      <div className="flex justify-center gap-4">
        <Button onClick={() => navigate('#/games')} className="!text-lg !px-8 !py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1">Play Now</Button>
        <Button onClick={() => navigate('#/about')} variant="outline" className="!text-lg !px-8 !py-4">Learn More</Button>
      </div>
    </div>

    {/* Featured Games */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {GAMES.slice(0, 4).map(game => (
        <Card key={game.id} onClick={() => navigate(`#/details/${game.id}`)} className="group hover:-translate-y-1 transition-transform">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{game.icon}</div>
          <h3 className="text-xl font-bold mb-2 dark:text-white">{game.title}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{game.description}</p>
          <div className="flex gap-2">
            <Badge color="blue">{game.category}</Badge>
            <Badge color="orange">{game.difficulty}</Badge>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// --- Game Hub ---
export const GameHub: React.FC<{ navigate: (p: string) => void }> = ({ navigate }) => {
    const [filter, setFilter] = useState('All');
    
    const filteredGames = filter === 'All' ? GAMES : GAMES.filter(g => g.category === filter);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-3xl font-bold dark:text-white">All Games</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All', 'Puzzle', 'Action', 'Logic', 'Memory', 'Education', 'Creative'].map(cat => (
                <Button key={cat} variant={filter === cat ? 'primary' : 'ghost'} onClick={() => setFilter(cat)}>{cat}</Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map(game => (
            <Card key={game.id} onClick={() => navigate(`#/details/${game.id}`)} className="relative overflow-hidden group border-transparent hover:border-brand-200 dark:hover:border-brand-900">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-9xl pointer-events-none transform translate-x-4 -translate-y-4 rotate-12">
                {game.icon}
              </div>
              <div className="relative z-10">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{game.icon}</div>
                <h3 className="text-2xl font-bold mb-2 dark:text-white">{game.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{game.description}</p>
                <div className="flex justify-between items-center">
                     <Badge color="gray">{game.difficulty}</Badge>
                     <span className="text-brand-600 font-medium group-hover:translate-x-1 transition-transform">Play →</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
};

// --- Game Details Page (New) ---
export const GameDetailsPage: React.FC<{ id: string, navigate: (p: string) => void }> = ({ id, navigate }) => {
    const game = GAMES.find(g => g.id === id);
    if (!game) return <div>Game not found</div>;

    return (
        <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
            <Button variant="ghost" onClick={() => navigate('#/games')} className="mb-6">← Back to Hub</Button>
            <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-dark-border flex flex-col md:flex-row gap-12 items-center">
                <div className="w-48 h-48 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center text-9xl shadow-inner">
                    {game.icon}
                </div>
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <div>
                        <div className="flex gap-3 justify-center md:justify-start mb-4">
                            <Badge color="blue">{game.category}</Badge>
                            <Badge color="orange">{game.difficulty}</Badge>
                        </div>
                        <h1 className="text-5xl font-bold dark:text-white mb-4">{game.title}</h1>
                        <p className="text-xl text-gray-500 dark:text-gray-400">{game.description}</p>
                    </div>
                    
                    <div className="flex gap-4 justify-center md:justify-start">
                        <Button onClick={() => navigate(`#/play/${game.id}`)} className="!text-xl !px-10 !py-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                            Play Now
                        </Button>
                        {/* Placeholder for future high score */}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-gray-500 uppercase font-bold">Best Score</div>
                            <div className="text-2xl font-bold dark:text-white">--</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-12 text-center text-gray-400 text-sm">
                Playing this game earns you XP and helps unlock achievements.
            </div>
        </div>
    );
};


// --- Profile Page ---
export const ProfilePage: React.FC<{ user: User, onUpdateUser: (u: User) => void, navigate: (p: string) => void }> = ({ user, onUpdateUser, navigate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user.name);
    const [editBio, setEditBio] = useState(user.bio);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    const handleSaveProfile = () => {
        onUpdateUser({
            ...user,
            name: editName,
            bio: editBio
        });
        setIsEditing(false);
    };

    const handleAvatarSelect = (avatar: string) => {
        onUpdateUser({ ...user, avatar });
        setShowAvatarModal(false);
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-dark-border flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          {/* Avatar Section */}
          <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-6xl shadow-xl mb-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowAvatarModal(true)}>
                {user.avatar}
              </div>
              <Button variant="ghost" className="text-xs" onClick={() => setShowAvatarModal(true)}>Change Avatar</Button>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-4 w-full relative z-10">
            <div className="flex justify-between items-start">
                 <div className="w-full">
                     {isEditing ? (
                         <div className="space-y-4 mb-4">
                             <input 
                                className="text-3xl font-bold dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 w-full outline-none" 
                                value={editName} 
                                onChange={(e) => setEditName(e.target.value)} 
                                autoFocus
                             />
                             <textarea 
                                className="w-full p-2 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border outline-none resize-none" 
                                rows={3}
                                value={editBio} 
                                onChange={(e) => setEditBio(e.target.value)} 
                                placeholder="Write a short bio..."
                             />
                             <div className="flex gap-2">
                                 <Button onClick={handleSaveProfile} className="!py-1">Save</Button>
                                 <Button variant="ghost" onClick={() => setIsEditing(false)} className="!py-1">Cancel</Button>
                             </div>
                         </div>
                     ) : (
                         <>
                             <div className="flex justify-between items-center mb-2">
                                <h2 className="text-3xl font-bold dark:text-white">{user.name}</h2>
                                <Button variant="ghost" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                             </div>
                             <p className="text-gray-500 dark:text-gray-400 mb-4">{user.bio || "No bio yet. Click edit to add one!"}</p>
                         </>
                     )}
                 </div>
            </div>

            {/* Level Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold dark:text-gray-300">
                <span>Level {user.level}</span>
                <span>{user.xp} / {((Math.floor(user.xp / 1000) + 1) * 1000)} XP</span>
              </div>
              <ProgressBar value={user.xp % 1000} max={1000} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 pt-4">
               <div className="text-center bg-brand-50 dark:bg-brand-900/20 p-3 rounded-xl">
                 <div className="text-2xl font-bold dark:text-white">{user.gems} 💎</div>
                 <div className="text-xs text-gray-500 uppercase tracking-wider">Gems</div>
               </div>
               <div className="text-center bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl">
                 <div className="text-2xl font-bold dark:text-white">{user.achievements.length} 🏆</div>
                 <div className="text-xs text-gray-500 uppercase tracking-wider">Awards</div>
               </div>
               {/* Mini Rewards */}
               {user.miniRewards && user.miniRewards.map((reward, i) => (
                   <div key={i} className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl">
                       <div className="text-2xl font-bold dark:text-white">{reward.amount} {reward.type === 'coin' ? '🪙' : '🎫'}</div>
                       <div className="text-xs text-gray-500 uppercase tracking-wider">{reward.type}s</div>
                   </div>
               ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* History Section */}
            <div>
                <h3 className="text-2xl font-bold dark:text-white mb-4">Game History</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {user.history.length === 0 && <p className="text-gray-500 italic">No games played yet. Go play!</p>}
                {user.history.slice().reverse().map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate(`#/play/${h.gameId}`)}>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl group-hover:scale-110 transition-transform">{GAMES.find(g => g.id === h.gameId)?.icon}</span>
                            <div>
                                <div className="font-medium dark:text-white">{GAMES.find(g => g.id === h.gameId)?.title || h.gameId}</div>
                                <div className={`text-xs font-bold ${h.status === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                                    {h.status ? h.status.toUpperCase() : 'PLAYED'}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-brand-600">+{h.score} pts</div>
                            <div className="text-xs text-gray-400">{new Date(h.date).toLocaleDateString()}</div>
                            <div className="text-xs text-brand-500 group-hover:underline">Replay ↺</div>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Achievements Section */}
            <div>
                 <h3 className="text-2xl font-bold dark:text-white mb-4">Earned Awards</h3>
                 <div className="grid grid-cols-2 gap-4">
                     {user.achievements.length === 0 && <p className="text-gray-500 italic col-span-2">No achievements yet. Keep playing!</p>}
                     {user.achievements.map((achId) => {
                         const ach = ACHIEVEMENTS.find(a => a.id === achId);
                         if (!ach) return null;
                         return (
                             <div key={ach.id} className="p-4 rounded-xl border bg-brand-50 border-brand-200 dark:bg-brand-900/20 dark:border-brand-800 flex flex-col items-center text-center">
                                 <div className="text-3xl mb-2">{ach.icon}</div>
                                 <div className="font-bold text-sm dark:text-white">{ach.title}</div>
                                 <div className="text-xs text-gray-500">{ach.description}</div>
                             </div>
                         )
                     })}
                 </div>
            </div>
        </div>

        {/* Avatar Modal */}
        <Modal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)} title="Choose Avatar">
            <div className="grid grid-cols-4 gap-4">
                {AVATARS.map((av) => (
                    <button 
                        key={av} 
                        onClick={() => handleAvatarSelect(av)}
                        className={`text-4xl p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${user.avatar === av ? 'bg-brand-100 dark:bg-brand-900 ring-2 ring-brand-500' : ''}`}
                    >
                        {av}
                    </button>
                ))}
            </div>
        </Modal>
      </div>
    );
};

// --- Leaderboard Page ---
export const LeaderboardPage: React.FC = () => {
    const players = [
        { rank: 1, name: 'CyberNinja', xp: 45000, level: 12 },
        { rank: 2, name: 'Brainiac99', xp: 42000, level: 11 },
        { rank: 3, name: 'PuzzleQueen', xp: 38000, level: 10 },
        { rank: 4, name: 'SpeedyGonz', xp: 31000, level: 9 },
        { rank: 5, name: 'LogicMaster', xp: 25000, level: 8 },
        { rank: 6, name: 'You', xp: 0, level: 1 },
    ];

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold mb-8 dark:text-white text-center">Global Leaderboard</h2>
            <div className="space-y-4">
                {players.map((p) => (
                    <div key={p.rank} className="flex items-center p-4 bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border hover:scale-[1.02] transition-transform">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 ${
                            p.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                            p.rank === 2 ? 'bg-gray-100 text-gray-700' :
                            p.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-transparent text-gray-500'
                        }`}>
                            #{p.rank}
                        </div>
                        <div className="flex-1 font-bold dark:text-white">{p.name}</div>
                        <div className="text-right">
                            <div className="font-bold text-brand-600">{p.xp.toLocaleString()} XP</div>
                            <div className="text-xs text-gray-400">Level {p.level}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- Daily Challenges Page ---
export const DailyChallengesPage: React.FC = () => (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold mb-8 dark:text-white">Daily Challenges</h2>
        <div className="space-y-4">
            {DAILY_CHALLENGES.map(challenge => (
                <div key={challenge.id} className="bg-white dark:bg-dark-surface p-6 rounded-2xl border border-gray-100 dark:border-dark-border flex justify-between items-center shadow-sm">
                    <div className="flex gap-4 items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${challenge.isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                           {challenge.isCompleted ? '✓' : '🎯'}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg dark:text-white">{challenge.title}</h3>
                            <p className="text-gray-500 text-sm">{challenge.goal}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-brand-600">+{challenge.reward} XP</div>
                        {challenge.isCompleted ? (
                             <span className="text-xs text-green-500 font-bold">COMPLETED</span>
                        ) : (
                             <Button className="!py-1 !px-3 !text-xs mt-1" onClick={() => window.location.hash = `#/details/${challenge.gameId}`}>Go</Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- Achievements Page ---
export const AchievementsPage: React.FC<{ user: User }> = ({ user }) => (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        <div className="text-center mb-10">
             <h2 className="text-3xl font-bold dark:text-white">Achievements</h2>
             <p className="text-gray-500">Unlock badges by mastering games</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACHIEVEMENTS.map(ach => {
                const isUnlocked = user.achievements.includes(ach.id);
                return (
                    <div key={ach.id} className={`relative p-6 rounded-2xl border transition-all ${isUnlocked ? 'bg-white dark:bg-dark-surface border-brand-200 dark:border-brand-800 shadow-sm' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-dark-border opacity-60'}`}>
                        <div className={`text-5xl mb-4 ${isUnlocked ? 'grayscale-0' : 'grayscale filter'}`}>{ach.icon}</div>
                        <h3 className="font-bold text-lg dark:text-white">{ach.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{ach.description}</p>
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            +{ach.xpReward} XP
                        </div>
                        {isUnlocked && <div className="absolute top-4 right-4 text-green-500 text-xl">✓</div>}
                    </div>
                );
            })}
        </div>
    </div>
);

// --- Settings Page ---
export const SettingsPage: React.FC<{ user: User, onUpdateUser: (u: User) => void }> = ({ user, onUpdateUser }) => {
    const toggleSetting = (key: keyof typeof user.settings) => {
        onUpdateUser({
            ...user,
            settings: { ...user.settings, [key]: !user.settings[key as any] } // Simple toggle
        });
    };

    const resetProgress = () => {
        if(confirm("Are you sure? This will wipe all your data!")) {
             localStorage.clear();
             window.location.reload();
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
             <h2 className="text-3xl font-bold mb-8 dark:text-white">Settings</h2>
             <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border divide-y divide-gray-100 dark:divide-dark-border">
                 <div className="p-6 flex justify-between items-center">
                     <div>
                         <h3 className="font-medium dark:text-white">Sound Effects</h3>
                         <p className="text-sm text-gray-500">Play sounds during games</p>
                     </div>
                     <button onClick={() => toggleSetting('sound')} className={`w-12 h-6 rounded-full transition-colors relative ${user.settings.sound ? 'bg-brand-500' : 'bg-gray-300'}`}>
                         <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${user.settings.sound ? 'left-6.5 translate-x-1' : 'left-0.5'}`}></div>
                     </button>
                 </div>
                 <div className="p-6 flex justify-between items-center">
                     <div>
                         <h3 className="font-medium dark:text-white">Notifications</h3>
                         <p className="text-sm text-gray-500">Daily challenge reminders</p>
                     </div>
                     <button onClick={() => toggleSetting('notifications')} className={`w-12 h-6 rounded-full transition-colors relative ${user.settings.notifications ? 'bg-brand-500' : 'bg-gray-300'}`}>
                         <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${user.settings.notifications ? 'left-6.5 translate-x-1' : 'left-0.5'}`}></div>
                     </button>
                 </div>
                 <div className="p-6">
                     <h3 className="font-medium text-red-500 mb-2">Danger Zone</h3>
                     <Button variant="outline" onClick={resetProgress} className="border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300">Reset Progress</Button>
                 </div>
             </div>
        </div>
    );
};

// --- Blog Page & Single Post ---
export const BlogPage: React.FC<{ navigate: (p: string) => void }> = ({ navigate }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-center">
            <h2 className="text-3xl font-bold dark:text-white mb-2">BrainQuest Blog</h2>
            <p className="text-gray-500">News, tips, and science behind the games.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map(post => (
                <Card key={post.id} className="flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`#/blog/${post.id}`)}>
                    <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center text-6xl shadow-inner">
                        {post.imagePlaceholder}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge color="purple">{post.category}</Badge>
                        <span className="text-xs text-gray-500">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 dark:text-white">{post.title}</h3>
                    <p className="text-gray-500 text-sm flex-1">{post.excerpt}</p>
                    <span className="mt-4 text-brand-600 font-medium hover:underline">Read Article →</span>
                </Card>
            ))}
        </div>
    </div>
);

export const BlogPostPage: React.FC<{ id: string, navigate: (p: string) => void }> = ({ id, navigate }) => {
    const post = BLOG_POSTS.find(p => p.id === parseInt(id));
    if (!post) return <div className="text-center p-8">Post not found</div>;

    return (
        <article className="max-w-3xl mx-auto animate-in fade-in duration-500">
            <Button variant="ghost" onClick={() => navigate('#/blog')} className="mb-6">← Back to Blog</Button>
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-8 flex items-center justify-center text-8xl shadow-inner">
                {post.imagePlaceholder}
            </div>
            <div className="flex gap-4 mb-4">
                 <Badge color="purple">{post.category}</Badge>
                 <span className="text-gray-500">{post.date}</span>
            </div>
            <h1 className="text-4xl font-bold mb-8 dark:text-white">{post.title}</h1>
            <div className="prose dark:prose-invert prose-lg max-w-none">
                {post.content.map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{paragraph}</p>
                ))}
            </div>
        </article>
    );
};

// --- About Page ---
export const AboutPage: React.FC = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold dark:text-white">About BrainQuest</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">The most advanced cognitive training platform on the web.</p>
        </div>
        <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                BrainQuest Universe was founded with a simple mission: to make brain training fun, accessible, and beautiful. 
                We combine cutting-edge web technologies with proven cognitive exercises to create an ecosystem that grows with you.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 my-12">
                <div className="text-center p-6 bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                    <div className="text-4xl mb-4">🚀</div>
                    <h3 className="font-bold mb-2 dark:text-white">Fast & Fluid</h3>
                    <p className="text-sm text-gray-500">Built with React and Tailwind for zero lag and perfect responsiveness.</p>
                </div>
                <div className="text-center p-6 bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                    <div className="text-4xl mb-4">🤖</div>
                    <h3 className="font-bold mb-2 dark:text-white">AI Powered</h3>
                    <p className="text-sm text-gray-500">Codey (Gemini API) adapts to your skill level and encourages you.</p>
                </div>
                <div className="text-center p-6 bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                    <div className="text-4xl mb-4">🎨</div>
                    <h3 className="font-bold mb-2 dark:text-white">Beautiful</h3>
                    <p className="text-sm text-gray-500">Minimalist aesthetic inspired by top modern brands.</p>
                </div>
            </div>
        </div>
    </div>
);

// --- Gallery Page ---
export const GalleryPage: React.FC = () => {
    // Mock image placeholders using emojis/colors
    const images = ['🌌', '🎮', '🧩', '🏆', '🤖', '🎲', '🎨', '🎯', '🎼'];
    
    return (
        <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold mb-8 dark:text-white text-center">Community Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((emoji, i) => (
                    <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-6xl hover:scale-[1.02] transition-transform cursor-pointer shadow-sm">
                        {emoji}
                    </div>
                ))}
            </div>
        </div>
    )
};

// --- Other Pages (Minimal Implementation) ---
export const ContactPage: React.FC = () => (
    <div className="max-w-md mx-auto bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Contact Us</h2>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Sent!"); }}>
            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                <input type="email" required className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-bg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="you@example.com" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Message</label>
                <textarea required className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-bg h-32 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="How can we help?"></textarea>
            </div>
            <Button className="w-full">Send Message</Button>
        </form>
    </div>
);

export const FeedbackPage: React.FC = () => (
     <div className="max-w-md mx-auto bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Give Feedback</h2>
        <p className="mb-4 text-gray-500">Help us improve BrainQuest!</p>
        <div className="flex gap-4 justify-center text-4xl mb-6">
            <button className="hover:scale-110 transition-transform">😍</button>
            <button className="hover:scale-110 transition-transform">🙂</button>
            <button className="hover:scale-110 transition-transform">😐</button>
            <button className="hover:scale-110 transition-transform">🙁</button>
        </div>
        <textarea className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border dark:bg-dark-bg h-32 mb-4" placeholder="Tell us more..."></textarea>
        <Button className="w-full">Submit Feedback</Button>
    </div>
);

export const HelpPage: React.FC = () => (
    <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold dark:text-white">Help & FAQ</h2>
        <div className="space-y-4">
            <details className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-100 dark:border-dark-border">
                <summary className="font-bold cursor-pointer dark:text-white flex justify-between">How do I unlock new games? <span>+</span></summary>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Play existing games to earn XP. As you level up, new games will automatically unlock in your Game Hub.</p>
            </details>
            <details className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-100 dark:border-dark-border">
                <summary className="font-bold cursor-pointer dark:text-white flex justify-between">Is Codey really AI? <span>+</span></summary>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Yes! Codey is powered by the advanced Gemini API. He understands context, remembers your name, and helps you improve.</p>
            </details>
        </div>
    </div>
);

export const LegalPage: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => (
    <div className="max-w-3xl mx-auto bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
        <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
            {type === 'privacy' ? PRIVACY_TEXT : TERMS_TEXT}
        </div>
    </div>
);

// --- AI Agent Full Page ---
export const AgentFullPage: React.FC<{ onOpenChat: () => void }> = ({ onOpenChat }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <div className="w-32 h-32 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center text-6xl animate-bounce-slow shadow-xl">
            🤖
        </div>
        <div className="max-w-md space-y-4">
            <h1 className="text-4xl font-bold dark:text-white">Hi, I'm Codey!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
                I'm your personal AI companion for BrainQuest. I can help you with game strategies, explain complex topics, or just chat about life!
            </p>
        </div>
        <Button onClick={onOpenChat} className="!text-lg !px-8 !py-3 shadow-lg hover:shadow-xl">
            Start Chatting
        </Button>
    </div>
);
