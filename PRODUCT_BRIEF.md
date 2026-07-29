# SkillBumble — Product Brief

## 1. Vision

SkillBumble is a peer-to-peer skill exchange platform where users teach what they know and learn what they don't, without money changing hands. It's for anyone who has a skill to share (coding, languages, music, cooking, anything) and wants to pick up something new in return. Instead of paying for lessons or sitting through tutorials alone, users swap knowledge directly — either one-on-one barter style or by earning credits teaching groups that can be spent on any other skill on the platform. **This is a success if a user can sign up, list a skill they can teach and a skill they want to learn, get matched with a complementary partner, schedule a session, and walk away having taught something and learned something — all without spending a cent.**

---

## 2. Users

**Priya (28, freelance graphic designer)**
Wants to learn Python for side projects but can't afford courses. She's an expert in design tools (Figma, Photoshop) and happy to teach those in exchange. Moderately tech-savvy — comfortable with web apps but not a developer.

**Marcus (35, software engineer)**
Knows Python and wants to learn Spanish for an upcoming trip. He's busy and values clear scheduling. Very tech-savvy. Likes the idea of teaching a group once and earning credits he can use for multiple future lessons.

**Ms. Chen (52, high school teacher)**
Has decades of experience with public speaking and wants to try learning guitar. She's cautious about online platforms and needs a simple, trustworthy experience. She'll only use the barter (GiveAndTake) mode — one swap at a time.

---

## 3. User Stories (priority order)

### Must-Have

1. **As a new user**, I want to create a profile with my name, bio, and meeting link, so that others know who I am and how to connect.
   > **Done when:** registration form accepts name, email, bio, and meeting link; email is unique; profile page is viewable after creation; user can edit their profile.

2. **As a user**, I want to browse available skills, so that I can see what I could learn or teach.
   > **Done when:** a skill catalog page lists all skills with name and category; skills are searchable by name; clicking a skill shows its description.

3. **As a user**, I want to mark skills I can teach and skills I want to learn on my profile, so that the platform knows what to match.
   > **Done when:** user can add a skill with type (teach/learn) and proficiency level; skills appear on the user's profile; user can remove a skill from their profile.

4. **As a user**, I want to find a match for GiveAndTake (barter), so that I can trade skills with someone who wants what I offer and offers what I want.
   > **Done when:** the system pairs two users where User A teaches Skill X and learns Skill Y, and User B teaches Skill Y and learns Skill X; matched users see each other's profiles; either user can confirm or cancel the match.

5. **As a user**, I want to schedule a session with my match, so that we agree on a time to meet.
   > **Done when:** a session can be created from a confirmed match with a date, time, and duration; session appears on both users' dashboards; the meeting link from the teacher's profile is attached.

6. **As a user**, I want to see my upcoming and past sessions in a dashboard, so that I can manage my schedule.
   > **Done when:** a dashboard page lists sessions grouped by status (scheduled, completed, cancelled); user can click a session to see details; teacher can mark a session as completed.

7. **As a user**, I want to rate my partner after a session, so that the community builds trust.
   > **Done when:** after a session is marked completed, both users can rate each other (1–5 stars + optional comment); rating appears on the ratee's profile; average rating is recalculated.

8. **As a teacher**, I want to create a post offering a skill to multiple learners (EarnCredits mode), so that I can teach a group and earn credits.
   > **Done when:** a post can be created linking to a skill the user teaches; post has a title, description, and status; learners can view and request to join active posts.

9. **As a learner**, I want to join a posted skill session (EarnCredits mode), so that I can learn from a teacher using credits or for free.
   > **Done when:** learner can see available posts; learner can enroll in a post; a session is created linking teacher and learner; teacher earns credit when session is completed.

10. **As a user**, I want to see my credit balance and transaction history, so that I know how many credits I have and where they went.
    > **Done when:** balance is visible on the profile and dashboard; a transactions page lists credits earned, spent, or refunded with timestamps and reasons.

### Nice-to-Have

11. **As a user**, I want to receive notifications when I'm matched or a session is coming up, so that I don't miss anything.
    > **Done when:** in-app notification appears for new matches, session reminders, and new ratings; unread count is shown in the nav.

12. **As a user**, I want to see badges and achievement levels on my profile, so that I feel recognized for my participation.
    > **Done when:** badges are awarded for milestones (first session, 10 sessions, 5-star ratings); badges display on the profile page.

13. **As an admin**, I want an analytics dashboard showing active users, sessions completed, and credit flow, so that I can monitor platform health.
    > **Done when:** admin-only page shows charts for users, sessions, and credits over time.


