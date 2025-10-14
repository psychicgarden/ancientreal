# 🚀 **CURSOR LOCAL DEVELOPMENT SETUP**

## **Issue Identified**
Your live Lovable dashboard shows `PropertyInvestmentInterface` correctly, but your local GitHub clone shows deployment tools instead. Here's the exact fix:

## **Step 1: Repository Setup**
```bash
# Clone the repository
git clone https://github.com/psychicgarden/ancientreal.git
cd ancientreal

# Ensure you're on main branch
git checkout main
git pull origin main
```

## **Step 2: Environment Variables Setup**
Create `.env.local` file in the project root:
```bash
# Copy these EXACT values from your live Lovable environment
VITE_SUPABASE_URL=https://moxpmnooovdcffvztbbc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veHBtbm9vb3ZkY2Zmdnp0YmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjkwOTgsImV4cCI6MjA2OTU0NTA5OH0.pYPwRwRgp5rREqnJND_8hxcunDgUOestKOYl9VI9aVs
```

## **Step 3: Database Verification**
Your database already has these contracts deployed:
- ✅ SimpleAvaxMortgage: `0x47391d3e495c295d2b0761930cfa556bad965aed`
- ✅ SIMPLE_MORTGAGE: `0x8A791620dd6260079BF849Dc5567aDC3F2FdC318`
- ✅ All other required contracts

## **Step 4: Navigation Fix**
The `PropertyInvestmentInterface` is in a **nested tab structure**:

1. Go to `/admin/projects`
2. Click **"Smart Contracts"** tab 
3. **IMPORTANT**: Click **"Investment Platform"** sub-tab (NOT "Mortgage Dashboard")

This is where your property cards with "Art Deco Loft" will appear!

## **Step 5: Install & Run**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:5173/admin/projects
```

## **Step 6: Open in Cursor**
```bash
# Open the project in Cursor
cursor .
```

## **Verification Checklist**
- [ ] Environment variables point to live Supabase
- [ ] Navigate to Smart Contracts → Investment Platform sub-tab
- [ ] See property cards instead of deployment tools
- [ ] Contract addresses load correctly
- [ ] Can make changes in Cursor and sync to GitHub

## **Expected Result**
Your local environment will show the EXACT same PropertyInvestmentInterface as your live dashboard, with property cards for "Art Deco Loft", "Bahia Ocean Villa", etc.

## **Troubleshooting**
If you still see deployment tools:
1. Hard refresh browser (Cmd+Shift+R)
2. Clear browser cache
3. Check browser console for errors
4. Verify you're on the "Investment Platform" sub-tab, not "Mortgage Dashboard"