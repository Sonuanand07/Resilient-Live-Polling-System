# Git Commands Quick Reference

## Initial Setup (First Time)

```bash
# Navigate to project directory
cd live-polling-system

# Initialize git repository
git init

# Configure git (do this once)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Live Polling System implementation"
```

---

## Daily Development Workflow

### Check Status
```bash
# See which files changed
git status

# See detailed changes (what was added/removed)
git diff

# See changes in specific file
git diff frontend/src/components/StudentView.tsx
```

### Stage & Commit Changes

```bash
# Stage all changes
git add .

# OR stage specific file
git add frontend/src/components/RoleSelection.tsx

# OR stage specific folder
git add backend/src/services/

# Commit with message
git commit -m "Fix text alignment in role selection cards"

# View commit history
git log --oneline
git log --oneline -5  # Last 5 commits
```

---

## Feature Branch Workflow

### Create Feature Branch
```bash
# Create and switch to new branch
git checkout -b feature/chat-popup

# OR (newer Git syntax)
git switch -c feature/chat-popup

# Verify you're on new branch
git branch
# Output: 
#   main
# * feature/chat-popup   ← asterisk shows current branch
```

### Make Changes on Feature Branch

```bash
# Make changes to files
# ... edit files ...

# Stage changes
git add .

# Commit changes
git commit -m "Implement chat popup component

- Add ChatPopup component
- Add chat socket events
- Update UI to include chat button
- Add styling for chat window"

# Make more commits as needed
git commit -m "Add chat message persistence"
```

### View What Changed
```bash
# See all commits in this branch vs main
git log --oneline main..feature/chat-popup

# See detailed diff between branches
git diff main feature/chat-popup

# See commits since branch creation
git log --oneline --graph --all
```

---

## Merging Changes

### Merge Feature into Main

```bash
# Switch to main branch
git checkout main

# Update main with latest changes (if working with team)
git pull origin main

# Merge feature branch into main
git merge feature/chat-popup

# Delete feature branch (after successful merge)
git branch -d feature/chat-popup

# OR force delete if not fully merged
git branch -D feature/chat-popup
```

---

## Working with Remote Repository

### First Time: Connect to Remote

```bash
# Create repository on GitHub/GitLab/Bitbucket

# Add remote (replace URL with your repo)
git remote add origin https://github.com/yourname/live-polling-system.git

# Verify remote added
git remote -v
```

### Push Changes to Remote

```bash
# Push main branch (first time)
git push -u origin main

# Push subsequent changes
git push

# Push feature branch
git push -u origin feature/chat-popup

# Push all branches
git push --all
```

### Pull Changes from Remote

```bash
# Download and merge changes
git pull

# OR download without merging
git fetch

# Then merge manually
git merge origin/main
```

---

## Viewing History & Changes

### View Commits
```bash
# View commit log
git log

# View concise log (one line per commit)
git log --oneline

# View last N commits
git log --oneline -10

# View commits with graph
git log --oneline --graph --all

# View commits for specific file
git log --oneline frontend/src/components/StudentView.tsx

# View specific commit details
git show abc123def  # use commit hash from log

# View changes in commit
git show abc123def --stat  # summary of changes
```

### Compare Changes
```bash
# Compare working directory with staging area
git diff

# Compare staging area with last commit
git diff --cached

# Compare two branches
git diff main feature/chat-popup

# Compare specific commit
git diff abc123def main
```

---

## Undoing Changes

### Before Staging

```bash
# Discard changes in working directory
git checkout frontend/src/components/StudentView.tsx

# OR (newer syntax)
git restore frontend/src/components/StudentView.tsx

# Discard all changes
git checkout .
```

### After Staging (Before Commit)

```bash
# Unstage file (but keep changes)
git reset HEAD frontend/src/components/StudentView.tsx

# OR (newer syntax)
git restore --staged frontend/src/components/StudentView.tsx

# Unstage and discard changes
git reset --hard HEAD
```

### After Commit

