from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import os
from db import repos
from bson import ObjectId
import requests
from datetime import datetime, timedelta
import time

# Load environment variables
load_dotenv()


# Flask app setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
# ------------------------------

# Configure Gemini API
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# GitHub API Configuration
GITHUB_API = "https://api.github.com"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def github_request(url):
    """Make authenticated GitHub API request"""
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.com+json"
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        # Check for message in error response before raising
        error_message = response.json().get('message', 'Unknown GitHub API error') if response.content else 'Unknown error, no content'
        raise Exception(f"GitHub API Error: {error_message}")
    return response.json()

def parse_github_url(git_url):
    """Extract owner and repo from GitHub URL"""
    parts = git_url.replace("https://", "").replace("http://", "").replace("github.com/", "").strip("/").split("/")
    if len(parts) >= 2:
        return parts[0], parts[1].replace(".git", "")
    raise ValueError("Invalid GitHub URL format")

def calculate_repo_health(repo_data, commits, issues, prs, contributors):
    """Calculate repository health score and metrics"""
    now = datetime.now()
    last_update = datetime.strptime(repo_data["updated_at"], "%Y-%m-%dT%H:%M:%SZ")
    days_since_update = (now - last_update).days
    
    # Filter issues and PRs
    open_issues = [i for i in issues if i["state"] == "open" and "pull_request" not in i]
    closed_issues = [i for i in issues if i["state"] == "closed" and "pull_request" not in i]
    
    old_issues = []
    for issue in open_issues:
        issue_date = datetime.strptime(issue["created_at"], "%Y-%m-%dT%H:%M:%SZ")
        if (now - issue_date).days > 30:
            old_issues.append(issue)
    
    open_prs = [pr for pr in prs if pr["state"] == "open"]
    stale_prs = []
    for pr in open_prs:
        pr_date = datetime.strptime(pr["created_at"], "%Y-%m-%dT%H:%M:%SZ")
        if (now - pr_date).days > 7:
            stale_prs.append(pr)
    
    # Health Score Calculation (0-100)
    health_score = 100
    
    if days_since_update > 90:
        health_score -= 30
    elif days_since_update > 30:
        health_score -= 15
    
    if len(issues) > 0:
        issue_ratio = len(closed_issues) / len(issues)
        if issue_ratio < 0.5:
            health_score -= 20
    
    if len(old_issues) > 10:
        health_score -= 15
    
    if len(stale_prs) > 5:
        health_score -= 15
    
    if len(contributors) < 3:
        health_score -= 10
    
    return {
        "score": max(0, round(health_score, 1)),
        "metrics": {
            "commitActivity": {
                "status": "Healthy" if days_since_update < 30 else ("Warning" if days_since_update < 90 else "Critical"),
                "message": f"Last updated {days_since_update} days ago",
                "daysSinceUpdate": days_since_update
            },
            "issueHealth": {
                "total": len(issues),
                "open": len(open_issues),
                "closed": len(closed_issues),
                "oldIssues": len(old_issues),
                "status": "Healthy" if len(old_issues) < 5 else "Warning",
                "message": f"{len(old_issues)} issues older than 30 days"
            },
            "prStatus": {
                "total": len(prs),
                "open": len(open_prs),
                "stalePRs": len(stale_prs),
                "status": "Healthy" if len(stale_prs) < 3 else "Warning",
                "message": f"{len(stale_prs)} PRs waiting for review over a week"
            },
            "contributorHealth": {
                "count": len(contributors),
                "status": "Healthy" if len(contributors) > 5 else "Warning",
                "message": f"{len(contributors)} active contributors"
            }
        }
    }

