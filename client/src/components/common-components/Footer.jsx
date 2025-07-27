import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Column 1: Get Started */}
        <div>
          <h4 className="font-semibold mb-3">Get Started</h4>
          <ul className="space-y-2">
            <li>Resume</li>
            <li>Create Resume</li>
            <li>Pricing</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Cookie Preferences</li>
          </ul>
        </div>

        {/* Column 2: Resume Tools */}
        <div>
          <h4 className="font-semibold mb-3">Resume Tools</h4>
          <ul className="space-y-2">
            <li>Resume Builder</li>
            <li>Resume Summary Generator</li>
            <li>LinkedIn Resume Builder</li>
            <li>Resume Checker</li>
            <li>AI Resume Review</li>
            <li>Resume Examples</li>
            <li>Resume Templates</li>
            <li>Resume Formats</li>
            <li>Resume Skills</li>
            <li>Modern Templates</li>
            <li>Simple Templates</li>
          </ul>
        </div>

        {/* Column 3: Cover Letter Tools */}
        <div>
          <h4 className="font-semibold mb-3">Cover Letters</h4>
          <ul className="space-y-2">
            <li>Cover Letter Builder</li>
            <li>Cover Letter Generator</li>
            <li>Cover Letter Examples</li>
            <li>Cover Letter Templates</li>
            <li>Cover Letter Formats</li>
            <li>How to Write a Cover Letter</li>
          </ul>
        </div>

        {/* Column 4: Resources & Company */}
        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2">
            <li>Blog</li>
            <li>Resume Guides</li>
            <li>Cover Letter Guides</li>
            <li>Job Interview Guides</li>
            <li>Interview Questions</li>
            <li>Career Resources</li>
            <li>About Us</li>
            <li>Careers</li>
            <li>Reviews</li>
            <li>Contact: <a href="mailto:support@yourdomain.com" className="underline">support@yourdomain.com</a></li>
            <li>Help</li>
            <li>Languages: English (UK), French (FR)</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-gray-400 text-xs">
        © 2025 ProfileFit. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
