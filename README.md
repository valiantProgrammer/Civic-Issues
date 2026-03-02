# Civic साथी - Where Your Voice Meets Actions

![Civic साथी Logo](./public/images/logo.png)

<style>
  @keyframes typeWriter {
    0% { width: 0; }
    70% { width: 100%; }
    100% { width: 100%; }
  }
  
  @keyframes blink {
    50% { border-right-color: transparent; }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes wave {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  .typewriter {
    display: inline-block;
    overflow: hidden;
    border-right: 3px solid #3b82f6;
    white-space: nowrap;
    animation: typeWriter 4s steps(50, end) infinite, blink 0.75s step-end infinite;
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
  }
  
  .animated-block {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
    border-radius: 12px;
    padding: 30px;
    color: white;
    margin: 20px 0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .wave-text {
    display: inline-block;
    letter-spacing: 10px;
  }
  
  .wave-text span {
    animation: wave 1s ease-in-out infinite;
    display: inline-block;
  }
  
  .wave-text span:nth-child(1) { animation-delay: 0s; }
  .wave-text span:nth-child(2) { animation-delay: 0.1s; }
  .wave-text span:nth-child(3) { animation-delay: 0.2s; }
  .wave-text span:nth-child(4) { animation-delay: 0.3s; }
  .wave-text span:nth-child(5) { animation-delay: 0.4s; }
  .wave-text span:nth-child(6) { animation-delay: 0.5s; }
  
  .float-element {
    animation: slideIn 0.8s ease-out;
  }
  
  .glow-box {
    border: 2px solid #3b82f6;
    border-radius: 8px;
    padding: 15px;
    background: rgba(59, 130, 246, 0.05);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
    animation: pulse 2s ease-in-out infinite;
    margin: 10px 0;
  }
</style>

<div class="float-element">
  <div class="animated-block">
    <h2 style="margin-top: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">✨ Civic साथी ✨</h2>
    <h3 class="typewriter">Where Your Voice Meets Actions</h3>
  </div>
</div>

---

## 🌟 Overview

**Civic साथी** is a comprehensive civic issues reporting and management platform that empowers citizens to report local infrastructure problems and enables municipal authorities to efficiently manage and resolve these issues. The platform bridges the gap between citizens and local governance, fostering transparency and accountability in civic infrastructure management.

### Tagline
**"Where your voice meets actions"** - Report local issues with just a few taps and help create a better community for everyone.

---

## 🎯 Project Goals

<div class="glow-box" style="border-left: 4px solid #10b981;">
  <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style="width: 100%; height: auto; margin: -10px -15px 10px -15px;">
    <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z" fill="#10b98120" opacity="0.5"></path>
    <path d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z" fill="#059669" opacity="0.3"></path>
  </svg>
  <h3 style="margin-top: 0; color: #047857;">🎯 Our Mission</h3>
</div>

1. **Citizen Empowerment**: Enable citizens to easily report civic issues with multimedia evidence
2. **Transparency**: Provide complete visibility into issue status and action taken
3. **Efficient Management**: Help municipal authorities streamline issue verification and resolution
4. **Community Building**: Foster collaboration between citizens and local government for infrastructure improvement

---

## ✨ Key Features

### For Citizens
- **Easy Report Submission**: Report local issues with photos/videos and detailed descriptions
- **Category Selection**: Choose from predefined issue categories (Pothole, Water Leakage, Street Light, etc.)
- **Location Precision**: Automatic GPS coordinates or manual location picker
- **Media Evidence**: Attach photos or videos as evidence
- **Issue Tracking**: Track the progress of reported issues in real-time
- **Status Updates**: Receive notifications on issue status (Pending, Verified, Approved, Rejected)
- **Issue History**: View all previously reported issues and their resolutions

<div class="glow-box" style="border-left: 4px solid #f59e0b; background: rgba(245, 158, 11, 0.05);">
  <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style="width: 100%; height: 40px; margin: -10px -15px 10px -15px;">
    <defs>
      <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0" />
        <stop offset="50%" style="stop-color:#f59e0b;stop-opacity:0.5" />
        <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0" />
      </linearGradient>
    </defs>
    <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="url(#wave1)" stroke-width="3" fill="none"></path>
  </svg>
</div>

### For Admin (Manual Verification)
- **Report Verification**: Manually verify reported issues as legitimate
- **Approval/Rejection**: Accept verified reports or reject with reasons
- **Issue Board**: Dashboard showing pending, verified, and rejected reports
- **Detailed Analytics**: View statistics on similar issues in the area

<div class="glow-box" style="border-left: 4px solid #8b5cf6; background: rgba(139, 92, 246, 0.05);">
  <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style="width: 100%; height: 40px; margin: -10px -15px 10px -15px;">
    <defs>
      <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0" />
        <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:0.5" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0" />
      </linearGradient>
    </defs>
    <path d="M0,30 Q150,50 300,30 T600,30 T900,30 T1200,30" stroke="url(#wave2)" stroke-width="3" fill="none"></path>
  </svg>
</div>

### For Administration (Municipal Staff)
- **Issue Management**: Assess verified reports and plan resolutions
- **Status Workflow**: Mark issues as approved/rejected or forward to other municipalities
- **Municipality Forwarding**: Send reports to relevant municipal corporation or ward
- **Higher Authority Escalation**: Forward critical issues to state or national authorities
- **Document History**: Complete audit trail of actions taken on each issue

<div class="glow-box" style="border-left: 4px solid #ec4899; background: rgba(236, 72, 153, 0.05); margin-bottom: 20px;">
  <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style="width: 100%; height: 40px; margin: -10px -15px 10px -15px;">
    <defs>
      <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#ec4899;stop-opacity:0" />
        <stop offset="50%" style="stop-color:#ec4899;stop-opacity:0.5" />
        <stop offset="100%" style="stop-color:#ec4899;stop-opacity:0" />
      </linearGradient>
    </defs>
    <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="url(#wave3)" stroke-width="3" fill="none"></path>
  </svg>
</div>

---

## 📱 How to Use

### Step 1: Register & Login
![Step 1](./public/images/step1.jpg)
![Step 2](./public/images/step2.jpg)

Register as a new user by providing your email, creating a password, and verifying your email through OTP.

### Step 2: Verification & Account Setup
![Step 3](./public/images/step3.jpg)
![Step 4](./public/images/step4.jpg)

Verify your email address using the OTP sent to your registered email. Once verified, you can log in to your account.

### Step 3: Login to Dashboard
![Step 5](./public/images/step5.jpg)

Enter your credentials and click the login button to access your personalized dashboard.

### Step 4: Report an Issue
![Step 6](./public/images/step6.jpg)
![Step 7](./public/images/step7.jpg)

Click on the plus icon (floating action button) to start reporting a new issue. First, add media evidence (photos or videos).

### Step 5: Select Category
![Step 8](./public/images/step8.jpg)

Choose the appropriate category for your reported issue from the available options.

### Step 6: Fill Details & Location
![Step 9 - Location](./public/images/location.png)
![Step 9 - Verification](./public/images/verification.png)

Enter your live coordinates or click the location button to fetch your current location. Fill in the description and other required details, then submit.

### Step 7: Track Progress
![Step 10 - Status](./public/images/status.png)

View all your reported issues and track their progress. Click on any issue to see detailed information and status updates.

### Step 8: View Evidence
![Step 11 - Visual Evidence](./public/images/visual_evidence.png)

Click on the image or video to view the full media evidence in high quality.

---

## 🛠️ Tech Stack

<div class="animated-block" style="padding: 25px; margin: 20px 0;">
  <h3 style="margin-top: 0; text-align: center;">⚡ Our Technology Arsenal</h3>
</div>
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### Backend & Database
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

### Tools & Libraries
![Swiper](https://img.shields.io/badge/Swiper-6332F6?style=for-the-badge&logo=swiper&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![React Hot Toast](https://img.shields.io/badge/React_Hot_Toast-EC4899?style=for-the-badge&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jwt&logoColor=white)

### Development & Deployment
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

---

## 📊 Architecture Overview

<div class="glow-box" style="border-left: 5px solid #06b6d4; background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(14, 165, 233, 0.1));">
  <h3 style="margin-top: 0; color: #0891b2;">🏗️ System Design</h3>
</div>

1. **User Portal**
   - Report submission interface
   - Issue tracking dashboard
   - Profile management

2. **Admin Portal**
   - Manual issue verification
   - Approval/rejection workflow
   - Analytics dashboard

3. **Administration Portal**
   - Issue assessment and resolution
   - Municipality forwarding
   - Higher authority escalation
   - Audit trail

4. **Backend API**
   - Authentication & authorization
   - Report CRUD operations
   - Status management
   - File upload handling
   - Geolocation services

5. **Database**
   - User accounts
   - Report records
   - Status history
   - Municipal data
   - Ward information

---

## 🔄 Issue Workflow

<div style="margin: 30px 0;">
  <div class="animated-block" style="text-align: center; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);">
    <h3 style="margin: 0; letter-spacing: 2px;">Citizen Report</h3>
    <p style="margin: 5px 0; font-size: 14px;">↓</p>
  </div>
  
  <div class="animated-block" style="text-align: center; background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);">
    <h3 style="margin: 0; letter-spacing: 2px;">Admin Verification</h3>
    <p style="margin: 5px 0; font-size: 14px;">↓</p>
  </div>
  
  <div class="animated-block" style="text-align: center; background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);">
    <h3 style="margin: 0; letter-spacing: 2px;">Administration Assessment</h3>
    <p style="margin: 5px 0; font-size: 14px;">↓</p>
  </div>
  
  <div class="animated-block" style="text-align: center; background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);">
    <h3 style="margin: 0; letter-spacing: 2px;">Resolution & Tracking</h3>
  </div>
</div>

**Status Definitions:**
- **Pending**: Initial report submitted, awaiting admin verification
- **Verified**: Admin has verified the report as legitimate
- **Approved**: Administration has approved and assigned for resolution
- **Rejected**: Issue deemed invalid or duplicate
- **Forwarded**: Issue sent to another municipality or higher authority
- **Completed**: Issue has been resolved

---

## 🚀 Getting Started

<div class="animated-block" style="background: linear-gradient(-45deg, #e73c7e, #23a6d5, #23d5ab, #ee7752);">
  <h3 style="margin-top: 0; text-align: center; font-size: 20px;">✨ Ready to Make an Impact? ✨</h3>
  <p style="text-align: center; font-size: 14px;">Follow these simple steps to get started</p>
</div>

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git
- npm or yarn

<div class="glow-box" style="border-left: 4px solid #06b6d4; background: rgba(6, 182, 212, 0.05);">
  <strong>💡 Pro Tip:</strong> Make sure you have all prerequisites installed before proceeding!
</div>

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd sih
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file with:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
sih/
├── app/
│   ├── admin/                 # Admin verification portal
│   ├── administration/         # Municipal staff portal
│   ├── user/                  # Citizen portal
│   ├── api/                   # Backend API routes
│   ├── components/            # Shared components
│   ├── login/                 # Authentication pages
│   ├── signup/                # Registration pages
│   └── layout.js              # Root layout
├── lib/
│   ├── api.js                 # API client functions
│   ├── auth.js                # Authentication utilities
│   └── db.js                  # Database connection
├── models/
│   ├── User.js                # User schema
│   ├── Report.js              # Report schema
│   ├── Admin.js               # Admin schema
│   ├── Administrative.js       # Administration staff schema
│   ├── Municipality.js         # Municipality data
│   ├── Ward.js                # Ward information
│   └── otpUser.js             # OTP verification
├── utils/
│   ├── generateOTP.js         # OTP generation
│   ├── idGenerator.js         # ID generation
│   └── image-processing.js    # Image utilities
├── public/
│   └── images/                # App screenshots & assets
└── package.json               # Dependencies & scripts
```

---

## 🔐 Security Features

<div class="glow-box" style="border-left: 5px solid #ef4444; background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));">
  <h3 style="margin-top: 0; color: #dc2626;">🛡️ Protected & Secure</h3>
</div>

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **OTP Verification**: Email-based two-factor verification
- **Role-Based Access Control**: Separate dashboards for users, admins, and administration staff
- **CORS Protection**: Secure cross-origin requests
- **Input Validation**: Server and client-side validation
- **Image Processing**: Safe image upload and storage

---

## 📈 Key Metrics & Statistics

<div class="glow-box" style="border: 2px solid #14b8a6; background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(45, 212, 191, 0.1));">
  <h3 style="margin-top: 0; color: #0d9488;">📊 Track Everything</h3>
</div>

The application tracks:
- Total reports submitted
- Reports verified and approved
- Average resolution time
- Popular issue categories
- Municipal-wise statistics
- Ward-wise issue distribution
- Similar reports in the area

---

## 🎓 Features in Detail

### Image & Video Support
- Support for multiple image formats (JPG, PNG, WebP)
- Video upload capability for documentation
- Panoramic image viewer for enhanced visualization
- Automatic image compression and optimization

### Geolocation Services
- GPS coordinate capture
- Interactive map picker
- Ward and municipality auto-detection
- Address reverse geocoding

### AI-Powered Features
- AI-based issue summarization
- Suggested rejection reasons
- Intelligent duplicate detection
- Automated category suggestions

### Real-time Notifications
- Status update alerts
- Verification notifications
- Approval/rejection alerts
- Toast notifications for user actions

---

## 👥 Development Team

<div class="animated-block" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); text-align: center; padding: 30px;">
  <h3 style="margin-top: 0; margin-bottom: 20px;">🌟 Meet Our Talented Team 🌟</h3>
</div>

Developed by the talented team:

- [**RUPAYAN DEY**](https://github.com/valiantProgrammer) - <span style="color: #3b82f6; font-weight: 600;">Full Stack Developer & Project Head</span>
- [**RISHIKA MUKHERJEE**](https://github.com/bitsByRishika/) - <span style="color: #8b5cf6; font-weight: 600;">Frontend Developer & UI/UX Designer</span>
- [**RITAM PAUL**](https://github.com/ritampaul192/) - <span style="color: #06b6d4; font-weight: 600;">Backend Developer & Database Architect</span>
- [**SOMMIDHYA BISWAS**](https://github.com/Somiddhya09/) - <span style="color: #ec4899; font-weight: 600;">QA Tester & Admin Page Designer & Documentation Specialist</span>

---

## 📞 Support & Contact

<div class="glow-box" style="border-left: 4px solid #f59e0b; background: rgba(245, 158, 11, 0.05); text-align: center;">
  <strong>Have questions or feedback?</strong><br/>
  We'd love to hear from you! Reach out anytime.
</div>

For issues, suggestions, or feedback:
- Create an issue in the repository
- Contact the development team
- Report bugs through the application feedback form

---

## 📜 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- Special thanks to all users who help improve the platform
- Municipal corporations for their partnership
- The open-source community for amazing libraries and tools
- All supporters and contributors

---

## 🔮 Future Roadmap

<div class="glow-box" style="border-left: 5px solid #a855f7; background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(192, 132, 250, 0.1));">
  <h3 style="margin-top: 0; color: #9333ea;">🚀 Exciting Features Coming Soon</h3>
</div>

- [ ] Mobile app (iOS & Android)
- [ ] Advanced analytics dashboards
- [ ] SMS notifications
- [ ] WhatsApp integration
- [ ] Citizen reputation system
- [ ] Gamification features
- [ ] Blockchain-based verification
- [ ] AI chatbot support
- [ ] Multiple language support
- [ ] Progressive web app (PWA) optimization

---

## 📝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div class="animated-block" style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7dd, #f9ca24); text-align: center; padding: 40px; border-radius: 15px;">
  <h2 style="margin: 0; font-size: 24px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">❤️ Made with Love for Better Communities ❤️</h2>
  <p style="margin: 15px 0 0 0; font-size: 16px; opacity: 0.95;">Report • Verify • Resolve • Improve</p>
</div>

---

<div style="text-align: center; margin-top: 20px; opacity: 0.8;">
  <p><em>Created with dedication to civic improvement and community engagement</em></p>
  <p><strong>Last Updated: March 2026</strong></p>
</div>
