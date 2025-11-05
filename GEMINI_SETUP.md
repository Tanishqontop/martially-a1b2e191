# Gemini API Setup for Recommendations

The Martial Arts Recommendations feature uses Google's Gemini API to provide AI-powered course and class recommendations.

## Setup Instructions

1. **Get a Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key

2. **Configure Environment Variable**
   - Create a `.env` file in the root directory of your project
   - Add the following line:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```
   - Replace `your_api_key_here` with your actual API key

3. **Restart Development Server**
   - Stop your current dev server (Ctrl+C)
   - Run `npm run dev` again to load the new environment variable

## Usage

1. Navigate to `/recommendations` in the application
2. Fill out the recommendation form with your preferences:
   - Experience level
   - Preferred martial arts styles
   - Goals
   - Time commitment
   - Budget
   - Learning format (online/in-person/both)
   - Location (optional)
   - Additional notes (optional)
3. Click "Get AI Recommendations"
4. View personalized recommendations with match scores and reasoning

## Notes

- The API key is used client-side but is prefixed with `VITE_` so it's only exposed to the frontend
- Make sure to never commit your `.env` file to version control
- The `.env` file is already in `.gitignore` by default

