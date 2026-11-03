import "./loadEnvironment.mjs";
import mongoose from "mongoose";
import { connectDB } from "./db/connect.mjs";
import Course from "./models/Course.mjs";
import Module from "./models/Module.mjs";

const course = {
    code : "AU957",
    name: "BSc (Hons) Software Development",
    department: "Computing",
    campus: "Sligo",
};
// [name, year, semester, credits, realCode?]
const modules = [
// Year 1
  ["Personal Development", 1, 1, 5, "COMM06050"],
  ["Computer Systems", 1, 1, 5, "COMP06267"],
  ["Introduction to Programming 1", 1, 1, 10, "COMP06235"],
  ["Design Thinking", 1, 1, 5, "COMP06217"],
  ["Mathematics 1", 1, 1, 5, "MATH06089"],
  ["Internet of Things", 1, 2, 5, "COMP06208"],
  ["Operating Systems and Networks", 1, 2, 5, "COMP06256"],
  ["Introduction to Programming 2", 1, 2, 10, "COMP06236"],
  ["Mathematics 2", 1, 2, 5, "MATH06090"],
  ["Web Design Fundamentals", 1, 2, 5, "COMP06294"],
  // Year 2
  ["Client Side Scripting", 2, 1, 5, "COMP06243"],
  ["Object Oriented Programming", 2, 1, 5, "COMP06240"],
  ["Web Design and Development", 2, 1, 5, "COMP06265"],
  ["Software Engineering 1 Analysis", 2, 1, 5, "COMP06174"],
  ["Introduction to Database Technology", 2, 1, 5, "COMP06254"],
  ["Mathematics 3", 2, 1, 5, "MATH06091"],
  ["Object Oriented Development", 2, 2, 5, "COMP06241"],
  ["Web Programming 1", 2, 2, 5, "COMP06263"],
  ["Software Quality and Testing", 2, 2, 5, "COMP06242"],
  ["Introduction to Database Management", 2, 2, 5, "COMP06257"],
  ["Mathematics 4", 2, 2, 5, "MATH06092"],
  ["Introduction to Cloud Computing", 2, 2, 5, "COMP06274"],
  // Year 3
  ["Rich Application Development 301", 3, 1, 5, "COMP07105"],
  ["Mobile Application Development", 3, 1, 5, "COMP07170"],
  ["Software Project Management", 3, 1, 5, "COMP07166"],
  ["Professional Development", 3, 1, 5, "CRR07008"],
  ["Web Programming 2", 3, 1, 5, "COMP07180"],
  ["Open Stack Development", 3, 2, 5, "COMP07172"],
  ["Rich Application Development 302", 3, 2, 5, "COMP07106"],
  ["Database Programming", 3, 2, 5, "COMP07176"],
  ["Project 300", 3, 2, 10, "COMP07147"],
  ["Work Experience", 3, 2, 10, "COMP07128"],
  // Year 4 (placeholder codes until real ones are known)
  ["Strategic Technology Management", 4, 1, 5, "TBC-401"],
  ["Artificial Intelligence", 4, 1, 5, "TBC-402"],
  ["Startup Engineering", 4, 1, 5, "TBC-403"],
  ["Data Analytics", 4, 1, 5, "TBC-404"],
  ["Secure Software Development", 4, 1, 5, "TBC-405"],
  ["Machine Learning", 4, 2, 5, "TBC-406"],
  ["User Experience (UX)", 4, 2, 5, "TBC-407"],
  ["Advanced Programming", 4, 2, 5, "TBC-408"],
  ["Software Application Security Testing", 4, 2, 5, "TBC-409"],
  ["Advanced Database Concepts", 4, 2, 5, "TBC-410"],
];

try {
  await connectDB();

  // Create the course, or update it if it already exists
  const savedCourse = await Course.findOneAndUpdate(
    { code: course.code },
    course,
    { upsert: true, new: true, runValidators: true }
  );

  // Create or update each module and link it to the course
  const ops = modules.map(([name, year, semester, credits, code]) => ({
    updateOne: {
      filter: { name, year, semester },
      update: {
        $set: { code, name, year, semester, credits },
        $addToSet: { courseIds: savedCourse._id },
      },
      upsert: true,
    },
  }));

  const result = await Module.bulkWrite(ops);
  await Promise.all([Course.syncIndexes(), Module.syncIndexes()]);

  console.log(`Course: ${savedCourse.name}`);
  console.log(`Modules: ${result.upsertedCount} created, ${result.modifiedCount} updated`);
} catch (err) {
  console.error("Seeding failed:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}