function createElemWithText(elementType = "p", newTextContent = "", className = ""){
    //Create new HTML element
    let newTextElement = document.createElement(elementType);
    //Add text to element
    newTextElement.textContent = newTextContent;
    //Add class
    newTextElement.className = className;
    
    return newTextElement;
};

function createSelectOptions(users){
    //If no parameter, returns undefined
    if(users === undefined || users === null){
        return undefined;
    }
    //Define array
    const optionArray = [];

    //Each user in users array
    for(const user of users){
        //print the user in console
        console.log(user);
        //creating an option
        var opt = document.createElement('option');
        //assigning the user id to the option value
        opt.value = user.id;
        //assigning user name to innerhtml of option
        opt.innerHTML = user.name;
        //adding the option the the array
        optionArray.push(opt);
    }

    //returning array
    return optionArray;
};

function toggleCommentSection(postId) {
    // If Post Id Is Passed, Return Undefined
    if (!postId) {
        return undefined;
    }
    // Selects the section element with the data-post-id attribute 
    // equal to the postId received as a parameter
    let section = document.querySelector(`section[data-post-id="${postId}"]`);
    // verify if section exist
    if (section) {
        // toggle the class `hide` on the section element
        section.classList.toggle('hide');
    }
    // return the section element
    return section;
};

function toggleCommentButton(postId){
    //if postId is not recieved
    if(!postId){
        return;
    }
    //select button having it's value of "data-post-id" attribut = value of "postId"
    const buttonSelectedElement = document.querySelector(`button[data-post-id = "${postId}"]`);
    if(buttonSelectedElement != null){
        //if the textContent of button is 'show comments', change it to 'hide comments'
        //Otherwise change to "show comments" by making use of ternary operator
        buttonSelectedElement.textContent === "Show Comments" ?
        (buttonSelectedElement.textContent = "Hide Comments")
        : (buttonSelectedElement.textContent = "Show Comments");
    }
    return buttonSelectedElement;
};

function deleteChildElements(parentElement){
    if(!parentElement || !(parentElement instanceof HTMLElement)){
        return undefined;
    }

    let child = parentElement.lastElementChild;
    while(child){
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
};

const addButtonListeners = function() {
    const buttons = document.querySelectorAll("main")[0].querySelectorAll('button');     
    // selectes all buttons in main
    if (buttons.length > 0) {
        buttons.forEach( (button) => {
            const postID = button.dataset.postId;   // get the postID 
            // add event listener to this button
            button.addEventListener("click", toggleComments(postID));
        });
    }
    return buttons;  
};

const removeButtonListeners = function() {
    const buttons = document.querySelectorAll("main")[0].querySelectorAll('button');     
    // selectes all buttons in main
    // button should be exists
    // For each button element
    buttons.forEach( (button) => {
        const postID = button.dataset.postId;   // get the postID according to the question
        // See if postId exists
        if(postID){
            button.removeEventListener("click", function() {
                toggleComments(postID);      // calling toggleComments method with postID as parameter
            })
        }
    })
    return buttons;
};


function createComments(comments) 
{
    //return undefined if object is null
    if (!JSON.stringify(comments)) {
        return undefined;
    }
    //  Receives the JSON comments data as a parameter
    //  Creating a fragment element
    let frag = document.createDocumentFragment();
    // Looping through the comments data
    for (let i = 0; i < comments.length; i++) 
    {
        var comment = comments[i];
        //  Creating an article element 
        let article = document.createElement("article");
        // Creating an h3 element with createElemWithText
        let h3 = createElemWithText('h3', comment.name);
        // Creating an paragraph element with createElemWithText
        let p1 = createElemWithText('p', comment.body);
        // Creating an paragraph element with createElemWithText
        let p2 = createElemWithText('p', `From: ${comment.email}`);
        // Appending the h3 and paragraphs to article element
        article.appendChild(h3);
        article.appendChild(p1);
        article.appendChild(p2);
        //  Appending the article element to the fragment
        frag.appendChild(article);
    }
      // Returning the fragment element
    return frag;
};

function populateSelectMenu(usersJSON){
    //If usersJSON is recieved
    if(usersJSON){
        //Select the #selectMenu elemenet by ID
        let selectMenuElement = document.querySelector("#selectMenu");
        
        //Passed the users JSON data to createSelectOptions
        //And received an array of option elements from createSelectOptions
        let arrayOptionElements = createSelectOptions(usersJSON);
        //Loop through the options elements stored in 'arrayOptionElements'
        arrayOptionElements.forEach((optionsInArray) => {
            //appended each option element to the select menu
            selectMenuElement.appendChild(optionsInArray);
        });
        //Return the select menu
        return selectMenuElement;
    }
};

async function getUsers(){
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        return data;
    }catch(err){
        console.error(err);
    }
};

