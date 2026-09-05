const navButton = document.querySelector("#ham-btn");
const navlinks = document.querySelector("#nav-bar");

navButton.addEventListener("click", () => {
  navButton.classList.toggle("show");
  navlinks.classList.toggle("show");
});

// COURSE DATA
const courses = [
  /* Course 1 */
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to Programming",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, arrays, and input/output) and use them to solve problems.",
    technology: ["Python"],
    completed: true,
  },

  /* Course 2 */
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course introduces students to the World Wide Web and to careers in website design and development.",
    technology: ["HTML", "CSS"],
    completed: true,
  },

  /* Course 3 */
  {
    subject: "CSE",
    number: 111,
    title: "Programming with Functions",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "Students learn to research and call functions written by others and to write, debug, and test their own functions.",
    technology: ["Python"],
    completed: true,
  },

  /* Course 4 */
  {
    subject: "CSE",
    number: 210,
    title: "Programming with Classes",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course introduces classes and objects and presents encapsulation, inheritance, and polymorphism.",
    technology: ["C#"],
    completed: true,
  },

  /* Course 5 */
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience in Web Fundamentals and programming. Students learn to create dynamic websites using JavaScript.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: true,
  },

  /* Course 6 */
  {
    subject: "WDD",
    number: 231,
    title: "Frontend Web Development I",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course focuses on user experience, accessibility, compliance, performance optimization, and basic API usage.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: false,
  },
];

// HTML ELEMENT
const courseContainer = document.querySelector("#course-container");

const creditTotal = document.querySelector("#credit-total");

const allButton = document.querySelector("#all-btn");

const wddButton = document.querySelector("#wdd-btn");

const csebutton = document.querySelector("#cse-btn");

// DISPLAY COURSE
function displayCourses(courseList) {
  courseContainer.innerHTML = "";
  courseList.forEach((course) => {
    const courseCard = document.createElement("article");

    courseCard.classList.add("course-card");

    if (course.completed) {
      courseCard.classList.add("completed");
    }
    const courseTitle = document.createElement("h3");

    courseTitle.textContent = `${course.subject} ${course.number}`;

    courseCard.appendChild(courseTitle);

    const courseName = document.createElement("p");

    courseName.textContent = course.title;

    courseCard.appendChild(courseName);

    if (course.completed) {
      const completedText = document.createElement("p");
      completedText.classList.add("completed-label");

      completedText.textContent = "✔ Completed";

      courseCard.appendChild(completedText);
    }

    courseContainer.appendChild(courseCard);
  });

  const totalCredits = courseList.reduce(
    (total, course) => total + course.credits,
    0,
  );

  creditTotal.textContent = `The total credits for courses listed above is ${totalCredits}.`;
}

function setActiveButton(activeButton) {
  allButton.classList.remove("active");
  wddButton.classList.remove("active");
  cseButton.classList.remove("active");

  activeButton.classList.add("active");
}

allButton.addEventListener("click", () => {
  displayCourses(courses);
  setActiveButton(allButton);
});

wddButton.addEventListener("click", () => {
  const wddCourses = courses.filter((courses) => course.subject === "WDD");
  displayCourses(wddCourses);
  setActiveButton(wddButton);
});

cseButton.addEventListener("click", () => {
  const cseCourses = courses.filter((course) => course.subject === "CSE");

  displayCourses(cseCourses);

  setActiveButton(cseButton);
});

// COPYTIGHT YEAR

const currentYear = new Date().getFullYear();

const yearElement = document.querySelector("#currentyear");

yearElement.textContent = currentYear;

// LAST MODIFIED DATE
const modifiedElement = document.querySelector("#lastModified");
modifiedElement.textContent = document.lastModified;

displayCourses(courses);
