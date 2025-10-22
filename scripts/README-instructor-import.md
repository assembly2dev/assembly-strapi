# Instructor Dummy Data Import

This directory contains scripts to import dummy instructor data into your Strapi instance.

## Available Scripts

### 1. `import-instructors-standalone.js`
A standalone JavaScript script that prepares instructor data without requiring Strapi to be running.

**Usage:**
```bash
node scripts/import-instructors-standalone.js
```

**What it does:**
- Displays 10 diverse instructor profiles
- Shows the data structure
- Provides instructions for manual import

### 2. `import-instructor-dummy-data.ts`
A TypeScript script that can be used with a running Strapi instance to automatically create instructors.

**Usage:**
```bash
# With Strapi running
npx ts-node scripts/import-instructor-dummy-data.ts
```

**What it does:**
- Creates 10 diverse instructor profiles in the database
- Handles errors gracefully
- Provides detailed logging

### 3. `run-instructor-import.js`
A wrapper script to run the TypeScript import script.

**Usage:**
```bash
node scripts/run-instructor-import.js
```

## Instructor Profiles Included

The scripts create 10 diverse instructor profiles with the following specialties:

1. **Dr. Michael Chen** - Real Estate Economics (20+ years)
2. **Jennifer Wong** - HDB & Private Property (10+ years)
3. **Robert Tan** - Portfolio Management (15+ years)
4. **Lisa Ng** - Market Analysis (8+ years)
5. **David Lim** - Commercial Property (18+ years)
6. **Amanda Teo** - Investment Coaching (12+ years)
7. **James Koh** - Investment Strategy (14+ years)
8. **Rachel Lee** - First-time Investors (9+ years)
9. **Kevin Ong** - Rental Property Investment (11+ years)
10. **Michelle Chua** - Luxury Property Investment (13+ years)

## Data Structure

Each instructor includes:
- **Basic Info**: name, slug, role, bio, longBio
- **Specialization**: specialty, experience
- **Social Links**: LinkedIn, Twitter, Instagram, WhatsApp, Email
- **Stats**: coursesCreated (initially 0)
- **Settings**: showOnFacilitatorsPage

## Manual Import via Strapi Admin

If you prefer to import manually:

1. Start your Strapi server
2. Go to the admin panel
3. Navigate to Content Manager > Instructors
4. Create new entries using the data from `import-instructors-standalone.js`

## API Import

You can also use the Strapi API to create instructors:

```bash
curl -X POST http://localhost:1337/api/instructors \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Dr. Michael Chen",
      "slug": "dr-michael-chen",
      "role": "Senior Property Investment Advisor",
      "bio": "Dr. Michael Chen is a senior property investment advisor...",
      "specialty": "Real Estate Economics",
      "experience": "20+ years",
      "socialLinks": {
        "linkedin": "https://linkedin.com/in/drmichaelchen",
        "email": "michael.chen@plbassembly.com"
      },
      "stats": {
        "coursesCreated": 0
      },
      "showOnFacilitatorsPage": true
    }
  }'
```

## Notes

- All instructors are set to `showOnFacilitatorsPage: true`
- Social links are optional and can be customized
- The `coursesCreated` stat starts at 0 and can be updated when courses are assigned
- Image fields are not included in the dummy data (you'll need to add profile images manually)

## Troubleshooting

If you encounter issues:

1. **TypeScript errors**: Make sure you have `ts-node` installed (`npm install -g ts-node`)
2. **Strapi connection errors**: Ensure your Strapi server is running
3. **Permission errors**: Check that your Strapi instance has the necessary permissions
4. **Duplicate entries**: The scripts don't check for existing instructors, so you may need to clear existing data first
