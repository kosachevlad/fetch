document.addEventListener("DOMContentLoaded", () => {

    let initializingFirebase = () => {
        const config = {
            apiKey: "AIzaSyAXNE7iDnkAnTZ0KjGFmp6l908TZh47x80",
            authDomain: "new-project-si.firebaseapp.com",
            databaseURL: "https://new-project-si.firebaseio.com",
            projectId: "new-project-si",
            storageBucket: "new-project-si.appspot.com",
            messagingSenderId: "999836579478"
        };
    
        firebase.initializeApp(config);
    }
    initializingFirebase();

    const database = firebase.database(),
        form = document.getElementById("form"),
        inputTaskName = document.querySelectorAll(".name_input")[0],
        tasksList = document.querySelector('.scores_list'),
        referingToDataBase = database.ref('tasks'),
        clearDataBtn = document.getElementById('clearBtn'),
        tasksData = {};
    

    inputTaskName.addEventListener('keyup', () => {
        tasksData.name = inputTaskName.value
    });

    let pushData = el => {
        el.addEventListener('submit', e => {
            e.preventDefault();
            if (inputTaskName.value) {
                inputTaskName.classList.remove('has_error');

                referingToDataBase.push(tasksData);
                inputTaskName.value = '';
            } else {
                inputTaskName.classList.add('has_error');
            }
        })
    }
    pushData(form);

    // remove all data
    clearDataBtn.addEventListener('click', () => {
        referingToDataBase.remove()
    })

    let gotData = (tasksData) => {
        tasksList.textContent = '';
        
        const taskDataList = tasksData.val();
        if(taskDataList) {
            let keysOfTaskDataList = Object.keys(taskDataList);
            for (let i = 0; i < keysOfTaskDataList.length; i++) {
            
                let keyIndex = keysOfTaskDataList[i],
                    taskName = taskDataList[keyIndex].name,
                    taskItem = document.createElement('li'),
                    taskBlock = document.createElement('div'),
                    label = document.createElement('label'),
                    deleteItem = document.createElement('div');
                    deleteItem.classList.add('delete_item');
                    deleteItem.textContent = 'x';

                label.textContent = taskName;

                tasksList.appendChild(taskItem);
                taskItem.appendChild(taskBlock);
                taskBlock.appendChild(label);
                taskItem.classList.add('score_item');
                taskItem.setAttribute('data-id', keyIndex);
                taskBlock.appendChild(deleteItem);

                // deleting items
                deleteItem.addEventListener('click', event => {
                    let taskId = event.target.parentElement.parentElement.getAttribute('data-id');
                    referingToDataBase.child(taskId).remove()
                })

                // editing items
                taskItem.addEventListener('dblclick', parentEvent => {
                    let taskId = parentEvent.target.parentElement.parentElement.getAttribute('data-id'),
                        currentTaskItem = parentEvent.target.parentElement.parentElement,
                        taskEdit = document.createElement('input');

                    taskEdit.classList.add('change_item');
                    taskEdit.setAttribute('autofocus', 'true');
                    taskEdit.value = parentEvent.target.textContent;
                    parentEvent.target.parentElement.style.display = 'none';
                    currentTaskItem.appendChild(taskEdit);
                    
                    taskEdit.addEventListener('keydown', childEvent => {
                        if(childEvent.key === 'Enter') {
                            childEvent.preventDefault();
                            parentEvent.target.parentElement.style.display = 'block';
                            childEvent.target.remove();

                            referingToDataBase.child(taskId).set({
                                name: childEvent.target.value
                            }, error => {
                                if (error) {
                                    console.log('error')
                                } else {
                                    console.log('data saved')
                                }
                            })
                        }
                    })
                    document.addEventListener('click', childEvent => {
                        
                        if(childEvent.target !== taskEdit || !childEvent.target.contains(taskEdit)) {
                            parentEvent.target.parentElement.style.display = 'block';
                            taskEdit.style.display = 'none';
                            parentEvent.target.textContent = taskEdit.value;
                            
                            referingToDataBase.child(taskId).set({
                                name: taskEdit.value
                            }, function(error) {
                                if (error) {
                                    console.log('error')
                                } else {
                                    console.log('data saved')
                                }
                            })
                        }
                    })
                });
            };
        }
    }

    let errorData = (err) => {
        console.log('Error!');
        console.log(err);
    }

    referingToDataBase.on('value', gotData, errorData);

})