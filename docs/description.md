# Role & User Creation Flow

## 1 · Login

### Fields
- **Phone number** – E.164 format, country selector  
- **OTP** – 6-digit segmented input (auto-advance, 30 s “Resend OTP” timer)

### Actions & States
- **Next** (enabled once phone number is valid)  
- **Continue** (submits OTP)  
- Five failed OTP attempts lock the field for 5 min.  
- SMS auto-capture fills the code when supported.

---

## 2 · Admin Dashboard

> The main screen combines *User Details* and *Role Builder* in a single form.

### 2.1 Layout
- **Left column (35 %)** – *User Details* card  
- **Right column (65 %)** – *Role Builder* panel  
- **Top bar** – Page title “Create Role & User”, breadcrumb “Home › Admin › New”  
- **Sticky footer** – **Submit** (primary) | **Discard** (secondary)

### 2.2 User Details Card
| Field          | Type          | Validation / Rules                                   |
|----------------|---------------|------------------------------------------------------|
| Full Name      | Text          | Required; auto-capitalise words                      |
| Phone Number   | Tel input     | E.164; flag shows country code                      |
| Email          | Email input   | Must be unique; live “already registered” warning   |
| Club           | Dropdown      | Searchable; lists only clubs admin can manage       |
| Role           | Dropdown      | Existing role **or** “New Role…” option             |

*Buttons inside card footer:* **Cancel** (secondary) · **Save User** (disabled until fields pass validation)

### 2.3 Role Builder Panel
- **Role Name** – required, unique  
- **Clone From** – optional templates (Client Services, Sr. Leadership, General Manager, Front Desk)  
- **Permission Matrix** – eight accordion modules, each with tri-state checkboxes  
  1. Booking  
  2. Member  
  3. Subscription  
  4. Commercial  
  5. Admin  
  6. Franchise  
  7. Access & Permissions  
  8. Personal Info & Configuration  
- **Bulk-select icons** – “All Full Access”, “All Read-only”, “All Forbidden”  
- **Search / Filter bar** – text search; toggle to hide empty modules  
- **Summary badge** – e.g. “15 functions selected”

*Buttons beneath matrix:* **Save Role** (primary) · **Reset**

### 2.4 Form Logic
| Condition                                                                    | Submit enabled? | Outcome                                                 |
|-------------------------------------------------------------------------------|-----------------|---------------------------------------------------------|
| User fields valid **and** new role valid                                      | Yes             | Creates role, then user, then redirects to Success page |
| User fields valid, existing role selected                                     | Yes             | Creates user only, then redirects                      |
| Any invalid field                                                             | No              | Inline errors; footer tooltip “Complete required fields”|

*Responsiveness:* below 1024 px the two columns stack; footer becomes top-fixed.

---

## 3 · Success Page
- Large check-mark icon + **“Success!”** heading  
- **Summary panel** – User Name, Assigned Role, Club, timestamp  
- **Call-to-action buttons**  
  - **Create Another User / Role** – returns to Dashboard with cleared form  
  - **View All Users** – navigates to user list  
- Toast notification: “Jane Doe added as Front Desk (Club #12)”  
- Optional auto-redirect to user list after 8 s.

---

## Flow Recap
Login ──› Admin Dashboard (build role & user, Submit) ──› Success Page