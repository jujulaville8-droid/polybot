# How to Build an Automated Twitter Posting System for EdgeBot

This guide will walk you through building a system that automatically creates and posts tweets about your Polymarket trading bot. You'll be using Claude Code (an AI assistant that runs in your terminal) to do most of the heavy lifting.

---

## What You're Building

A system that:
1. Reads your bot's daily trading results
2. Uses AI to write tweets about those results
3. Posts them to Twitter/X automatically
4. Runs every day without you doing anything

---

## What You Need Before Starting

- A computer (Mac, Windows, or Linux)
- Claude Code installed (instructions below)
- A Twitter/X account
- Your Polymarket bot running and saving trade logs somewhere (a file, a database, etc.)

---

## Part 1: Install Claude Code

### Step 1: Open your terminal
- **Mac**: Press `Cmd + Space`, type "Terminal", press Enter
- **Windows**: Press `Win + R`, type "cmd", press Enter

### Step 2: Install Claude Code
Type this and press Enter:
```
npm install -g @anthropic-ai/claude-code
```

If you get an error about "npm not found", you need Node.js first. Go to https://nodejs.org, download the big green button version, install it, then try the command above again.

### Step 3: Start Claude Code
Type this and press Enter:
```
claude
```

You'll see a chat interface. This is Claude Code. You type what you want, and it helps you build things. Think of it like texting a really smart programmer.

---

## Part 2: Get a Twitter/X API Key

You need this so your code can post tweets on your behalf.

### Step 1: Go to the Twitter Developer Portal
Open your browser and go to: https://developer.x.com

### Step 2: Sign up for a developer account
- Click "Sign Up"
- Use your Twitter/X login
- Choose the "Free" tier (it lets you post up to 1,500 tweets per month — more than enough)
- Fill out the form explaining what you're building. Say something like: "I'm building an automated system to post trading performance updates from my algorithmic trading bot."

### Step 3: Create a project and app
- Once approved, click "Create Project"
- Name it something like "EdgeBot Twitter"
- Click "Create App" inside the project
- Name it "EdgeBot Auto Poster"

### Step 4: Get your keys
- Go to your app's "Keys and Tokens" page
- You'll see:
  - **API Key** (also called Consumer Key)
  - **API Secret** (also called Consumer Secret)
- Click "Generate" under "Access Token and Secret"
  - You'll get an **Access Token** and **Access Token Secret**
- **IMPORTANT**: Copy all 4 of these somewhere safe (a note on your computer, NOT a public place). You'll need them later.

### Step 5: Set permissions
- Go to your app settings
- Under "User authentication settings", click "Set up"
- Set App permissions to **"Read and Write"** (so it can post tweets)
- Save

---

## Part 3: Get an AI API Key (for writing tweets)

You need an AI to turn your bot's trade data into well-written tweets.

### Option A: xAI (Grok) — best for real-time Twitter context
1. Go to https://console.x.ai
2. Sign up and get an API key
3. Save the key somewhere safe

### Option B: Anthropic (Claude) — best for high-quality analysis threads
1. Go to https://console.anthropic.com
2. Sign up and add billing (it costs about $0.01-0.05 per tweet generated — very cheap)
3. Go to "API Keys" and create one
4. Save the key somewhere safe

Pick one. Either works. If you're unsure, go with xAI since you're already on the X platform.

---

## Part 4: Build the Automation

This is where Claude Code does the work for you. You just need to tell it what to build.

### Step 1: Create a project folder
In your terminal (not inside Claude Code), type:
```
mkdir twitter-bot
cd twitter-bot
```

### Step 2: Start Claude Code in that folder
```
claude
```

### Step 3: Tell Claude Code what to build
Copy and paste this entire message into Claude Code:

```
Build me a Twitter auto-posting system in Python. Here's what I need:

1. A script called "generate_and_post.py" that does this:
   - Reads my bot's trade log from a JSON file called "daily_trades.json"
   - Sends the trade data to the xAI API (or Claude API) with a prompt
     that asks it to write an engaging tweet about today's trading performance
   - Posts the tweet to Twitter/X using the Twitter API v2
   - Logs what it posted to a file called "post_history.json"

2. The tweet style should be:
   - Data-driven, not hype-y
   - Include specific numbers (win rate, P&L, number of trades)
   - End with something that makes people curious
   - Never say "guaranteed returns" or "passive income"
   - Max 280 characters
   - Example: "EdgeBot executed 23 trades overnight. 17 winners.
     +$847 P&L. The Fed rate market moved 6% while most traders slept."

3. A sample "daily_trades.json" file so I can see the format

4. Use environment variables for all API keys (never hardcode them)

5. Create a .env.example file showing what keys I need to fill in

6. Add a cron job or scheduled task that runs this every day at 9am ET

7. Include error handling so if something fails, it doesn't crash —
   it just skips that day and tries again tomorrow

Use the tweepy library for Twitter and httpx for API calls.
```

### Step 4: Let Claude Code work
Claude Code will:
- Create all the files
- Install the libraries you need
- Set up the scheduling
- Test that everything works

It will ask you questions along the way. Just answer them honestly. If you don't understand a question, say "I don't understand, can you explain simpler?"

