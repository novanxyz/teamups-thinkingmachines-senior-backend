# Teamups Technical Exercise (Sr Back-end)

## Intro

Introduction video: https://drive.google.com/file/d/1KlPYZfZEVaBqDU0AbiXGgz_zmAV-Lhl3/view?usp=drive_link

![LMWN assessment screenshot - home](https://teamupsgeneral.blob.core.windows.net/teamupspublic/sr-backend-v2/customer-details-page.png)

## Quick start

1. Clone the repo: `git clone {REPO_URL}`

1. CD into the repo: `cd /path/to/repo`

1. Start via docker compose: `docker-compose up` ([walkthrough video](https://www.loom.com/share/dcf8961c7b194fecaa9971af433c8d99?sid=9abaf869-b1a2-407a-aeb2-39678d50b3ca)).

1. Once running, visit `http://localhost:3000/` to load the app--the first load might be slow. You should see the following page if everything is successful.
   ![LMWN assessment screenshot - home](https://teamupsgeneral.blob.core.windows.net/teamupspublic/sr-backend-v2/home-page.png)

1. Click on the "Create seed" button to bootstrap the customer data once you are ready.

## Sample git workflow

Here is a sample flow for making changes and submitting a PR after completing the exercise:

```
// check out a new branch for your changes
git checkout -b {BRANCH_NAME}

// make changes and commit them
git add --all
git commit

// push new branch up to GitHub
git push origin {BRANCH_NAME}

// use GitHub to make PR
// (DO NOT MERGE PR)
```
