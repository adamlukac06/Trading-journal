# Trading Journal Application

This application is a simple trading journal that allows users to record their trades and reflect on them. It's built using HTML, CSS, and JavaScript, and stores data in the browser's local storage.

## Features

1. **Record Trades**: Users can record the details of their trades, including the symbol name, entry and exit times, entry and exit prices, and whether the trade was long or short.

2. **Reflect on Trades**: Users can reflect on their trades by answering three questions about their feelings, strategy, and opinion on how the trade played out.

3. **View Past Trades**: The last three trades are displayed on the page. Each trade is formatted into a readable string and displayed in a separate div.

4. **Delete and Download Trades**: Users can select trades to delete or download. They can also download all trades.

## Styling

The application is styled using CSS. The body of the page is centered and the journal container is set to a maximum width of 600px. The inputs, buttons, and text areas have a consistent background color and font color.

## Local Storage

The application uses the browser's local storage to store the trades. When a new trade is submitted, it's added to an array of entries which is then stored in local storage. When the page is loaded, the entries are retrieved from local storage and displayed.

## Validation

The application validates the input fields to ensure they're filled out and the entry and exit times are not in the future or reversed.

## Dark Mode

The application also includes a dark mode toggle. When the toggle is clicked, the 'dark-mode' class is added or removed from the body.
