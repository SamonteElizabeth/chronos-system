# Chronos System - Project Scope Document

## Project Overview

Chronos System is a comprehensive project management and time tracking platform designed for engineering teams and project managers. The system provides role-based access control with different interfaces for various user types including Engineers, Project Managers (PM), Team Managers (TM), and administrative roles.

## Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 7.0.6
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0
- **Development**: ESLint, PostCSS, Autoprefixer

## Core Features & Modules

### 1. Authentication & User Management
- **Multi-role authentication system** with the following roles:
  - TASS (System Administrator)
  - PMO (Project Management Office)
  - PM (Project Manager)
  - TM (Technical Manager)
  - ENGINEER
  - PM_DEPT_HEAD (PM Department Head)
  - TM_DEPT_HEAD (TM Department Head)
  - EEM (Engineering Executive Manager)

- **Department-based organization**:
  - ITSD (IT Systems Development)
  - DIG (Digital Innovation Group)
  - BSD (Business Systems Development)
  - TSD (Technical Systems Development)

- **User switching functionality** for testing different roles
- **Salary level and hourly rate tracking** (Levels 1-5)

### 2. Project Management
- **Project lifecycle management**:
  - PLANNING → ACTIVE → ON_HOLD → COMPLETED
- **Project creation with detailed specifications**:
  - Sales Order Number
  - Client Company Name
  - Account Manager
  - Statement of Work (SOW) Mandays
  - Solution description
  - Budget tracking (planned vs. spent)
- **Project assignment** to PMs and TMs
- **Progress tracking** with percentage completion
- **Project grid view** for overview and management

### 3. Task Management
- **Hierarchical task structure**:
  - Main tasks with subtasks
  - Task dependencies
  - Priority levels (LOW, MEDIUM, HIGH, CRITICAL)
  - Status tracking (PENDING, ONGOING, COMPLETED)
- **Task assignment** to engineers
- **Time estimation and tracking**:
  - Estimated hours vs. actual hours
  - Start and due dates
- **Enhanced task execution interface**
- **Task completion workflows**

### 4. Time Tracking & Timesheets
- **Real-time timer functionality** with location tracking
- **Engineer timesheet management**
- **Time entry logging** with descriptions
- **Location-based time tracking** (latitude/longitude/address)
- **Active timer management**

### 5. Request Management System
- **Multiple request types**:
  - CORRECTION (time correction requests)
  - OVERTIME (overtime requests)
  - HOLIDAY (holiday requests)
  - EXTENSION (deadline extension requests)
- **Hierarchical approval workflow**:
  - Submitted to PM, TM, PMO, TASS, or Department Heads
  - Status tracking (PENDING, APPROVED, REJECTED)
- **Request justification and impact assessment**
- **Urgency levels** (LOW, MEDIUM, HIGH, CRITICAL)

### 6. Analytics & Reporting
- **Unified analytics dashboard**
- **Project performance metrics**
- **Time tracking analytics**
- **Resource utilization reports**
- **Department-wise reporting**

### 7. Location Management
- **Location tracking module**
- **Geolocation services**
- **Address management**

### 8. PM Assignments
- **Project Manager assignment management**
- **Workload distribution**
- **Assignment tracking**

### 9. Approvals System
- **Centralized approval workflow**
- **Request review interface**
- **Approval history tracking**

### 10. Task Logs
- **Comprehensive task logging**
- **Activity tracking**
- **Audit trail**

### 11. TrackPro Milestones
- **Milestone tracking system**
- **Progress monitoring**
- **Department-wise milestone management**

## Mobile Application Support

The system includes mobile-specific interfaces:
- **EngineerApp.tsx** - Mobile interface for engineers
- **PMApp.tsx** - Mobile interface for project managers
- **TMApp.tsx** - Mobile interface for team managers
- **MobileAppSelector.tsx** - Role-based mobile app selection

## Key Workflows

### 1. Project Creation Workflow
1. TASS creates project with sales order details
2. Assigns PM and TM to project
3. PM/TM creates tasks and assigns engineers
4. Engineers track time and progress

### 2. Time Tracking Workflow
1. Engineer starts timer for assigned task
2. System tracks location and time
3. Engineer logs time entries with descriptions
4. Timesheet generation and review

### 3. Request Approval Workflow
1. User submits request (correction, overtime, etc.)
2. Request routed to appropriate approver
3. Approver reviews and approves/rejects
4. User notified of decision

### 4. Task Management Workflow
1. PM/TM creates tasks with subtasks
2. Assigns engineers to tasks
3. Engineers update progress and log time
4. Task completion and milestone tracking

## Data Models

### Core Entities
- **User**: Role-based user management
- **Project**: Project lifecycle and details
- **Task**: Task management with subtasks
- **TimeEntry**: Time tracking records
- **TimeRequest**: Approval requests
- **ActiveTimer**: Real-time timer state
- **MilestoneEntry**: Milestone tracking

### Form Data Models
- **ProjectFormData**: Project creation forms
- **TaskFormData**: Task creation forms
- **RequestFormData**: Request submission forms

## Security & Access Control

- **Role-based access control (RBAC)**
- **Department-based data segregation**
- **Hierarchical approval workflows**
- **Audit trail for all activities**

## Integration Points

- **Location services** for time tracking
- **Payment gateway integration** (Stripe mentioned in mock data)
- **API documentation system**
- **Mobile app synchronization**

## Future Enhancements

Based on the codebase analysis, potential areas for expansion:
- **Real-time notifications** (Bell icon in UI)
- **Settings management** (Settings icon in UI)
- **Advanced reporting and analytics**
- **Integration with external project management tools**
- **Enhanced mobile capabilities**
- **API-first architecture for third-party integrations**

## Technical Requirements

- **Responsive design** for desktop and mobile
- **Real-time updates** for collaborative features
- **Offline capability** for mobile applications
- **Data persistence** and synchronization
- **Performance optimization** for large datasets
- **Accessibility compliance**

## Success Metrics

- **User adoption rates** across different roles
- **Time tracking accuracy** and compliance
- **Project delivery timelines**
- **Resource utilization efficiency**
- **Approval workflow efficiency**
- **System performance** and reliability 