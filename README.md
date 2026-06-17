# FocusBoard 🧠⏱️

**FocusBoard** is a modern, full-stack productivity web application designed for deep work. It combines a **Pomodoro timer**, **Kanban task board**, and **ambient focus tools** into a single, distraction-free dashboard.

This repository also serves as a **complete DevOps reference implementation** — a Next.js application deployed to AWS using infrastructure-as-code (Terraform), configuration management (Ansible), containerization (Docker), and a fully automated CI/CD pipeline (GitHub Actions).

---

## ✨ Application Features

### 🗂 Kanban Task Board
- Columns: To Do / Ongoing / Completed
- Drag & drop between columns
- Per-user task isolation
- Glassmorphic UI over animated background

### ⏱ Pomodoro Timer
- Focus / Break cycles with circular progress ring
- Customizable durations

### 🎵 Spotify Focus Player
- Embedded playlist for focus sessions

### 🔐 Authentication
- Email + password, cookie-based sessions
- Signup → Login → Board redirect flow

### 🌌 Ambient UI
- WebGL shader background (DarkVeil)
- Dark, modern SaaS dashboard aesthetic

---

## 🧱 Application Tech Stack

**Frontend:** Next.js (App Router), TypeScript, React, custom CSS
**Backend:** Next.js API Routes, Prisma ORM, PostgreSQL, cookie-based auth
**Graphics:** OGL (WebGL) for the animated background

---

## 🏗 Infrastructure & DevOps Architecture

This project is deployed entirely on AWS, with every layer of infrastructure defined as code.

```
GitHub (source + Actions workflow)
        │
        ▼
GitHub Actions CI/CD
   1. Build Docker image (linux/amd64)
   2. Push to Docker Hub
   3. Run Prisma migrations (via SSH tunnel to private RDS)
   4. Deploy to EC2 (pull image, restart container)
        │
        ▼
   Docker Hub  ──────────────►  AWS EC2 (public subnet)
                                      │
                                      ▼
                              AWS RDS PostgreSQL (private subnet)
```

### Networking (Terraform-managed)
- Custom VPC (`10.0.0.0/16`)
- Public subnet for the EC2 application server
- Two private subnets (different AZs) for the RDS database
- Internet Gateway + route table for public subnet egress
- Security groups: EC2 allows 22/80/3000 from the internet; RDS allows 5432 **only from the EC2 security group**, never from the public internet

### Compute & Database
- **EC2**: `t3.micro` (free tier), Ubuntu 22.04, Docker installed via Ansible
- **RDS**: PostgreSQL 16, `db.t3.micro` (free tier), private, not publicly accessible

### Containerization
- Multistage Dockerfile (`deps` → `prisma` → `builder` → `runner`) for optimal layer caching and minimal final image size
- Next.js standalone output mode for a lean production runtime
- Secrets are never baked into the image — passed only as runtime environment variables

### Configuration Management
- Ansible playbook installs Docker on the EC2 instance, pulls the latest image, and runs the container with the correct environment variables
- Idempotent — safe to re-run any time

### CI/CD Pipeline (GitHub Actions)
Three sequential jobs on every push to `main`:
1. **build-and-push** — builds the Docker image natively for `linux/amd64` and pushes to Docker Hub, using GitHub Actions cache for fast rebuilds
2. **migrate** — opens an SSH tunnel through the EC2 instance to reach the private RDS, then runs `prisma migrate deploy` from the runner
3. **deploy** — SSHes into EC2, pulls the new image, and restarts the container

All credentials (Docker Hub token, SSH key, database URL) are stored as GitHub encrypted secrets — never committed to the repository.

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Set up local PostgreSQL and .env
echo 'DATABASE_URL="postgresql://<user>@localhost/focusboard"' > .env

# Run migrations
npx prisma migrate deploy

# Start dev server
npm run dev
```

## 🐳 Running with Docker Locally

```bash
docker build -t focusboard .
docker run -p 3000:3000 -e DATABASE_URL="<your-db-url>" focusboard
```

## ☁️ Deploying Infrastructure

```bash
cd infra/terraform
TF_VAR_db_password="<password>" terraform apply
```

```bash
cd infra/ansible
ansible-playbook -i inventory.ini playbook.yml \
  --extra-vars "database_url=<connection-string>"
```

Pushing to `main` after this handles all future deployments automatically.

---

## 📁 Repository Structure

```
.
├── app/                    # Next.js application code
├── lib/                    # Shared utilities
├── prisma/                 # Schema and migrations
├── infra/
│   ├── terraform/          # AWS infrastructure (VPC, EC2, RDS, security groups)
│   └── ansible/             # Server configuration and deployment automation
├── .github/workflows/      # CI/CD pipeline definition
├── Dockerfile               # Multistage production build
└── .dockerignore
```
