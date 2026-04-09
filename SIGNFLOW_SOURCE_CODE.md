# SignFlow - Complete Source Code Package

**AI-powered Sign Language Learning Platform**

All essential source code files for the SignFlow project. Copy and use these files in your Next.js project.

---

## 📁 FILE STRUCTURE

```
signflow/
├── src/
│   ├── app/
│   │   ├── page.tsx                    (Home page)
│   │   ├── login/page.tsx              (Login page)
│   │   ├── signup/page.tsx             (Signup page)
│   │   ├── dashboard/page.tsx          (Dashboard)
│   │   ├── practice/page.tsx           (Lessons)
│   │   ├── profile/page.tsx            (Profile)
│   │   ├── layout.tsx                  (Root layout)
│   │   ├── theme.css                   (Theme)
│   │   ├── globals.css                 (Global styles)
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── signup/route.ts
│   │       │   ├── login/route.ts
│   │       │   ├── logout/route.ts
│   │       │   └── me/route.ts
│   │       └── progress/
│   │           └── fetch/route.ts
│   ├── components/
│   │   ├── protected-layout.tsx
│   │   ├── lesson-media-display.tsx
│   │   ├── theme-switcher.tsx
│   │   └── ui/
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-lessons.ts
│   │   ├── use-local-storage.ts
│   │   ├── use-theme.ts
│   │   └── ...
│   └── lib/
│       ├── supabase.ts
│       ├── auth-errors.ts
│       └── utils.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── .env.example
└── .gitignore
```

---

## 🔑 KEY FILES

