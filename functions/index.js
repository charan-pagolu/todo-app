const { onSchedule } = require("firebase-functions/v2/scheduler");
const functions = require("firebase-functions");

const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// 🚨 Replace with your Gmail + App Password (for security, store in env variables later)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "pagolucharan21@gmail.com",      // replace with your Gmail
    pass: "knmy wfpc vjnt leiw",         // use an App Password from your Gmail account
  },
});

exports.sendTaskReminders = onSchedule(
    {
      schedule: "every 60 minutes",
      timeZone: "America/New_York",
    },
    async (event) => {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  
      const snapshot = await db.collection("tasks")
        .where("dueDate", ">=", admin.firestore.Timestamp.fromDate(now))
        .where("dueDate", "<=", admin.firestore.Timestamp.fromDate(oneHourFromNow))
        .where("completed", "==", false)
        .get();
  
      snapshot.forEach(async (doc) => {
        const task = doc.data();
  
        await transporter.sendMail({
          from: '"Todo App" <pagolucharan21@gmail.com>',
          to: "pagolucharan21@gmail.com",
          subject: `Reminder: ${task.task}`,
          text: `Don't forget: "${task.task}" is due at ${task.dueDate.toDate().toLocaleString()}`,
        });
  
        console.log(`Reminder sent for: ${task.task}`);
      });
  
      return null;
    }
  );