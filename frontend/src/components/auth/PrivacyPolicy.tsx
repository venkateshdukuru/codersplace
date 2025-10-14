// frontend/src/components/auth/PrivacyPolicy.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";
import Footer from "../Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/signup"
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to sign up
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              <strong>Personal Information:</strong> Name, email address, mobile number, college name, branch, roll number, and password.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, security alerts, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Personalize and improve the user experience</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights, property, or safety</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We use cookies and similar tracking technologies to collect and use personal information about you. You can set your browser to refuse all or some browser cookies, but this may affect the functionality of our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Our service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Data Retention
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Your Rights
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
              <li>Access, update, or delete your personal information</li>
              <li>Object to the processing of your personal information</li>
              <li>Request a copy of your personal information</li>
              <li>Withdraw your consent at any time</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. International Data Transfers
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your personal information in accordance with this privacy policy.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              If you have any questions about this Privacy Policy, please contact us at privacy@codersplace.com
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                I Understand - Continue Sign Up
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="outline">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