### Step 5: Add your API keys
Claude Code will create a `.env.example` file. Make a copy of it:
```
cp .env.example .env
```

Open the `.env` file and paste in your keys from Parts 2 and 3:
```
TWITTER_API_KEY=paste_your_api_key_here
TWITTER_API_SECRET=paste_your_api_secret_here
TWITTER_ACCESS_TOKEN=paste_your_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=paste_your_access_token_secret_here
XAI_API_KEY=paste_your_xai_key_here
```

### Step 6: Test it
Tell Claude Code:
```
Run the script once with the sample data so I can see if it works.
```

If it works, you'll see a tweet posted to your account. If it doesn't work, tell Claude Code what error you see and it will fix it.

---

## Part 5: Add More Content Types

Once the basic daily performance tweet is working, you can add more. Go back into Claude Code and ask for these one at a time:

### Market scanner tweets
```
Add a second script called "market_scanner.py" that:
1. Connects to the Polymarket API
2. Finds markets where the price moved more than 5% in the last 24 hours
3. Writes a tweet about the most interesting market move
4. Posts it at 12pm ET daily
```

### Weekly thread
```
Add a script called "weekly_thread.py" that:
1. Reads the last 7 days of trade data from post_history.json
2. Generates a Twitter thread (5-8 tweets) summarizing the week
3. Includes total P&L, best trade, worst trade, win rate
4. Posts the thread every Sunday at 10am ET
```

### News reaction tweets
```
Add a script called "news_reactor.py" that:
1. Checks Google News and Twitter for Polymarket-related news every 30 minutes
2. When it finds something, generates a hot take tweet connecting
   the news to a relevant Polymarket market
3. Posts it within 5 minutes of finding the news
4. Only posts max 3 news reactions per day so it doesn't look spammy
```

---

## Part 6: Things to Do Manually (Don't Automate These)

Some things work much better when a real human does them:

1. **Reply to people** — When someone comments on your tweet, reply yourself. Be helpful. Answer questions. This is how you build real relationships.

2. **Reply to big accounts** — Find accounts that tweet about Polymarket (10K+ followers). Reply to their tweets with genuine insight. Don't say "check out my bot." Just be smart and helpful. People will check your profile naturally.

3. **DMs** — When someone DMs you asking about the bot, respond personally. These are your warmest leads.

4. **Personal stories** — Tweet about your own experience. Why you built the bot. What you learned. Mistakes you made. These can't be automated because they need to feel real.

---

## Part 7: Track What's Working

### Step 1: Ask Claude Code to build a tracker
```
Build a script called "analytics.py" that:
1. Uses the Twitter API to check how each of my tweets performed
   (likes, retweets, replies, impressions)
2. Saves the data to a file called "tweet_analytics.json"
3. Tells me which types of tweets get the most engagement
4. Runs once per day at 11pm ET
```

### Step 2: Check your analytics weekly
Every Sunday, look at which tweets performed best. You'll notice patterns:
- Performance posts with specific numbers usually do well
- Market analysis threads usually get the most followers
- News reaction tweets usually get the most reach

Double down on what works. Stop doing what doesn't.

---

## Troubleshooting

### "I got an error and I don't understand it"
Copy the entire error message and paste it into Claude Code. Say:
```
I got this error. Can you fix it and explain what went wrong in simple terms?
```

### "My tweets aren't posting"
Tell Claude Code:
```
My tweets aren't posting. Can you check if my Twitter API keys are
working and if the script has any issues?
```

### "The AI is writing bad tweets"
Tell Claude Code:
```
The tweets don't sound good. Here are 3 examples of tweets I like
from other accounts: [paste examples]. Can you update the prompt
so the AI writes more like these?
```

### "I want to change when tweets post"
Tell Claude Code:
```
Change the posting schedule to [your preferred times].
```

### "I want to stop the automation temporarily"
Tell Claude Code:
```
How do I pause the automated posting without deleting anything?
```

---

## Quick Reference: Claude Code Tips

- **To start Claude Code**: Open terminal, type `claude`
- **To ask for help**: Just type your question in plain English
- **To fix a bug**: Paste the error message and ask Claude Code to fix it
- **To change something**: Describe what you want changed
- **To understand code**: Ask "explain what this file does in simple terms"
- **If Claude Code seems confused**: Start a new conversation by typing `/clear` and re-explain what you need

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Twitter API (Free tier) | $0/month |
| xAI API (tweet generation) | ~$2-5/month |
| Claude API (alternative) | ~$2-5/month |
| Server to run scripts (optional) | $5-10/month for a small VPS |
| **Total** | **$5-15/month** |

You can run everything on your own computer for free if you leave it on. A VPS (Virtual Private Server) is only needed if you want it running 24/7 without keeping your computer on.

---

## Timeline

| Week | What to Do |
|------|-----------|
| **Week 1** | Set up Twitter API, get AI API key, build basic daily tweet script |
| **Week 2** | Add market scanner and weekly thread scripts |
| **Week 3** | Add news reaction script, start manual engagement (replies, DMs) |
| **Week 4** | Review analytics, adjust tweet style based on what's working |
| **Ongoing** | Keep the automation running, do 15-20 min/day of manual engagement |
