document.addEventListener("DOMContentLoaded", () => {

    function initializingFirebase() {
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

    let database = firebase.database(),
        form = document.getElementById("form"),
        inputName = document.querySelectorAll(".name_input")[0],
        scoreList = document.querySelector('.scores_list'),
        ref = database.ref('scores'),
        clearDataBtn = document.getElementById('clearBtn'),
        data = {};
    pushData(form);

    inputName.addEventListener('keyup', function(){
        data.name = inputName.value
    });

    function pushData(el){
        el.addEventListener('submit', function(e){
            e.preventDefault();
            if (inputName.value) {
                inputName.classList.remove('has_error');

                ref.push(data);
                inputName.value = '';
            } else {
                inputName.classList.add('has_error');
            }
            
        })
    }

    // remove all data
    clearDataBtn.addEventListener('click', function(){
        ref.remove()
    })

    ref.on('value', gotData, errData);
    
    function gotData(data) {
        scoreList.textContent = '';
        
        let scores = data.val();

        if(scores) {
            let keys = Object.keys(scores);
            for (let i = 0; i < keys.length; i++) {
                let k = keys[i],
                    name = scores[k].name,
                    li = document.createElement('li'),
                    div = document.createElement('div'),
                    label = document.createElement('label'),
                    cross = document.createElement('div');
                    cross.classList.add('delete_item');
                    cross.textContent = 'x';

                label.textContent = name;

                scoreList.appendChild(li);
                li.appendChild(div);
                div.appendChild(label);
                li.classList.add('score_item');
                li.setAttribute('data-id', keys[i]);
                div.appendChild(cross);

                // deleting items
                cross.addEventListener('click', (e) => {
                    let id = e.target.parentElement.parentElement.getAttribute('data-id');
                    ref.child(id).remove()
                })

                li.addEventListener('dblclick', function(e) {


                    let id = e.target.parentElement.parentElement.getAttribute('data-id'),
                        listItem = e.target.parentElement.parentElement;

                    let inputLi = document.createElement('input');
                    inputLi.classList.add('change_item');
                    inputLi.setAttribute('autofocus', 'true');
                    inputLi.value = e.target.textContent;
                    e.target.parentElement.style.display = 'none';
                    listItem.appendChild(inputLi);
                    
                    inputLi.addEventListener('keydown', function(event){
                        if(event.key === 'Enter') {
                            event.preventDefault();
                            e.target.parentElement.style.display = 'block';
                            event.target.remove();
                            ref.child(id).set({
                                name: event.target.value
                            }, function(error) {
                                if (error) {
                                    console.log('error')
                                } else {
                                    console.log('data saved')
                                }
                            })
                        }
                    })
                    document.addEventListener('click', function(ev) {
                        // console.log(ev.target.contains(inputLi));
                        if(ev.target !== inputLi || !ev.target.contains(inputLi)) {
                            e.target.parentElement.style.display = 'block';
                            inputLi.style.display = 'none';
                            e.target.textContent = inputLi.value;
                            ref.child(id).set({
                                name: inputLi.value
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

    function toggleInput(event, e, id, cross){
        event.preventDefault();
        e.target.style.display = 'block';
        e.target.textContent = event.target.value;
        e.target.appendChild(cross);
        event.target.remove();
        ref.child(id).set({
            name: event.target.value
        }, function(error) {
            if (error) {
                console.log('error')
            } else {
                console.log('data saved')
            }
        })
    }

    function errData(err) {
        console.log('Error!');
        console.log(err);
    }
})