-- CreateAutonomousSystem
-- Create autonomous tasks and runs tables for AIHub self-programming

CREATE TABLE IF NOT EXISTS "autonomous_tasks" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL DEFAULT 'feature',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" INTEGER NOT NULL DEFAULT 5,
    "description" TEXT NOT NULL,
    "planning_prompt" TEXT,
    "subtasks" JSONB,
    "planning_result" TEXT,
    "branch" TEXT,
    "commit_hash" TEXT,
    "pr_url" TEXT,
    "pr_number" INTEGER,
    "test_results" JSONB,
    "review_results" JSONB,
    "error_log" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    "completed_at" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "autonomous_runs" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "task_id" UUID NOT NULL REFERENCES "autonomous_tasks"("id") ON DELETE CASCADE,
    "step" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "logs" TEXT,
    "output" TEXT,
    "duration" INTEGER,
    "error" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "autonomous_tasks_status_idx" ON "autonomous_tasks"("status");
CREATE INDEX IF NOT EXISTS "autonomous_tasks_priority_idx" ON "autonomous_tasks"("priority");
CREATE INDEX IF NOT EXISTS "autonomous_runs_task_id_idx" ON "autonomous_runs"("task_id");