def calculate_trends(commits, issues, prs):
    """Calculate repository trends"""
    now = datetime.now()
    thirty_days_ago = now - timedelta(days=30)
    sixty_days_ago = now - timedelta(days=60)
    
    recent_commits = []
    previous_commits = []
    
    for commit in commits:
        commit_date = datetime.strptime(commit["commit"]["author"]["date"], "%Y-%m-%dT%H:%M:%SZ")
        if commit_date > thirty_days_ago:
            recent_commits.append(commit)
        elif commit_date > sixty_days_ago:
            previous_commits.append(commit)
    
    commit_change = 0
    if len(previous_commits) > 0:
        commit_change = ((len(recent_commits) - len(previous_commits)) / len(previous_commits)) * 100
    
    recent_issues = [i for i in issues if datetime.strptime(i["created_at"], "%Y-%m-%dT%H:%M:%SZ") > thirty_days_ago]
    closed_recent = [i for i in recent_issues if i["state"] == "closed"]
    
    recent_contributors = set()
    for commit in recent_commits:
        if commit.get("author") and commit["author"].get("login"):
            recent_contributors.add(commit["author"]["login"])
    
    return {
        "commitTrend": {
            "current": len(recent_commits),
            "previous": len(previous_commits),
            "change": round(commit_change, 1),
            "status": "Increasing" if commit_change > 0 else "Decreasing",
            "message": f"Commits {'increased' if commit_change > 0 else 'decreased'} by {abs(round(commit_change, 1))}% in last 30 days"
        },
        "issueTrend": {
            "opened": len(recent_issues),
            "closed": len(closed_recent),
            "status": "Improving" if len(closed_recent) >= len(recent_issues) else "Needs Attention",
            "message": f"{len(closed_recent)} issues closed out of {len(recent_issues)} opened in last 30 days"
        },
        "contributorTrend": {
            "recentContributors": len(recent_contributors),
            "message": f"{len(recent_contributors)} active contributors in last 30 days"
        }
    }

@app.route("/")
def home():
    return jsonify({"message": "Repo Explorer Flask backend running!"})

@app.route("/api/repos", methods=["GET"])
def get_repos():
    """Fetch all analyzed repositories"""
    all_repos = []
    for repo in repos.find():
        repo["_id"] = str(repo["_id"])
        all_repos.append(repo)
    return jsonify(all_repos)

@app.route("/api/repos", methods=["POST"])
def analyze_repo():
    """Analyze a Git repository using GitHub API + Gemini 2.5 Flash"""
    data = request.get_json()
    name = data.get("name")
    git_url = data.get("gitUrl")

    if not git_url:
        return jsonify({"error": "Git URL is required"}), 400

    try:
        # Parse GitHub URL
        owner, repo = parse_github_url(git_url)
        
        # Fetch data from GitHub API
        repo_data = github_request(f"{GITHUB_API}/repos/{owner}/{repo}")
        commits = github_request(f"{GITHUB_API}/repos/{owner}/{repo}/commits?per_page=100")
        issues = github_request(f"{GITHUB_API}/repos/{owner}/{repo}/issues?state=all&per_page=100")
        prs = github_request(f"{GITHUB_API}/repos/{owner}/{repo}/pulls?state=all&per_page=100")
        contributors = github_request(f"{GITHUB_API}/repos/{owner}/{repo}/contributors?per_page=100")
        languages = github_request(f"{GITHUB_API}/repos/{owner}/{repo}/languages")
        
        # Calculate health and trends
        health = calculate_repo_health(repo_data, commits, issues, prs, contributors)
        trends = calculate_trends(commits, issues, prs)
        
        # Get top contributors
        top_contributors = [
            {
                "login": c["login"],
                "contributions": c["contributions"],
                "avatarUrl": c["avatar_url"],
                "profileUrl": c["html_url"]
            }
            for c in contributors[:10]
        ]
        
        # Calculate language percentages
        total_bytes = sum(languages.values())
        language_breakdown = [
            {
                "language": lang,
                "percentage": round((bytes_count / total_bytes) * 100, 2)
            }
            for lang, bytes_count in languages.items()
        ]
        
        # Use Gemini for AI-powered insights
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
        Analyze this GitHub repository: {git_url}
        
        Repository Stats:
        - Stars: {repo_data["stargazers_count"]}
        - Forks: {repo_data["forks_count"]}
        - Open Issues: {repo_data["open_issues_count"]}
        - Primary Language: {repo_data["language"]}
        - Health Score: {health["score"]}/100
        - Recent Commits: {trends["commitTrend"]["current"]}
        - Contributors: {len(contributors)}
        
        Provide a concise 5-line technical analysis covering:
        1. Repository purpose and main technology stack
        2. Code quality and maintenance status
        3. Community engagement and activity level
        4. Key strengths or concerns
        5. Overall recommendation for developers
        """
        
        response = model.generate_content(prompt)
        ai_insights = response.text if response and response.text else "No AI analysis available."
        
        # Prepare complete analysis
        analysis = {
            "name": name or repo_data["name"],
            "gitUrl": git_url,
            "basic": {
                "fullName": repo_data["full_name"],
                "description": repo_data["description"],
                "stars": repo_data["stargazers_count"],
                "forks": repo_data["forks_count"],
                "watchers": repo_data["watchers_count"],
                "openIssues": repo_data["open_issues_count"],
                "language": repo_data["language"],
                "createdAt": repo_data["created_at"],
                "updatedAt": repo_data["updated_at"],
                "size": repo_data["size"]
            },
            "health": health,
            "trends": trends,
            "contributors": top_contributors,
            "languages": language_breakdown,
            "aiInsights": ai_insights,
            "analyzedAt": datetime.now().isoformat()
        }
        
        # Store in MongoDB
        inserted = repos.insert_one(analysis)
        analysis["_id"] = str(inserted.inserted_id)
        
        return jsonify(analysis), 201

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/repos/<repo_id>/ask", methods=["POST"])
def ask_question(repo_id):
    """Answer questions about a repository using Gemini 2.5 Flash with deep project analysis"""
    try:
        data = request.get_json()
        question = data.get("question")
        
        if not question:
            return jsonify({"error": "Question is required"}), 400
        
        repo = repos.find_one({"_id": ObjectId(repo_id)})
        if not repo:
            return jsonify({"error": "Repository not found"}), 404
        
        repo_url = repo['gitUrl']
        repo_name = repo['basic']['fullName']
        
        # Try to fetch README from GitHub API
        readme_content = ""
        try:
            owner, repo_name_only = parse_github_url(repo_url)
            readme_response = requests.get(
                f"{GITHUB_API}/repos/{owner}/{repo_name_only}/readme",
                headers={"Authorization": f"token {GITHUB_TOKEN}"},
                timeout=10
            )
            if readme_response.status_code == 200:
                import base64
                readme_content = base64.b64decode(readme_response.json()['content']).decode('utf-8')
        except:
            readme_content = ""
        
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        # Comprehensive system instruction
        system_instruction = f"""