async function getUserPosts(userId) {
    if(!userId){
        return undefined;
    }
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if (!response.ok) {
        throw new Error('Failed to fetch user posts');
        }
        const postData = await response.json();
        return postData;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

async function getUser(userId) {
    if(!userId){
        return undefined;
    }
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
    }
};

async function getPostComments(postId) {
    if(!postId){
        return undefined;
    }
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch post comments');
        }
        const commentsData = await response.json();
        return commentsData;
    } catch (error) {
        console.error('Error fetching post comments:', error);
        throw error;
    }
};

async function displayComments(postId){
    if (!postId){
        return undefined;
    }
    let mySection = document.createElement("section");
    mySection.dataset.postId = postId;
    mySection.classList.add("comments", "hide");
    let comments = await getPostComments(postId);
    let fragment = createComments(comments);
    mySection.append(fragment);
    return mySection;
};

async function createPosts(posts) {
    if(!posts){
        return undefined;
    }
    const fragment = document.createDocumentFragment();
    for (const post of posts) {
        const article = document.createElement('article');
        const h2 = createElemWithText('h2', post.title);
        const p1 = createElemWithText('p', post.body);
        const p2 = createElemWithText('p', `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const p4 = createElemWithText('p', author.company.catchPhrase);
        const button = createElemWithText('button', 'Show Comments');
        button.dataset.postId = post.id;
        article.append(h2, p1, p2, p3, p4, button);
        const section = await displayComments(post.id);
        article.append(section);
        fragment.append(article);
    }
    return fragment;
};

async function displayPosts(posts){
    let myMain = document.querySelector("main");
    let element = (posts) ? await createPosts(posts) : document.querySelector("main p");
    myMain.append(element);
    return element;
};

function toggleComments(event, postId){
    if (!event || !postId){
        return undefined;
    }
    event.target.listener = true;
    let section  = toggleCommentSection(postId);
    let button = toggleCommentButton(postId);
    return [section, button];
};

async function refreshPosts(posts){
    if(!posts){
        return undefined;
    }
    let buttons = removeButtonListeners();
    let myMain = deleteChildElements(document.querySelector("main"));
    let fragment = await displayPosts(posts);
    let button = addButtonListeners();
    return[buttons, myMain, fragment, button];
};

async function selectMenuChangeEventHandler(event){
    if(!event){
        return undefined;
    }
    try{
        let userId = event?.target?.value || 1;
        let posts = await getUserPosts(userId);
        let refreshPostsArray = await refreshPosts(posts);
        return[userId, posts, refreshPostsArray];
    }catch(error){
        console.err("Error with selectMenuChangeHandler function", eroor);
        throw error;
    }
};

async function initPage(){
    try{
        let users = await getUsers();
        let select = populateSelectMenu(users);
        return[users, select];
    }catch(error){
        console.error("An error occurred in initPage function");
        return null;
    }
};

function initApp(){
    initPage();
    let select = document.getElementById("selectMenu");
    select.addEventListener("change", selectMenuChangeEventHandler, false);
};

document.addEventListener("DOMContentLoaded", initApp, false);

//Commit Change Test