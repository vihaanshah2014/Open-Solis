import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const $users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  subscriptionType: text("subscription_type").notNull(),
  mentalStudyScoreCode: integer("mental_study_score_code"),  // Changed to integer to match score calculation
  hobbies: text("hobbies"),
  openAiApiUsage: integer("openai_api_usage"),
  numberOfClasses: integer("number_of_classes"),
  todoList: text("todo_list"),
  stripeCustomerId: text("stripe_customer_id"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  cancellationDate: timestamp("cancellation_date"),

  // New fields based on form data
  studyEnjoyment: integer("study_enjoyment"), // Changed to integer to match score calculation
  procrastinator: text("procrastinator"), // Text to store options like 'Yes', 'No', 'Sometimes'
  socialLearner: integer("social_learner"), // Changed to integer for numerical rating
  thinkingType: integer("thinking_type"), // Changed to integer for numerical rating
  learningType: integer("learning_type"), // Changed to integer for numerical rating
});

export const $courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => $users.id).notNull(), // Foreign key to users table
  courseName: text("course_name").notNull(),
  keyDates: text("key_dates"), // JSON format for key dates
  extractedTopics: text("extracted_topics"), // JSON format
  topicsUnderstoodPercentage: integer("topics_understood_percentage"),
});

export const $notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => $users.id).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  imageUrl: text("image_url"),
  editorState: text("editor_state"),
  className: text("class_name").notNull(),
  understoodPercentage: integer("understood_percentage"),
  topic: text("topic"),
  extractedContent: text("extracted_content"),
  notecards: jsonb("notecards"),
  favorites: jsonb("favorites") // Recently added
});

export type NoteType = typeof $notes.$inferInsert;
