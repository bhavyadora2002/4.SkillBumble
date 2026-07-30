# SkillBumble Database — Setup via MySQL Workbench

This folder has two scripts:

- `schema.sql` — drops and recreates the `skillbumble` database and all 8 tables.
- `seed.sql` — inserts sample data (5 users, 5 skills, matches, posts, sessions, ratings, credit transactions).

Both have already been run once against the local `MySQL80` service, so the database
exists. Use the steps below any time you want to reset it or re-run from Workbench.

## 1. Connect

1. Open **MySQL Workbench**.
2. If the `MySQL80` service isn't running, start it first (Windows: `services.msc` →
   find **MySQL80** → Start, or `Start-Service MySQL80` in PowerShell).
3. Open your connection to `127.0.0.1:3306` as `root` (or whichever local connection
   you already have set up) and enter the password when prompted.

## 2. Run schema.sql

1. **File → Open SQL Script...** and select `schema.sql` in this folder.
2. Click the ⚡ **Execute** (lightning bolt) icon, or press `Ctrl+Shift+Enter` to run
   the whole script.
3. Check the **Output** panel at the bottom — you should see a green checkmark for
   each statement and no errors. This creates the `skillbumble` schema and all tables.

> ⚠️ This script `DROP TABLE`s everything first, so re-running it wipes existing data.
> That's expected when you want a clean reset.

## 3. Run seed.sql

1. **File → Open SQL Script...** and select `seed.sql`.
2. In the schema tree on the left (**Navigator** panel), make sure `skillbumble` is
   set as your **default schema** (bold in the list) — double-click it if not.
3. Execute the whole script the same way (⚡ or `Ctrl+Shift+Enter`).
4. Output panel should show all `INSERT` statements succeeded.

## 4. Verify

Open a new query tab against the `skillbumble` schema and run:

```sql
SELECT table_name, table_rows
FROM information_schema.tables
WHERE table_schema = 'skillbumble';
```

Expected row counts after seeding:

| table | rows |
|---|---|
| users | 5 |
| skills | 5 |
| user_skills | 11 |
| posts | 1 |
| matches | 2 |
| sessions | 4 |
| ratings | 6 |
| credit_transactions | 2 |

You can also browse data directly: **Navigator → skillbumble → Tables**, right-click
any table → **Select Rows - Limit 1000**.

## Notes on the schema

- `skills` has **no `description` column** — it's just a global catalog (`skill_name`,
  `category`). Per-user descriptions live in `user_skills.description` instead, so
  each person writes their own blurb about what they teach/learn for that skill.
- `sessions.match_id`/`post_id`/`teacher_id`/`learner_id` are nullable with
  `ON DELETE SET NULL`, so deleting a user or match/post preserves the session row
  instead of blocking the delete or cascading it away. MySQL 8 doesn't allow a CHECK
  constraint on a column that also has an `ON DELETE SET NULL` action (error 3823),
  so the "at least one of match_id/post_id must be set" rule is **not** enforced by
  the database — enforce it in the application layer when creating sessions.
- Re-running `schema.sql` is destructive (drops all tables first). If you want to
  keep data across changes, back up first: **Server → Data Export** in Workbench.