You are an expert Code and Project Analysis AI. Your primary task is to provide **short summary, comprehensive, and technically accurate** answers about GitHub repositories.

**CRITICAL INSTRUCTION FOR "HOW DOES IT WORK?" / "EXPLAIN WORKING" QUESTIONS:**
When the user asks "How does it work?", "Explain the working", "What does this project do?", or similar conceptual questions:
1. **Use the README content provided below as the PRIMARY source**
2. Provide a short summary breakdown including:
   - Project purpose and goals
   - Core technologies and tools used (not generic guesses)
   - Step-by-step workflow/process
   - Key components and how they interact
   - Special features or unique mechanisms
   - Implementation details

**For metric/health questions:**
- Reference the repository metrics data
- Be specific about numbers and trends

--- Repository Information ---
Repository: {repo_name}
URL: {repo_url}
Description: {repo['basic']['description']}

README Content:
{readme_content if readme_content else "README not available"}

Repository Metrics:
- Stars: {repo['basic']['stars']}
- Language: {repo['basic']['language']}
- Health Score: {repo['health']['score']}/100
- Recent Activity: {repo['trends']['commitTrend']['message']}
- Contributors: {repo['trends']['contributorTrend']['recentContributors']} active (30 days)

AI Summary: {repo.get('aiInsights', 'N/A')}
--- End Repository Information ---

**Response Quality Standards:**
- Be specific and technical
- Use actual details from the repository and README
- Provide examples when relevant
- For project explanations, use step-by-step breakdowns
- Do NOT give generic explanations that could apply to many projects
- Prioritize accuracy and depth over brevity
"""
        
        full_prompt = f"""{system_instruction}

User Question: {question}

Answer this question comprehensively. If asking about how the project works, provide short summary explanations with specific technology names and workflows."""
        
        MAX_RETRIES = 3
        delay = 1
        
        for attempt in range(MAX_RETRIES):
            try:
                response = model.generate_content(full_prompt)
                
                if response and response.text:
                    answer = response.text
                else:
                    answer = "Unable to generate answer. Please try again."
                
                return jsonify({"answer": answer}), 200
                
            except Exception as api_error:
                error_str = str(api_error)
                print(f"Attempt {attempt + 1} failed: {error_str}")
                
                if attempt < MAX_RETRIES - 1:
                    time.sleep(delay)
                    delay *= 2
                else:
                    # Last attempt failed, raise the error
                    raise api_error
        
    except Exception as e:
        print("Error in ask_question endpoint:", str(e))
        return jsonify({"error": f"Failed to generate answer: {str(e)}"}), 500


@app.route("/api/repos/<repo_id>", methods=["GET"])
def get_repo_details(repo_id):
    """Get detailed analysis of a specific repository"""
    try:
        repo = repos.find_one({"_id": ObjectId(repo_id)})
        if repo:
            repo["_id"] = str(repo["_id"])
            return jsonify(repo)
        return jsonify({"error": "Repository not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500






if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)


