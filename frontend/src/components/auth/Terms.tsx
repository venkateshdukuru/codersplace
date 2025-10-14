// frontend/src/components/auth/Terms.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";
import Footer from "../Footer";

const Terms = () => {
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
              Terms & Conditions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              By accessing and using CodersPlace, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Use License
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Permission is granted to temporarily download one copy of the materials on CodersPlace for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              3. User Accounts
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Prohibited Uses
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              You may not use our service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Content
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the service, including its legality, reliability, and appropriateness.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Disclaimer
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms relating to our website and the use of this website.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Governing Law
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              These Terms shall be interpreted and governed by the laws of India, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Changes
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              11. Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              If you have any questions about these Terms and Conditions, please contact us at support@codersplace.com
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                I Agree - Continue Sign Up
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

export default Terms;
