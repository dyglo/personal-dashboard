# Tafa Dashboard Setup Guide

## 🔑 Gemini AI API Configuration

To enable AI-powered insights, weekly reports, and natural language queries in your Tafa dashboard, you need to configure the Google Gemini API key.

### Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Add Environment Variable

#### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `GOOGLE_GENERATIVE_AI_API_KEY`
   - **Value**: Your copied API key
   - **Environment**: Production, Preview, Development (select all)
4. Click "Save"
5. Redeploy your application

#### For Local Development:
1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add the following line:
   \`\`\`
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   \`\`\`
3. Replace `your_api_key_here` with your actual API key
4. Restart your development server

### Step 3: Verify Integration

After adding the API key:

1. Navigate to the **AI Insights** tab in your dashboard
2. Click "Generate Insights" button
3. If configured correctly, you should see personalized insights based on your habits and goals data
4. Try the "Weekly Report" and "Ask AI" features to confirm full functionality

### 🚨 Important Security Notes

- **Never commit your API key to version control**
- Keep your `.env.local` file in your `.gitignore`
- The API key should only be used server-side (in API routes)
- Monitor your API usage in Google AI Studio to avoid unexpected charges

### 📊 Features Enabled by Gemini AI

Once configured, these features will be fully functional:

- **Personalized Insights**: AI analyzes your habit patterns and goal progress
- **Weekly Reports**: Comprehensive AI-generated progress summaries
- **Natural Language Queries**: Ask questions about your data in plain English
- **Smart Recommendations**: AI suggests optimizations based on your behavior patterns

### 🔧 Troubleshooting

**"No insights yet" message?**
- Check that `GOOGLE_GENERATIVE_AI_API_KEY` is correctly set
- Verify the API key is valid in Google AI Studio
- Check browser console for any error messages
- Ensure you have some habits or goals data to analyze

**API errors in console?**
- Confirm the environment variable name is exactly `GOOGLE_GENERATIVE_AI_API_KEY`
- Check your API key hasn't expired or been revoked
- Verify you have sufficient API quota remaining

### 💡 Optional: Puppeteer for PDF Generation

The PDF report generation currently uses jsPDF for client-side generation. If you want to use Puppeteer for server-side PDF generation with better formatting:

1. Install Puppeteer: `npm install puppeteer`
2. The system will automatically detect and use Puppeteer if available
3. This enables higher-quality PDF reports with better chart rendering

---

**Need help?** Check the console logs for detailed error messages or refer to the [Google AI SDK documentation](https://ai.google.dev/docs).
