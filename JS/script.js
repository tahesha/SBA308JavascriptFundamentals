// Sample data
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};

const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];
// Function to process learner data and calculate average scores
function getLearnerData(course, ag, submissions) {
    const result = [];
    
    // Data Validation: Check if AssignmentGroup belongs to provided CourseInfo
    if (ag.course_id !== course.id) {
        throw new Error("Invalid input: AssignmentGroup does not belong to the provided CourseInfo.");
    }
    
    // Processing Data: Iterate over submissions to calculate scores
    submissions.forEach(submission => {
        const learnerIndex = result.findIndex(item => item.id === submission.learner_id);
        const assignment = ag.assignments.find(assign => assign.id === submission.assignment_id);
        
        if (!assignment) {
            throw new Error(`Invalid input: Submission for non-existent assignment with ID ${submission.assignment_id}.`);
        }
        
        let latePenalty = 0;
        const dueDate = new Date(assignment.due_at);
        const submittedDate = new Date(submission.submission.submitted_at);
        const isLate = submittedDate > dueDate;
        
        // Deduct late penalty if submission is late
        if (isLate) {
            latePenalty = 0.1 * assignment.points_possible;
            if (latePenalty > assignment.points_possible) {
                latePenalty = assignment.points_possible; // Cap penalty to assignment max points
            }
        }
        
        // Calculate adjusted score and percentage score
        const adjustedScore = submission.submission.score - latePenalty;
        const percentageScore = adjustedScore / assignment.points_possible;
        
        // Update result array with learner data
        if (learnerIndex === -1) {
            result.push({
                id: submission.learner_id,
                totalPoints: assignment.points_possible,
                weightedPoints: adjustedScore * ag.group_weight / 100,
                assignments: {
                    [submission.assignment_id]: percentageScore
                }
            });
        } else {
            const learner = result[learnerIndex];
            learner.totalPoints += assignment.points_possible;
            learner.weightedPoints += adjustedScore * ag.group_weight / 100;
            learner.assignments[submission.assignment_id] = percentageScore;
        }
    });
    
    // Calculate averages for each learner
    result.forEach(learner => {
        learner.avg = learner.weightedPoints / learner.totalPoints;
        delete learner.totalPoints;
        delete learner.weightedPoints;
    });
    
    return result;
}

// Function to retrieve learner information by ID
function getLearnerInfoById(course, ag, submissions, learnerId) {
    const result = getLearnerData(course, ag, submissions);
    
    // Find learner information by ID
    const learnerInfo = result.find(learner => learner.id === learnerId);
    if (!learnerInfo) {
        throw new Error(`Learner with ID ${learnerId} not found.`);
    }
    
    return learnerInfo;
}

// JavaScript code to handle form submission and display learner information
function showLearnerInfo() {
    // Get learner ID input value
    const learnerId = document.getElementById("learnerIdInput").value;

    try {
        // Retrieve learner information by ID
        const learnerInfo = getLearnerInfoById(CourseInfo, AssignmentGroup, LearnerSubmissions, parseInt(learnerId));

        // Display learner information
        const learnerInfoDiv = document.getElementById("learnerInfo");
        learnerInfoDiv.innerHTML = `
            <h2>Learner Information</h2>
            <p><strong>ID:</strong> ${learnerInfo.id}</p>
            <p><strong>Average Score:</strong> ${learnerInfo.avg.toFixed(2)}</p>
            <p><strong>Assignment Scores:</strong></p>
            <ul>
                ${Object.keys(learnerInfo.assignments).map(assignmentId => `
                    <li>Assignment ${assignmentId}: ${learnerInfo.assignments[assignmentId].toFixed(2)}</li>
                `).join('')}
            </ul>
        `;
    } catch (error) {
        // Display error message if learner ID not found
        const learnerInfoDiv = document.getElementById("learnerInfo");
        learnerInfoDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Add an event listener to the button to call the showLearnerInfo function when clicked
document.getElementById("submitBtn").addEventListener("click", showLearnerInfo);



// Test the function with provided sample data
const learnerId = 125; // Example learner ID
const learnerInfo = getLearnerInfoById(CourseInfo, AssignmentGroup, LearnerSubmissions, learnerId);
console.log(learnerInfo);