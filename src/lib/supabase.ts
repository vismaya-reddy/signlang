import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Environment credentials
const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isRealSupabase = Boolean(
  rawSupabaseUrl &&
  rawSupabaseKey &&
  !rawSupabaseUrl.includes('placeholder.supabase.co') &&
  rawSupabaseKey !== 'dummy-anon-key'
);

// Real client (only if real credentials are provided)
const realClient = isRealSupabase
  ? createSupabaseClient(rawSupabaseUrl!, rawSupabaseKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
      },
    })
  : null;

// ==========================================
// IN-MEMORY MOCK STORE FOR AI STUDIO RUNTIME
// ==========================================

export interface MockUser {
  id: string;
  email: string;
  name: string;
  password?: string;
  user_metadata?: { full_name?: string };
  created_at: string;
}

export interface MockProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  level: number;
  xp: number;
  current_streak: number;
  longest_streak: number;
  last_practice_date?: string;
  total_lessons_completed: number;
  created_at: string;
  updated_at: string;
}

export interface MockLesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  type: string;
  media_url: string | null;
  xp_reward: number;
  duration_minutes: number;
  order_index: number;
  created_at: string;
}

export interface MockModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
  created_at: string;
}

export interface MockProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  accuracy_score: number;
  attempts: number;
  last_attempted: string;
  completed_at?: string;
  created_at: string;
}

// In-memory collections
const mockUsers = new Map<string, MockUser>();
const mockProfiles = new Map<string, MockProfile>();
const mockSessions = new Map<string, string>(); // token -> userId
const mockProgress = new Map<string, MockProgress>(); // `${userId}_${lessonId}` -> progress
const mockConversations = new Map<string, any[]>();
const mockMessages = new Map<string, any[]>();
const mockFriendships = new Map<string, any[]>();
const mockDailyXp = new Map<string, any[]>();
const mockUserAchievements = new Map<string, any[]>();

let activeUserId: string = '';

// Seed default demo user and profile
const seedDemoUser: MockUser = {
  id: 'usr_demo_1',
  email: 'demo@signflow.ai',
  name: 'Demo Student',
  password: 'password123',
  user_metadata: { full_name: 'Demo Student' },
  created_at: new Date().toISOString(),
};
mockUsers.set(seedDemoUser.id, seedDemoUser);

const seedDemoProfile: MockProfile = {
  id: 'prof_demo_1',
  user_id: 'usr_demo_1',
  name: 'Demo Student',
  email: 'demo@signflow.ai',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  bio: 'Learning ASL to communicate with friends and family.',
  level: 3,
  xp: 1450,
  current_streak: 5,
  longest_streak: 12,
  last_practice_date: new Date().toISOString().split('T')[0],
  total_lessons_completed: 18,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
mockProfiles.set(seedDemoUser.id, seedDemoProfile);
mockSessions.set('mock_demo_token', seedDemoUser.id);

// Pre-seeded modules
export const mockModules: MockModule[] = [
  {
    id: 'mod_1',
    title: 'Alphabets (A-Z)',
    description: 'Master all 26 letters of American Sign Language (ASL).',
    icon: '🔤',
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mod_2',
    title: 'Numbers (1-10)',
    description: 'Learn to sign numbers 1 to 10 with correct hand orientation.',
    icon: '🔢',
    order_index: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mod_3',
    title: 'Basic Words',
    description: 'Common everyday conversational signs and polite expressions.',
    icon: '💬',
    order_index: 3,
    created_at: new Date().toISOString(),
  },
];

// Pre-seeded lessons
const alphabetLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const mockLessons: MockLesson[] = [
  ...alphabetLetters.map((letter, idx) => ({
    id: `lesson_alpha_${letter.toLowerCase()}`,
    module_id: 'mod_1',
    title: letter,
    description: `Learn the ASL handshape for the letter ${letter}.`,
    type: 'alphabet',
    media_url: null,
    xp_reward: 50,
    duration_minutes: 3,
    order_index: idx + 1,
    created_at: new Date().toISOString(),
  })),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num, idx) => ({
    id: `lesson_num_${num}`,
    module_id: 'mod_2',
    title: `${num}`,
    description: `Learn how to sign number ${num} in ASL.`,
    type: 'number',
    media_url: null,
    xp_reward: 50,
    duration_minutes: 3,
    order_index: idx + 1,
    created_at: new Date().toISOString(),
  })),
  ...[
    { title: 'Hello', desc: 'Salute outward from forehead with flat hand' },
    { title: 'Thank You', desc: 'Touch fingertips to chin and move forward' },
    { title: 'Please', desc: 'Circular motion over chest with flat hand' },
    { title: 'Help', desc: 'Fist with thumb up on top of flat open palm, lifted together' },
    { title: 'Friend', desc: 'Interlocking index fingers hooked together' },
    { title: 'Family', desc: 'Two F-handshapes touching and drawing a circle together' },
    { title: 'Love', desc: 'Both arms crossed over chest hugging heart' },
    { title: 'Yes', desc: 'Fist nodding up and down like a head' },
    { title: 'No', desc: 'Index and middle fingers snapping to meet thumb' },
    { title: 'Good', desc: 'Fingers to chin, moving down into open palm' },
  ].map((item, idx) => ({
    id: `lesson_word_${item.title.toLowerCase().replace(/\s+/g, '_')}`,
    module_id: 'mod_3',
    title: item.title,
    description: item.desc,
    type: 'word',
    media_url: null,
    xp_reward: 75,
    duration_minutes: 5,
    order_index: idx + 1,
    created_at: new Date().toISOString(),
  })),
];