---

## 4. Scope

### Must-Have (MVP)
- User registration and profile management
- Skill catalog (browse, search)
- Users can add teach/learn skills to their profile
- GiveAndTake matchmaking (complementary pairing)
- Session scheduling and dashboard
- Post-session ratings (1–5)
- EarnCredits mode: create posts, enroll learners, track sessions
- Credit balance and transaction history

### Nice-to-Have
- Notifications (in-app)
- Gamification (badges, levels)
- Admin analytics dashboard
- AI skill recommendations
- Group learning sessions
- Mobile app

### Non-Goals
- No real-money payments or subscriptions
- No video/audio calling built in (uses external meeting links)
- No social feed or messaging between sessions
- No certification or formal credentialing
- No integration with external learning platforms (Phase 4)
- No internationalization / multi-language support

---

## 5. Key Screens / Mockups (low-fidelity)

```
Sign Up / Login ─────────────────────────────┐
                                              │
                     ┌────────────────────────┘
                     ▼
          ┌─────────────────────┐
          │   Dashboard         │
          │  ┌───────────────┐  │
          │  │ Upcoming      │  │
          │  │ Sessions      │  │
          │  └───────────────┘  │
          │  ┌───────────────┐  │
          │  │ Recommended   │  │
          │  │ Skills        │  │
          │  └───────────────┘  │
          │  [Credits: 42]      │
          └───┬─────┬─────┬────┘
              │     │     │
    ┌─────────┘     │     └──────────┐
    ▼               ▼                ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐
│ Profile  │ │ Skills   │ │ Matches      │
│          │ │ Catalog  │ │              │
│ - name   │ │ - search │ │ - pending    │
│ - bio    │ │ - filter │ │ - confirmed  │
│ - skills │ │ - list   │ │ - history    │
│ - rating │ └──────────┘ └──────────────┘
│ - link   │                              │
└──────────┘                              │
                                          ▼
                                  ┌──────────────┐
                                  │ Sessions     │
                                  │ - upcoming   │
                                  │ - completed  │
                                  │ - rate       │
                                  └──────────────┘

EarnCredits Flow:
  Post List ──► Post Detail ──► Enroll ──► Session ──► Rate
```

**Key screen transitions:**
- User lands on Dashboard after login — shows upcoming sessions, credit balance, recommended skills
- Click a skill → Skill detail page with users who teach/learn it
- Click a match → Match detail → Schedule session
- Click session → Session detail → Mark complete → Rate partner
- Post → Enroll learner → Session created → Rate teacher

---

## 6. Data & Rules

### Core Entities

| Entity | Key Fields | Notes |
|--------|-----------|-------|
| **User** | id, name, email (unique), bio, location, profile_image, credit_balance, rating_overall, meeting_link (unique, required) | meeting_link is set at registration and persists |
| **Skill** | id, name (unique), category, description | Global catalog — not per-user |
| **UserSkill** | id, user_id, skill_id, type (teach/learn), proficiency_level, visibility_flag | Junction table connecting users to skills |
| **Post** | id, user_id, skill_id, title, description, status (active/completed/cancelled) | For EarnCredits mode only |
| **Match** | id, user1_id, user2_id, skill_from_user1_id, skill_from_user2_id, match_status | Only for GiveAndTake; complementary skills required |
| **Session** | id, match_id (nullable), post_id (nullable), teacher_id, learner_id, meeting_link, scheduled_time, duration, session_status | Created from a match (GiveAndTake) or a post enrollment (EarnCredits) |
| **Rating** | id, session_id, rater_id, ratee_id, score (1–5), comment | One rating per direction per session (both users rate each other) |
| **CreditTransaction** | id, user_id, amount, reason (earned/spent/bonus/refund), session_id | Immutable audit log |

### Business Rules

- A user must have at least one teach skill and one learn skill to participate in GiveAndTake matching.
- A match requires complementary skills: User A teaches what User B wants to learn, and vice versa.
- A session can only be rated after both participants have marked it completed.
- Each participant can rate the other exactly once per session.
- In EarnCredits mode: `credits_earned = number_of_learners × sessions_completed` per post.
- Credits cannot go negative — spending is blocked if balance is insufficient.
- A meeting link is unique across all users and cannot be reused.
- A skill name is unique in the global catalog — no duplicates.
- Users can have multiple teach and learn skills.
- Deleting a user cascades to their UserSkills, Posts, Ratings, and CreditTransactions; Sessions they taught or learned are preserved but orphaned.
