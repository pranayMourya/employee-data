// Load cards
document.addEventListener("DOMContentLoaded", async () => {
    fetch('./data.json', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
        .then(response => response.json())
        .then((data) => {
            let cardData = data;
            cardData.map((item, index) => {
                generateCard(item, index);
            })
        }).catch(err => {
            console.error(err, "error occured");
        })

    // add / edit / delete card
    var container = document.getElementById('drag-container');
    container.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-btn')) {
            // Get the parent div of the clicked button and remove it
            var parentDiv = event.target.closest('.datacard');
            if (parentDiv) {
                let text = "Are you sure you want to delete this item?";
                if (confirm(text) == true) {
                    parentDiv.remove();
                }
            }
        }
    });
})

// create and add datacard
const addDataCard = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.elements['name'].value;
    const designation = form.elements['designation'].value;
    const salaryRange = form.elements['salary-range'].value;
    generateCard({
        name,
        designation,
        salaryRange
    }, parseInt(Math.random() * 1000000))
    form.reset()
    toggleAddNewCard();
}
const cancelAdd = (event) => {
    event.target.closest('form').reset();
    toggleAddNewCard();
}
const toggleAddNewCard = () => {
    const ele = document.getElementById("addCardInputContainer");
    const value = ele.style.display;
    ele.style.display = value === "block" ? "none" : "block";
}
// generate card
const generateCard = (item, index) => {
    const card = `
    <div id="card${index}" ondragstart="dragStart(event)" class="datacard draggable">
    <div style="display: flex; justify-content: flex-end;">
            <button
                class="card-button move-button"
                onmouseenter="startDragHandler(event)"
                onmouseleave="stopDragHandler(event)">
                Drag
            </button>
        </div>
        <div class="datacard-content">
            <div class="info-box">
                <div style="margin-bottom: 0.5rem;">
                <input value="${item.name}" class="edit-input name-input" />
                </div>
                <div>
                <input value="${item.designation}" class="edit-input designation-input" />
                </div>
            </div>
            <div>
                <input
                onmousedown="sliderDragStart(event)"
                onchange="sliderDragStart(event)"
                class="slider"
                style="width: 100%"
                type="range"
                min="0"
                max="100"
                value="${item.salaryRange ?? 0}"
                step="5"
                />
            </div>
        </div>
        <div class="datacard-footer">
            <button
                type="button"
                class="card-button delete-btn"
            >
                Delete
            </button>
        </div>
    </div>
    `
    let elem = document.getElementById("drag-container");
    elem.innerHTML += card;
}

// Card draggable
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function dragEnter(event) {
    event.preventDefault();
    document.getElementById("drag-container").style.border = "2px dashed #3498db";
}

function dragLeave(event) {
    event.preventDefault();
    document.getElementById("drag-container").style.border = "2px dashed #ccc";
}

function drop(event) {
    event.preventDefault();
    document.getElementById("drag-container").style.border = "none";

    const data = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);
    const dropZone = document.getElementById("drag-container");

    // Update the position of the dropped element
    const rect = dropZone.getBoundingClientRect();
    const x = event.clientX - rect.left - draggedElement.clientWidth / 2;
    const y = event.clientY - rect.top - draggedElement.clientHeight / 2;

    draggedElement.style.left = `${x}px`;
    draggedElement.style.top = `${y}px`;

    // Append the dragged element back to the drop zone
    dropZone.appendChild(draggedElement);
}

const dragContainer = document.getElementById("drag-container");

dragContainer.addEventListener("dragover", allowDrop);
dragContainer.addEventListener("dragenter", dragEnter);
dragContainer.addEventListener("dragleave", dragLeave);
dragContainer.addEventListener("drop", drop);

// Drag drop with button
function startDragHandler(event) {
    isDragging = true;
    draggedElement = event.target.closest(".draggable");
    draggedElement.draggable = true;
}

function stopDragHandler(event) {
    isDragging = false;
    draggedElement = event.target.closest(".draggable");
    draggedElement.draggable = false;
}