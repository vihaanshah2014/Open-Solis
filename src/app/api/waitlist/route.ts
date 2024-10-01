import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_WAITLIST_API_KEY,
  authDomain: "solis-waitlist.firebaseapp.com",
  projectId: "solis-waitlist",
  storageBucket: "solis-waitlist.appspot.com",
  messagingSenderId: "345128742964",
  appId: "1:345128742964:web:5c4f40b0f404f5ddb9da61",
  measurementId: "G-TMPQF2B6JJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  let logs = [];
  
  logs.push('Starting POST request processing');
  
  let requestData;
  try {
    requestData = await req.json();
    logs.push('Request JSON parsed:', requestData);
  } catch (error) {
    logs.push('Error parsing JSON:', error);
    return NextResponse.json({ success: false, error: 'Invalid JSON', logs }, { status: 400 });
  }

  const { email, name, school, grade, reason } = requestData;

  logs.push('Received data:', { email, name, school, grade, reason });

  if (!email || !name || !school || !grade || !reason) {
    logs.push('Missing fields:', { email, name, school, grade, reason });
    return NextResponse.json({ success: false, error: 'All fields must be filled', logs }, { status: 400 });
  }

  // Save user to waitlist in Firestore
  try {
    logs.push('Attempting to add document to Firestore');
    const docRef = await addDoc(collection(db, "waitlist"), {
      email,
      name,
      school,
      grade,
      reason,
      timestamp: new Date(),
    });
    logs.push("Document written with ID: ", docRef.id);

    // Send confirmation email
    logs.push('Configuring nodemailer transport');
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "You're on the Solis waitlist",
      html: `
        <p>Hi ${name},</p>
        <p><strong>Thank you for joining the waitlist.</strong><br></p>
        <p>We invite new members on a first come first serve basis – you'll get an email from us the moment your spot becomes available.</p>
        <p>We’re on a mission to help you learn efficiently and effectively using AI to then spend more time doing things you enjoy.</p>
        <p>As a Solis member, you'll get the most complete picture of your education you’ve ever had.</p>
        <p>We’re proud to exist for people who want more and look forward to welcoming you soon.</p>
        <p>Here’s to learning,<br>
        Team Solis</strong></p>
      `,
    };

    let emailSent = false;

    try {
      logs.push('Attempting to send confirmation email');
      await transporter.sendMail(mailOptions);
      logs.push("Email Sent");
      emailSent = true;
    } catch (error) {
      logs.push("Error sending email:", error);
    }

    // Update the document with email sent status
    try {
      logs.push('Updating document with email sent status');
      await updateDoc(doc(db, "waitlist", docRef.id), {
        emailSent
      });
      logs.push("Document updated with email sent status");
    } catch (error) {
      logs.push("Error updating document:", error);
    }

    return NextResponse.json({ success: true, emailSent, logs });
  } catch (e) {
    logs.push("Error adding document:", e);
    return NextResponse.json({ success: false, error: e.message, logs }, { status: 500 });
  }
}
