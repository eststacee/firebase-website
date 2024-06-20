// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAIYIpYOW-ZM-V7kDwBPCHvms5gvVxcEQQ",
    authDomain: "task-management-app-531fc.firebaseapp.com",
    projectId: "task-management-app-531fc",
    storageBucket: "task-management-app-531fc.appspot.com",
    messagingSenderId: "706144974549",
    appId: "1:706144974549:web:0deb88d08bd178bf81145c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Select elements
const form = document.getElementById('task-form');
const taskInput = document.getElementById('task');
const taskList = document.querySelector('.taskList');

// Function to render tasks
function renderTask(doc) {
    let li = document.createElement('li');
    li.textContent = doc.data().task;
    li.setAttribute('data-id', doc.id);
    taskList.appendChild(li);

    li.addEventListener('click', (e) => {
        let id = e.target.getAttribute('data-id');
        db.collection('tasks').doc(id).delete();
    });
}

// Save task to Firestore
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('tasks').add({
        task: taskInput.value
    });
    taskInput.value = '';
});

// Real-time listener for Firestore
db.collection('tasks').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == 'added') {
            renderTask(change.doc);
        } else if (change.type == 'removed') {
            let li = taskList.querySelector(`[data-id="${change.doc.id}"]`);
            taskList.removeChild(li);
        }
    });
});
