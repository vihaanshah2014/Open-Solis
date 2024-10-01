import React from 'react';
import Header from '@/components/home_page/Header';
import Footer from '@/components/home_page/Footer';

const Privacy = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-transducer">
      <Header />
      <div className="container mx-auto py-12 px-4">
        {/* <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1> */}
        <div className="p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Google Calendar Data Access and Usage</h2>
          <p className="text-gray-700 mb-6">
            Our application integrates with Google Calendar through the Google API to provide you with a personalized and efficient scheduling experience. By connecting your Google Calendar account, you grant our application permission to access your calendar data. This data is used solely for the purpose of displaying your upcoming exams and events in a visually appealing and color-coded manner within your personal dashboard. We do not share or disclose your calendar data to any third parties or use it for any other purposes beyond providing the core functionality of our application.
          </p>
          <p className="text-gray-700 mb-6">
            We understand the sensitivity of your calendar information and are committed to handling it with the utmost care and confidentiality. Our application adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Google API Services User Data Policy</a>, which ensures that we only request and access the minimum amount of data necessary to provide the intended functionality. We do not store or retain any of your calendar data on our servers beyond the duration of your active session. Once you log out or close the application, all calendar data is securely erased from our systems.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Data Storage and Security</h2>
          <p className="text-gray-700 mb-6">
            We understand the importance of protecting your personal information. When you connect your Google Calendar account to our application, we securely store the necessary authentication tokens to maintain the connection and retrieve your calendar data. These tokens are encrypted and stored on secure servers with restricted access. We adhere to <a href="https://cloud.google.com/security/best-practices" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">industry best practices</a> and implement robust security measures to safeguard your data from unauthorized access, alteration, or disclosure. Your calendar data is only accessible to you within your personal dashboard after you have successfully authenticated and granted consent.
          </p>
          <p className="text-gray-700 mb-6">
            Our application undergoes regular security audits and vulnerability assessments to identify and address any potential risks. We employ encryption technologies to protect data transmission between your device and our servers, ensuring that your information remains confidential. Additionally, we limit access to your data within our organization, granting permissions only to authorized personnel who require it to perform their duties and provide support.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Artificial Intelligence and OpenAI API</h2>
          <p className="text-gray-700 mb-6">
            In addition to the calendar integration, our application utilizes artificial intelligence (AI) to enhance certain features and provide intelligent recommendations. We leverage the <a href="https://openai.com/policies/api-data-usage-policy" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">OpenAI GPT</a> to power these AI capabilities. The data shared with these models includes user-inputted data such as notes typed within the app. This data is used to create quizzes and other learning materials to help users.
          </p>
          <p className="text-gray-700 mb-6">
            The AI models process this data solely for the intended purpose of enhancing user experience by providing tailored learning materials. The impact of these models is subjective and depends on the content provided by users in their notes. Users have the option to control or opt out of data sharing with AI models by not accessing the related features.
          </p>
          <p className="text-gray-700 mb-6">
            We ensure responsible and ethical use of data by adhering to strict guidelines and policies that align with our commitment to user privacy and data protection.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Explicit User Consent</h2>
          <p className="text-gray-700 mb-6">
            Users are explicitly informed about the use of AI models and the potential data sharing involved before using these features. The app obtains explicit consent from users through a clear opt-in checkbox accompanied by a detailed explanation. This consent is obtained during the initial setup and is a part of the terms and services agreement.
          </p>

          <h2 className="text-2xl font-bold mb-4">User-Provided Data</h2>
          <p className="text-gray-700 mb-6">
            Our application allows you to input various types of data, such as notes, study goals, and preferences, to personalize your experience and track your progress. Any data you choose to provide is stored securely on your device and is not shared with or accessible to any third parties, including the OpenAI API, unless explicitly stated and consented to by you. You have full control over your user-provided data and can modify, delete, or export it at any time through the application's settings.
          </p>
          <p className="text-gray-700 mb-6">
            We value your privacy and take appropriate measures to protect your user-provided data. This includes implementing secure storage mechanisms, encrypting data at rest, and regularly backing up your information to prevent accidental loss. However, please note that no method of data storage or transmission over the internet can be guaranteed to be 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Compliance with Privacy Regulations</h2>
          <p className="text-gray-700 mb-6">
            We are committed to complying with applicable privacy laws and regulations, including the <a href="https://gdpr-info.eu/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">General Data Protection Regulation (GDPR)</a> and the <a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">California Consumer Privacy Act (CCPA)</a>. Our privacy practices are designed to align with these regulations, ensuring transparency, data protection, and user rights. We provide you with the necessary tools and options to exercise your privacy rights, such as accessing, rectifying, or deleting your personal data.
          </p>
          <p className="text-gray-700 mb-6">
            If you are a resident of the European Economic Area (EEA), you have certain rights under the GDPR, such as the right to request access to your personal data, the right to rectification, the right to erasure, and the right to data portability. If you are a California resident, you have similar rights under the CCPA. To exercise these rights or for any privacy-related inquiries, please contact us using the information provided at the end of this privacy policy.
          </p>

          <h2 className="text-2xl font-bold mb-4">User Consent and Control</h2>
          <p className="text-gray-700 mb-6">
            We believe in empowering you with control over your data. During the Google Calendar integration process, you will be presented with an OAuth consent screen that clearly outlines the specific permissions our application requires and how your calendar data will be used. You have the freedom to review and grant or deny these permissions. Additionally, you can revoke access to your Google Calendar data at any time through your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Google account settings</a>. We respect your right to privacy and provide you with the necessary tools to manage your data sharing preferences.
          </p>
          <p className="text-gray-700 mb-6">
            Furthermore, our application provides intuitive privacy controls and settings that allow you to customize your data sharing preferences. You can choose which features to enable, what data to provide, and how your information is used within the application. We strive to make these controls easily accessible and understandable, empowering you to make informed decisions about your privacy.
          </p>

          <h2 className="text-2xl font-bold mb-4">Data Retention and Deletion</h2>
          <p className="text-gray-700 mb-6">
            We retain your Google Calendar data only for as long as necessary to provide the core functionality of our application. If you choose to disconnect your Google Calendar account or revoke access permissions, we will promptly delete any stored authentication tokens and cease accessing your calendar data. We do not retain any copies of your calendar data after the integration is terminated.
          </p>
          <p className="text-gray-700 mb-6">
            For user-provided data, you have the ability to modify or delete your information within the application settings at any time. We retain your user-provided data until you choose to delete it or request account termination. In the event of account termination, we will securely erase all associated data from our systems within a reasonable timeframe, as specified in our data retention policy.
          </p>

          <h2 className="text-2xl font-bold mb-4">Third-Party Links and Services</h2>
          <p className="text-gray-700 mb-6">
            Our application may contain links to third-party websites or services that are not operated by us. We have no control over the content, privacy policies, or practices of these third-party sites. We encourage you to review the privacy policies of any third-party services before engaging with them. We are not responsible for the privacy practices or content of such third-party sites and services.
          </p>

          <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
          <p className="text-gray-700 mb-6">
            Our application is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information from our systems. If you believe that a child under 13 may have provided personal information to us, please contact us using the information provided at the end of this privacy policy.
          </p>

          <h2 className="text-2xl font-bold mb-4">Changes to the Privacy Policy</h2>
          <p className="text-gray-700 mb-6">
            We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. Any modifications will be effective immediately upon posting the revised policy within the application. We encourage you to review this policy periodically to stay informed about how we protect your privacy. Your continued use of the application after any changes constitutes your acceptance of the updated policy.
          </p>

          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions, concerns, or requests regarding this privacy policy or our data practices, please contact us at:
          </p>
          <ul className="list-disc list-inside mb-6">
            <li>Email: <a href="mailto:privacy@solis.eco" className="text-blue-500 underline">privacy@solis.eco</a></li>
            <li>Postal Address: 5 Penn Plaza, New York, NY 10001</li>
          </ul>
          <p className="text-gray-700">
            We are committed to addressing your inquiries in a timely and satisfactory manner. Your privacy and trust are of utmost importance to us, and we appreciate your feedback and cooperation in helping us maintain the highest standards of data protection.
          </p>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Privacy;