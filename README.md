# Adaptive Server/Client Rendering Component

A Next.js example demonstrating proper server-side rendering (SSR) and client-side hydration patterns using React Suspense.

## 🌟 Features

- Server-side rendering with proper hydration
- Client-side dynamic updates
- React Suspense integration
- Type-safe implementation
- Visual render mode indicators
- Seamless mode switching

## 📋 Prerequisites

- Node.js 18+
- Next.js 14+
- TypeScript
- Tailwind CSS
- shadcn/ui components

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Install required shadcn/ui components:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add card
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## 🏗️ Component Structure

```
components/          # TypeScript definitions
├── ui/                    # shadcn components
└── Preview.tsx            # Preview implementation
```

## 💡 Understanding Server vs Client Rendering

### Server-Side Rendering (SSR)

Server components render content on the server and send complete HTML to the client. This provides:
- Faster initial page load
- Better SEO
- Reduced client-side JavaScript
- Works without JavaScript

Example of server-side rendering:
```typescript
// Server Component
async function ServerComponent() {
  const data = await fetchData(); // Runs on server
  
  return (
    <div>
      {/* Content is rendered on server */}
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Client-Side Rendering

Client components become interactive after hydration and can update dynamically:
- Real-time updates
- Interactive features
- Dynamic content
- Browser APIs

Example of client-side rendering:
```typescript
'use client';

function ClientComponent() {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    // Only runs in browser after hydration
    setTime(new Date().toISOString());
  }, []);

  return <div>{time}</div>;
}
```

## 🔄 Hydration Process

Hydration is the process where React "brings to life" server-rendered HTML in the browser:

1. **Server Phase**
   - Generates static HTML
   - Includes initial state
   - No JavaScript functionality

2. **Client Phase**
   - React loads in browser
   - Attaches event listeners
   - Sets up state management
   - Makes content interactive

### Handling Hydration Correctly

To prevent hydration mismatches:
```typescript
function SafeComponent() {
  // Start with empty state
  const [data, setData] = useState('');
  
  // Update after hydration
  useEffect(() => {
    setData(new Date().toISOString());
  }, []);

  // Show loading until hydrated
  if (!data) return <div>Loading...</div>;
  
  return <div>{data}</div>;
}
```

## 🎯 Best Practices

1. **Server Components**
   - Use for static content
   - Keep data fetching on server
   - Minimize client-side JavaScript

2. **Client Components**
   - Use for interactive features
   - Handle hydration properly
   - Clean up side effects

3. **Data Handling**
   - Fetch on server when possible
   - Hydrate data carefully
   - Handle loading states

4. **Performance**
   - Minimize client-side code
   - Use proper loading states
   - Implement proper cleanup

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE.md for details

## 🙏 Acknowledgments

- Next.js team for SSR capabilities
- shadcn/ui for components
- React team for Suspense