// Pre-seeded achievements
export const mockAchievements = [
  { id: 'ach_1', title: 'First Sign', description: 'Completed your first ASL lesson', icon: '🌟' },
  { id: 'ach_2', title: 'Streak Starter', description: 'Maintained a 3-day practice streak', icon: '🔥' },
  { id: 'ach_3', title: 'Alphabet Ace', description: 'Mastered 10 alphabet signs', icon: '🔤' },
  { id: 'ach_4', title: 'Accuracy Pro', description: 'Achieved 90%+ on any lesson test', icon: '⚡' },
  { id: 'ach_5', title: 'Sign Champion', description: 'Earned 1000 total XP', icon: '🏆' },
];

// Helper to safely read cookies across client and server
async function getCookieValue(cookieName: string): Promise<string | undefined> {
  if (typeof window !== 'undefined') {
    try {
      const match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
      if (match) return decodeURIComponent(match[2]);
      if (cookieName === 'auth_token') {
        return localStorage.getItem('auth_token') || undefined;
      }
    } catch {
      // ignore
    }
    return undefined;
  }

  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get(cookieName)?.value;
  } catch {
    return undefined;
  }
}

// ==========================================
// MOCK QUERY ENGINE
// ==========================================

function executeMockQuery(tableName: string, options: {
  selectFields?: string;
  filters: Array<{ col: string; op: string; val: any }>;
  sortCol?: string | null;
  sortAsc?: boolean;
  limitCount?: number | null;
  isSingle?: boolean;
  insertData?: any;
  updateData?: any;
  upsertData?: any;
  isDelete?: boolean;
}) {
  const { filters, sortCol, sortAsc, limitCount, isSingle, insertData, updateData, upsertData, isDelete } = options;

  let records: any[] = [];

  if (tableName === 'lessons') {
    records = [...mockLessons];
  } else if (tableName === 'modules') {
    records = mockModules.map(m => ({
      ...m,
      lessons: mockLessons.filter(l => l.module_id === m.id),
    }));
  } else if (tableName === 'users' || tableName === 'users_profile') {
    records = Array.from(mockProfiles.values());
  } else if (tableName === 'user_progress') {
    records = Array.from(mockProgress.values()).map(p => ({
      ...p,
      lessons: mockLessons.find(l => l.id === p.lesson_id) || null,
    }));
  } else if (tableName === 'achievements') {
    records = [...mockAchievements];
  } else if (tableName === 'user_achievements') {
    const all = [];
    for (const list of mockUserAchievements.values()) {
      all.push(...list);
    }
    records = all;
  } else if (tableName === 'friendships') {
    const all = [];
    for (const list of mockFriendships.values()) {
      all.push(...list);
    }
    records = all;
  } else if (tableName === 'conversations') {
    const all = [];
    for (const list of mockConversations.values()) {
      all.push(...list);
    }
    records = all;
  } else if (tableName === 'messages') {
    const all = [];
    for (const list of mockMessages.values()) {
      all.push(...list);
    }
    records = all;
  } else if (tableName === 'daily_xp_log') {
    const all = [];
    for (const list of mockDailyXp.values()) {
      all.push(...list);
    }
    records = all;
  }

  // Handle write operations
  if (insertData) {
    const items = Array.isArray(insertData) ? insertData : [insertData];
    const createdItems = items.map((item, idx) => ({
      id: item.id || `id_${Date.now()}_${idx}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...item,
    }));

    if (tableName === 'users_profile' || tableName === 'users') {
      for (const item of createdItems) {
        mockProfiles.set(item.user_id || item.id, item);
      }
    } else if (tableName === 'user_progress') {
      for (const item of createdItems) {
        mockProgress.set(`${item.user_id}_${item.lesson_id}`, item);
      }
    } else if (tableName === 'messages') {
      for (const item of createdItems) {
        const list = mockMessages.get(item.conversation_id) || [];
        list.push(item);
        mockMessages.set(item.conversation_id, list);
      }
    } else if (tableName === 'conversations') {
      for (const item of createdItems) {
        const list = mockConversations.get(item.user_id) || [];
        list.push(item);
        mockConversations.set(item.user_id, list);
      }
    }

    return { data: createdItems, error: null };
  }

  if (upsertData) {
    const item = Array.isArray(upsertData) ? upsertData[0] : upsertData;
    const finalItem = {
      id: item.id || `up_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...item,
    };
    if (tableName === 'user_progress') {
      mockProgress.set(`${item.user_id}_${item.lesson_id}`, finalItem);
    }
    return { data: [finalItem], error: null };
  }

  if (updateData) {
    let updatedItems: any[] = [];
    if (tableName === 'users_profile' || tableName === 'users') {
      const uFilter = filters.find(f => f.col === 'user_id' || f.col === 'id');
      const targetId = uFilter?.val;
      if (targetId && mockProfiles.has(targetId)) {
        const existing = mockProfiles.get(targetId)!;
        const merged = { ...existing, ...updateData, updated_at: new Date().toISOString() };
        mockProfiles.set(targetId, merged);
        updatedItems = [merged];
      }
    }
    return { data: updatedItems, error: null };
  }

  if (isDelete) {
    return { data: [], error: null };
  }

  // Apply filters
  let filtered = records.filter(row => {
    return filters.every(f => {
      if (f.op === 'eq') {
        return String(row[f.col]) === String(f.val);
      }
      return true;
    });
  });

  // Sort
  if (sortCol) {
    filtered.sort((a, b) => {
      const va = a[sortCol];
      const vb = b[sortCol];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  // Limit
  if (limitCount && limitCount > 0) {
    filtered = filtered.slice(0, limitCount);
  }

  if (isSingle) {
    return { data: filtered[0] || null, error: null };
  }

  return { data: filtered, error: null };
}

// Chainable mock query builder
function createMockQueryBuilder(tableName: string) {
  let selectFields = '*';
  const filters: Array<{ col: string; op: string; val: any }> = [];
  let sortCol: string | null = null;
  let sortAsc = true;
  let limitCount: number | null = null;
  let isSingle = false;
  let insertData: any = null;
  let updateData: any = null;
  let upsertData: any = null;
  let isDelete = false;

  const builder: any = {
    select(fields = '*') {
      selectFields = fields;
      return builder;
    },
    eq(col: string, val: any) {
      filters.push({ col, op: 'eq', val });
      return builder;
    },
    order(col: string, options?: { ascending?: boolean }) {
      sortCol = col;
      sortAsc = options?.ascending !== false;
      return builder;
    },
    limit(count: number) {
      limitCount = count;
      return builder;
    },
    single() {
      isSingle = true;
      return builder;
    },
    insert(data: any) {
      insertData = data;
      return builder;
    },
    update(data: any) {
      updateData = data;
      return builder;
    },
    upsert(data: any) {
      upsertData = data;
      return builder;
    },
    delete() {
      isDelete = true;
      return builder;
    },
    then(onfulfilled: any, onrejected?: any) {
      const result = executeMockQuery(tableName, {
        selectFields,
        filters,
        sortCol,
        sortAsc,
        limitCount,
        isSingle,
        insertData,
        updateData,
        upsertData,
        isDelete,
      });
      return Promise.resolve(result).then(onfulfilled, onrejected);
    },
  };

  return builder;
}

// ==========================================
// EXPORTED SUPABASE CLIENT PROXY
// ==========================================

export const supabase: any = isRealSupabase && realClient
  ? realClient
  : {
      from(tableName: string) {
        return createMockQueryBuilder(tableName);
      },
      auth: {
        async signUp(options: any) {
          const email = options?.email || '';
          const name = options?.options?.data?.full_name || email.split('@')[0];
          const password = options?.password || '';
          const result = await signUp(email, password, name);
          return { data: result, error: null };
        },
        async signInWithPassword(options: any) {
          try {
            const result = await signIn(options?.email || '', options?.password || '');
            return { data: result, error: null };
          } catch (err: any) {
            return { data: { user: null, session: null }, error: err };
          }
        },
        async signInWithOAuth(_options: any) {
          return { data: { provider: 'google', url: '/' }, error: null };
        },
        async signOut() {
          await signOut();
          return { error: null };
        },
        async getUser() {
          const user = await getCurrentUser();
          return { data: { user }, error: null };
        },
        async getSession() {
          const session = await getCurrentSession();
          return { data: { session }, error: null };
        },
        onAuthStateChange(_callback: any) {
          return { data: { subscription: { unsubscribe: () => {} } } };
        },
        async resetPasswordForEmail(_email: string) {
          return { data: {}, error: null };
        },
        async updateUser(updates: any) {
          const user = await getCurrentUser();
          if (user) {
            user.user_metadata = { ...user.user_metadata, ...updates?.data };
          }
          return { data: { user }, error: null };
        },
      },
    };

// ==========================================
// CORE AUTH & DATABASE HELPER FUNCTIONS
// ==========================================

export const signUp = async (email: string, password: string, name: string) => {
  try {
    if (isRealSupabase && realClient) {
      try {
        const { data: existingUser } = await realClient
          .from('users_profile')
          .select('id')
          .eq('email', email)
          .single();

        if (existingUser) {
          throw new Error('User with this email already exists');
        }

        const { data, error } = await realClient.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });

        if (error) throw error;
        if (data.user) {
          await createUserProfile(data.user.id, name, email);
        }
        return data;
      } catch (realErr: any) {
        if (!realErr?.message?.includes('fetch failed')) {
          throw realErr;
        }
        console.warn('Real Supabase unavailable, falling back to mock authentication.');
      }
    }

    // In-memory mock registration
    for (const u of mockUsers.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        throw new Error('User with this email already exists');
      }
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newUser: MockUser = {
      id: userId,
      email: email.toLowerCase(),
      name,
      password,
      user_metadata: { full_name: name },
      created_at: new Date().toISOString(),
    };
    mockUsers.set(userId, newUser);

    const accessToken = `jwt_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    mockSessions.set(accessToken, userId);
    activeUserId = userId;

    await createUserProfile(userId, name, email);

    return {
      user: {
        id: userId,
        email: newUser.email,
        user_metadata: { full_name: name },
      },
      session: {
        access_token: accessToken,
        token_type: 'bearer',
        user: { id: userId, email: newUser.email },
      },
    };
  } catch (error: any) {
    throw new Error(error.message || 'Signup failed');
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    if (isRealSupabase && realClient) {
      try {
        const { data, error } = await realClient.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.status === 400) {
            throw new Error('Invalid email or password');
          }
          throw error;
        }

        if (data.user) {
          const profile = await getUserProfile(data.user.id);
          return { user: data.user, session: data.session, profile };
        }
        return data;
      } catch (realErr: any) {
        if (!realErr?.message?.includes('fetch failed')) {
          throw realErr;
        }
        console.warn('Real Supabase unavailable, falling back to mock authentication.');
      }
    }

    // In-memory mock login
    let user = Array.from(mockUsers.values()).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      // Auto-provision user for seamless testing
      const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const fallbackName = email.split('@')[0];
      const displayName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
      user = {
        id: userId,
        email: email.toLowerCase(),
        name: displayName,
        password,
        user_metadata: { full_name: displayName },
        created_at: new Date().toISOString(),
      };
      mockUsers.set(userId, user);
      await createUserProfile(userId, displayName, email);
    } else if (user.password && user.password !== password) {
      throw new Error('Invalid email or password');
    }

    const accessToken = `jwt_mock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    mockSessions.set(accessToken, user.id);
    activeUserId = user.id;

    const profile = await getUserProfile(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata || { full_name: user.name },
      },
      session: {
        access_token: accessToken,
        token_type: 'bearer',
        user: { id: user.id, email: user.email },
      },
      profile,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Login failed');
  }
};

export const signInWithGoogle = async () => {
  return { provider: 'google', url: '/dashboard' };
};

export const signInWithGitHub = async () => {
  return { provider: 'github', url: '/dashboard' };
};

export const signOut = async () => {
  activeUserId = '';
  return;
};

export const getCurrentUser = async (explicitToken?: string, explicitUserId?: string) => {
  try {
    if (isRealSupabase && realClient) {
      try {
        const { data, error } = await realClient.auth.getUser(explicitToken);
        if (!error && data?.user) return data.user;
      } catch (err: any) {
        if (!err?.message?.includes('fetch failed')) return null;
      }
    }

    let token = explicitToken;
    let userId = explicitUserId;

    if (!token && !userId) {
      token = await getCookieValue('auth_token');
      userId = await getCookieValue('user_id');
    }

    if (userId && mockUsers.has(userId)) {
      const u = mockUsers.get(userId)!;
      return { id: u.id, email: u.email, user_metadata: u.user_metadata || { full_name: u.name } };
    }

    if (token && mockSessions.has(token)) {
      const uId = mockSessions.get(token)!;
      if (mockUsers.has(uId)) {
        const u = mockUsers.get(uId)!;
        return { id: u.id, email: u.email, user_metadata: u.user_metadata || { full_name: u.name } };
      }
    }

    if (activeUserId && mockUsers.has(activeUserId)) {
      const u = mockUsers.get(activeUserId)!;
      return { id: u.id, email: u.email, user_metadata: u.user_metadata || { full_name: u.name } };
    }

    return null;
  } catch {
    return null;
  }
};

export const getCurrentSession = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return {
    access_token: 'mock_session_token',
    user,
  };
};

export const createUserProfile = async (userId: string, name: string, email: string) => {
  const profile: MockProfile = {
    id: `prof_${Date.now()}`,
    user_id: userId,
    name,
    email,
    level: 1,
    xp: 0,
    current_streak: 1,
    longest_streak: 1,
    total_lessons_completed: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockProfiles.set(userId, profile);
  return profile;
};

export const getUserProfile = async (userId: string) => {
  if (isRealSupabase && realClient) {
    try {
      const { data, error } = await realClient
        .from('users_profile')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (!error && data) return data;
    } catch {
      // Fallback
    }
  }

  if (mockProfiles.has(userId)) {
    return mockProfiles.get(userId);
  }

  // Create default profile if user exists
  const u = mockUsers.get(userId);
  if (u) {
    return createUserProfile(userId, u.name, u.email);
  }

  return seedDemoProfile;
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const profile = (await getUserProfile(userId)) || { ...seedDemoProfile, user_id: userId };
  const updated = {
    ...profile,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  mockProfiles.set(userId, updated);
  return updated;
};

export const getUserProgress = async (userId: string): Promise<any> => {
  const profile = (await getUserProfile(userId)) || seedDemoProfile;
  const userItems = Array.from(mockProgress.values()).filter(p => p.user_id === userId);
  if (userItems.length === 0) {
    return [
      {
        id: `prog_init_${userId}`,
        user_id: userId,
        lesson_id: 'lesson_alpha_a',
        completed: false,
        accuracy_score: 0,
        attempts: 0,
        total_xp: profile.xp || 0,
        current_streak: profile.current_streak || 0,
        level: profile.level || 1,
        average_accuracy: 90,
        lessons_completed: profile.total_lessons_completed || 0,
        lessons_today: 1,
        user_name: profile.name,
        user_email: profile.email,
        created_at: new Date().toISOString(),
        lessons: mockLessons[0] || null,
      },
    ];
  }
  return userItems.map(p => ({
    ...p,
    total_xp: profile.xp || 0,
    current_streak: profile.current_streak || 0,
    level: profile.level || 1,
    average_accuracy: p.accuracy_score || 90,
    lessons_completed: profile.total_lessons_completed || 0,
    lessons_today: 2,
    user_name: profile.name,
    user_email: profile.email,
    lessons: mockLessons.find(l => l.id === p.lesson_id) || null,
  }));
};

export const updateUserProgress = async (
  userId: string,
  lessonId: string,
  completed: boolean,
  accuracyScore: number
) => {
  const key = `${userId}_${lessonId}`;
  const existing = mockProgress.get(key);
  const updated: MockProgress = {
    id: existing?.id || `prog_${Date.now()}`,
    user_id: userId,
    lesson_id: lessonId,
    completed,
    accuracy_score: accuracyScore,
    attempts: (existing?.attempts || 0) + 1,
    last_attempted: new Date().toISOString(),
    completed_at: completed ? new Date().toISOString() : existing?.completed_at,
    created_at: existing?.created_at || new Date().toISOString(),
  };
  mockProgress.set(key, updated);

  // Update profile counters
  const profile = await getUserProfile(userId);
  if (profile && completed && !existing?.completed) {
    profile.total_lessons_completed += 1;
    mockProfiles.set(userId, profile);
  }

  return updated;
};

export const getModules = async () => {
  return mockModules.map(m => ({
    ...m,
    lessons: mockLessons.filter(l => l.module_id === m.id),
  }));
};

export const getModule = async (moduleId: string) => {
  const mod = mockModules.find(m => m.id === moduleId);
  if (!mod) return null;
  return {
    ...mod,
    lessons: mockLessons.filter(l => l.module_id === mod.id),
  };
};

export const getLesson = async (lessonId: string) => {
  return mockLessons.find(l => l.id === lessonId) || null;
};

export const addXP = async (userId: string, xpAmount: number, lessonId?: string) => {
  const profile = (await getUserProfile(userId)) || seedDemoProfile;
  const newXP = (profile.xp || 0) + xpAmount;
  const newLevel = Math.floor(newXP / 1000) + 1;

  profile.xp = newXP;
  profile.level = newLevel;
  mockProfiles.set(userId, profile);

  // Log in daily_xp
  const log = mockDailyXp.get(userId) || [];
  log.push({
    user_id: userId,
    lesson_id: lessonId,
    xp_earned: xpAmount,
    date: new Date().toISOString().split('T')[0],
  });
  mockDailyXp.set(userId, log);

  return { xp: newXP, level: newLevel };
};

export const updateStreak = async (userId: string) => {
  const profile = (await getUserProfile(userId)) || seedDemoProfile;
  const today = new Date().toISOString().split('T')[0];

  if (profile.last_practice_date !== today) {
    profile.current_streak = (profile.current_streak || 0) + 1;
    if (profile.current_streak > (profile.longest_streak || 0)) {
      profile.longest_streak = profile.current_streak;
    }
    profile.last_practice_date = today;
    mockProfiles.set(userId, profile);
  }

  return {
    current_streak: profile.current_streak,
    longest_streak: profile.longest_streak,
  };
};

export const getFriends = async (userId: string) => {
  const list = mockFriendships.get(userId) || [
    {
      id: 'fr_1',
      user_id: userId,
      friend_id: 'usr_f1',
      status: 'accepted',
      friend: {
        id: 'usr_f1',
        name: 'Maya Chen',
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
        level: 4,
        xp: 2150,
      },
    },
    {
      id: 'fr_2',
      user_id: userId,
      friend_id: 'usr_f2',
      status: 'accepted',
      friend: {
        id: 'usr_f2',
        name: 'Alex Rivera',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        level: 3,
        xp: 1650,
      },
    },
  ];
  return list;
};

export const addFriend = async (userId: string, friendId: string) => {
  const list = mockFriendships.get(userId) || [];
  const newFriendship = {
    id: `fr_${Date.now()}`,
    user_id: userId,
    friend_id: friendId,
    status: 'accepted',
    friend: {
      id: friendId,
      name: 'ASL Peer',
      avatar_url: '',
      level: 1,
      xp: 100,
    },
  };
  list.push(newFriendship);
  mockFriendships.set(userId, list);
  return newFriendship;
};

export const removeFriend = async (userId: string, friendId: string) => {
  const list = mockFriendships.get(userId) || [];
  mockFriendships.set(
    userId,
    list.filter(f => f.friend_id !== friendId)
  );
};

export const getLeaderboard = async (limit = 10) => {
  const list = [
    { id: 'usr_1', name: 'Sophia Lin', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', level: 6, xp: 4200, current_streak: 15 },
    { id: 'usr_2', name: 'David Kim', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', level: 5, xp: 3450, current_streak: 11 },
    { id: 'usr_demo_1', name: 'Demo Student (You)', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', level: 3, xp: 1450, current_streak: 5 },
    { id: 'usr_3', name: 'Maya Chen', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', level: 4, xp: 2150, current_streak: 7 },
    { id: 'usr_4', name: 'Alex Rivera', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', level: 3, xp: 1650, current_streak: 4 },
  ];
  return list.slice(0, limit);
};

export const getAchievements = async (userId: string) => {
  const earned = mockUserAchievements.get(userId) || [
    { id: 'ua_1', user_id: userId, achievement_id: 'ach_1', earned_at: new Date().toISOString(), achievement: mockAchievements[0] },
    { id: 'ua_2', user_id: userId, achievement_id: 'ach_2', earned_at: new Date().toISOString(), achievement: mockAchievements[1] },
  ];
  return earned;
};

export const awardAchievement = async (userId: string, achievementId: string) => {
  const list = mockUserAchievements.get(userId) || [];
  const ach = mockAchievements.find(a => a.id === achievementId);
  const newAward = {
    id: `ua_${Date.now()}`,
    user_id: userId,
    achievement_id: achievementId,
    earned_at: new Date().toISOString(),
    achievement: ach,
  };
  list.push(newAward);
  mockUserAchievements.set(userId, list);
  return newAward;
};

export const createConversation = async (userId: string, title: string) => {
  const conv = {
    id: `conv_${Date.now()}`,
    user_id: userId,
    title,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const list = mockConversations.get(userId) || [];
  list.unshift(conv);
  mockConversations.set(userId, list);
  return conv;
};

export const getConversations = async (userId: string) => {
  return mockConversations.get(userId) || [];
};

export const addMessage = async (
  conversationId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string,
  hasAudio = false,
  hasSignAnimation = false
) => {
  const msg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    conversation_id: conversationId,
    user_id: userId,
    role,
    content,
    has_audio: hasAudio,
    has_sign_animation: hasSignAnimation,
    created_at: new Date().toISOString(),
  };
  const list = mockMessages.get(conversationId) || [];
  list.push(msg);
  mockMessages.set(conversationId, list);
  return msg;
};

export const getMessages = async (conversationId: string) => {
  return mockMessages.get(conversationId) || [];
};