```bash
# Undo last commit, keep changes
git reset --soft HEAD~1

# Undo last commit, discard changes
git reset --hard HEAD~1

# Create new commit that undoes previous commit
git revert abc123def

# Amend last commit message
git commit --amend -m "New commit message"

# Amend last commit with new changes
git add .
git commit --amend --no-edit
```

---

## Branches

### Create & Switch Branches

```bash
# List all branches
git branch

# List with last commit
git branch -v

# Create new branch
git branch feature/new-feature

# Switch to branch
git checkout feature/new-feature

# Create and switch (one command)
git checkout -b feature/new-feature

# Newer syntax
git switch -c feature/new-feature

# Delete branch
git branch -d feature/new-feature

# Force delete
git branch -D feature/new-feature

# Rename branch
git branch -m old-name new-name
```

### Compare Branches

```bash
# See commits in main not in feature
git log feature/chat-popup..main

# See commits in feature not in main
git log main..feature/chat-popup

# See differences
git diff main feature/chat-popup
```

---

## Stashing (Temporary Save)

```bash
# Save changes temporarily without committing
git stash

# List all stashes
git stash list

# Restore most recent stash
git stash pop

# Restore specific stash
git stash pop stash@{0}

# Restore without deleting stash
git stash apply

# Delete stash
git stash drop
```

---

## Tags (Version Marking)

```bash
# Create lightweight tag
git tag v1.0.0

# Create annotated tag (with message)
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"

# List tags
git tag

# View tag details
git show v1.0.0

# Push tags to remote
git push origin --tags

# Delete tag
git tag -d v1.0.0
```

---

## Useful Aliases (Save Typing)

Add to git config:
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'restore --staged'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --oneline --graph --all'
```

Then use:
```bash
git st        # instead of git status
git co main   # instead of git checkout main
git ci -m "msg"  # instead of git commit -m "msg"
```

---

## For Live Polling System: Complete Workflow

### 1. Initial Commit
```bash
cd live-polling-system
git init
git add .
git commit -m "Live Polling System - Complete implementation with all fixes"
```

### 2. Fix Chat Popup Feature
```bash
git checkout -b feature/chat-popup
# ... implement chat popup ...
git add frontend/src/components/ChatPopup.tsx backend/src/services/ChatService.ts
git commit -m "Implement chat popup feature"
git checkout main
git merge feature/chat-popup
```

### 3. Push to GitHub
```bash
git remote add origin https://github.com/yourname/live-polling-system.git
git push -u origin main
```

### 4. Create Release Tag
```bash
git tag -a v1.0.0 -m "First stable release"
git push origin v1.0.0
```

---

## Emergency: Recover Deleted Commits

```bash
# Find deleted commits
git reflog

# Restore deleted commit
git checkout abc123def

# Create new branch from recovered commit
git checkout -b recovered-feature abc123def
```

---

## Team Collaboration

### Pull Request Workflow (GitHub)

```bash
# Create feature branch locally
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push -u origin feature/new-feature

# On GitHub: Create Pull Request
# Ask teammates to review
# Merge PR on GitHub
# Delete remote branch

# Back locally:
git checkout main
git pull
git branch -d feature/new-feature
```

---

## Summary of Most Used Commands

| Task | Command |
|------|---------|
| Check status | `git status` |
| Stage changes | `git add .` |
| Commit | `git commit -m "message"` |
| View history | `git log --oneline` |
| Create branch | `git checkout -b feature/name` |
| Switch branch | `git checkout main` |
| Merge branch | `git merge feature/name` |
| Push changes | `git push` |
| Pull changes | `git pull` |
| View changes | `git diff` |
| Undo changes | `git reset --hard HEAD` |

---

## Resource Links

- [Git Official Documentation](https://git-scm.com/doc)
- [Git Cheat Sheet](https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf)
- [Interactive Learning](https://learngitbranching.js.org/)
- [GitHub Guides](https://guides.github.com/)

---

**Last Updated:** January 30, 2026
