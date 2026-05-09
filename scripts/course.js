// Course List Array - Web and Computer Programming Certificate
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: ['C#'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];

// DOM elements
const courseContainer = document.getElementById('course-container');
const creditsDisplay = document.getElementById('credits-total');
const btnAll = document.getElementById('btn-all');
const btnWDD = document.getElementById('btn-wdd');
const btnCSE = document.getElementById('btn-cse');

// Display courses function
function displayCourses(filter = 'all') {
    let filteredCourses;

    if (filter === 'WDD') {
        filteredCourses = courses.filter(course => course.subject === 'WDD');
    } else if (filter === 'CSE') {
        filteredCourses = courses.filter(course => course.subject === 'CSE');
    } else {
        filteredCourses = courses;
    }

    // Clear the container
    courseContainer.innerHTML = '';

    // Create course cards
    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.classList.add('course-card');
        if (course.completed) {
            card.classList.add('completed');
        }
        card.textContent = `${course.subject} ${course.number}`;
        card.setAttribute('title', `${course.title} - Credits: ${course.credits}${course.completed ? ' ✓ Completed' : ''}`);
        courseContainer.appendChild(card);
    });

    // Calculate and display total credits using reduce
    const totalCredits = filteredCourses.reduce((total, course) => total + course.credits, 0);
    creditsDisplay.textContent = `Total Credits: ${totalCredits}`;
}

// Update active button state
function setActiveButton(activeBtn) {
    [btnAll, btnWDD, btnCSE].forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Event listeners for filter buttons
btnAll.addEventListener('click', () => {
    displayCourses('all');
    setActiveButton(btnAll);
});

btnWDD.addEventListener('click', () => {
    displayCourses('WDD');
    setActiveButton(btnWDD);
});

btnCSE.addEventListener('click', () => {
    displayCourses('CSE');
    setActiveButton(btnCSE);
});

// Initial display
displayCourses('all');
setActiveButton(btnAll);
