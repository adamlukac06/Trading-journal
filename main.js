
// Function to update time
function updateTime() {
    var currentTime = new Date().toLocaleString();
    document.getElementById('local-time').textContent = currentTime;
}

// Update time every second
setInterval(updateTime, 1000);

// Call updateTime once to display the time immediately
updateTime();

// Function to get the current date and time in the format YYYY-MM-DDTHH:MM
function getCurrentDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
    var day = String(now.getDate()).padStart(2, '0');
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');

    return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
}

// Set the value and max of the date fields to the current date and time
var currentDateTime = getCurrentDateTime();
document.getElementById('entry-time').value = currentDateTime;
document.getElementById('entry-time').max = currentDateTime;
document.getElementById('exit-time').value = currentDateTime;
document.getElementById('exit-time').max = currentDateTime;

var submitEntryElement = document.getElementById('submit-entry');
if (submitEntryElement) {
    submitEntryElement.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission

        // Update the current time value
        var currentDateTime = getCurrentDateTime();
        document.getElementById('entry-time').max = currentDateTime;
        document.getElementById('exit-time').max = currentDateTime;

        var form = document.getElementById('journal-form');
        if (!form.checkValidity()) {
            form.reportValidity(); // Trigger the validation message
            return; // If the form is not valid, stop here
        }

        var entryTime = document.getElementById('entry-time').value;
        var exitTime = document.getElementById('exit-time').value;

        // Check if entry or exit time is in the future
        var now = new Date();
        var entryDateTime = new Date(entryTime);
        var exitDateTime = new Date(exitTime);
        if (entryDateTime > now || exitDateTime > now) {
            alert("Entry or exit time cannot be in the future.");
            return;
        }

        // Check if exit time is sooner than entry time
        if (exitDateTime < entryDateTime) {
            alert("Exit time cannot be sooner than entry time.");
            return;
        }

        var symbolName = document.getElementById('symbol-name').value;
        var entryPrice = parseFloat(document.getElementById('entry-price').value);
        var exitPrice = parseFloat(document.getElementById('exit-price').value);
        var side = document.getElementById('side').value;
        var question1 = document.getElementById('question-1').value;
        var question2 = document.getElementById('question-2').value;
        var question3 = document.getElementById('question-3').value;

        var profitLoss = side === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice;

        var fullEntry = {
            symbolName: symbolName,
            entryTime: entryTime,
            exitTime: exitTime,
            entryPrice: entryPrice,
            exitPrice: exitPrice,
            side: side,
            question1: question1,
            question2: question2,
            question3: question3,
            profitLoss: profitLoss
        };

        // Save to local storage
        var entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        entries.push(fullEntry);
        localStorage.setItem('journalEntries', JSON.stringify(entries));

        // Clear the input fields
        document.getElementById('symbol-name').value = '';
        document.getElementById('entry-time').value = '';
        document.getElementById('exit-time').value = '';
        document.getElementById('entry-price').value = '';
        document.getElementById('exit-price').value = '';
        document.getElementById('side').value = '';
        document.getElementById('question-1').value = '';
        document.getElementById('question-2').value = '';
        document.getElementById('question-3').value = '';

        // Display entries
        displayEntries();
    });
}

var deleteSelectedElement = document.getElementById('delete-selected');
if (deleteSelectedElement) {
    deleteSelectedElement.addEventListener('click', function() {
        var checkboxes = document.querySelectorAll('.entry input[type="checkbox"]');
        var entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        var newEntries = entries.filter(function(entry, index) {
            return !checkboxes[index].checked;
        });
        localStorage.setItem('journalEntries', JSON.stringify(newEntries));
        displayEntries();
    });
}

var submitSelectedElement = document.getElementById('submit-selected');
if (submitSelectedElement) {
    submitSelectedElement.addEventListener('click', function() {
        var selectedEntries = [];
        var checkboxes = document.querySelectorAll('.entry input[type="checkbox"]');
        checkboxes.forEach(function(checkbox, index) {
            if (checkbox.checked) {
                selectedEntries.push(checkbox.nextElementSibling.textContent);
            }
        });
        downloadSelectedEntries(selectedEntries.join('\n'), 'selected_entries.txt');
    });
}

var submitAllElement = document.getElementById('submit-all');
if (submitAllElement) {
    submitAllElement.addEventListener('click', function() {
        var entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        var entriesText = entries.map(JSON.stringify).join('\n');
        downloadEntries(entriesText, 'all_entries.txt');
    });
}

function downloadEntries(data, filename) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

var selectAllElement = document.getElementById('select-all');
if (selectAllElement) {
    selectAllElement.addEventListener('click', function() {
        var checkboxes = document.querySelectorAll('.entry input[type="checkbox"]');
        checkboxes.forEach(function(checkbox) {
            checkbox.checked = true;
        });
    });
}

// Add event listener to toggle dark mode
var toggleDarkModeElement = document.getElementById('toggle-dark-mode');
if (toggleDarkModeElement) {
    toggleDarkModeElement.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
    });
}

function displayEntries() {
    var entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    var lastThreeEntries = entries.slice(-3); // Get the last 3 entries
    var entriesHtml = lastThreeEntries.map(function(entry, index) {
        // Formatting the entry into a readable string
        var entryText = `
            Symbol: ${entry.symbolName} <br>
            Entry Time: ${entry.entryTime} <br>
            Exit Time: ${entry.exitTime} <br>
            Entry Price: ${entry.entryPrice} <br>
            Exit Price: ${entry.exitPrice} <br>
            Side: ${entry.side} <br>
            Profit/Loss: ${entry.profitLoss ? entry.profitLoss.toFixed(2) : 'N/A'} <br>
            Feelings: ${entry.question1} <br>
            Strategy: ${entry.question2} <br>
            Opinion: ${entry.question3} <br>
        `;

        return '<div class="entry"><input type="checkbox" id="entry-' + index + '"><label for="entry-' + index + '">' + entryText + '</label></div>';
    }).join('');
    document.getElementById('past-entries').innerHTML = entriesHtml;
}

// Load entries on page load
window.onload = function() {
    displayEntries();
    setDailyReminder(); // Call this function when the script loads
    // ... other code ...
};

function setDailyReminder() {
    var now = new Date();
    var nextReminder = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    var timeout = nextReminder - now;
    setTimeout(function() {
        alert("Don't forget to write in your journal!");
        setDailyReminder(); // Set the next reminder
    }, timeout);
}
setDailyReminder();

