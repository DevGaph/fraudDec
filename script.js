document.getElementById('fraudForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Collecting input values
    const email = document.getElementById('email').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const country = document.getElementById('country').value;
    const transactionType = document.getElementById('transactionType').value;
    const ipAddress = document.getElementById('ipAddress').value;

    // Basic input validation
    if (!validateEmail(email)) {
        showResult("Invalid email format", "red");
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        showResult("Transaction amount must be a positive number", "red");
        return;
    }

    if (!country || !transactionType) {
        showResult("Please select a country and transaction type", "red");
        return;
    }

    // Prepare the data to send to the backend
    const transactionData = {
        email,
        amount,
        country,
        transactionType,
        ipAddress
    };

    try {
        // Send data to the backend
        const response = await fetch('http://localhost:5000/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });

        // Handle the response
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        showResult(`Transaction Status: ${data.status}`, data.status === 'High Risk' ? 'red' : 'green');
    } catch (error) {
        console.error('Error:', error);
        showResult("Error processing transaction. Please try again later.", "red");
    }
});

// Function to validate email format
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Function to display the result
function showResult(message, color) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = message;
    resultDiv.style.color = color;
}
