# Post data to Google Sheets

Have you ever just wanted to save form data in a simple way without setting up a database? You can use Google Sheets and Google Apps Script!

# How to setup

1. Create a new spreadsheet at [Google Docs](https://docs.google.com/spreadsheets).
2. Go to menu `Add-ons -> Apps Script`.
3. Copy and paste the code from `code.gs` and save.
4. Choose `initialSetup` in the drop down and press `Run`. It will now prompt you to grant access to the script to make changes to your files on Google Drive. Give it access to do so.
5. Click `Deploy -> New Deployment`. Choose `⚙ > Web app.` Under permissions make sure everyone can access (otherwise we can't post to it) and then press `Deploy`.
6. Copy the url.

# How to use

Now we can post json data to the url and it is saved to your spreadsheet. Just replace `INSERT_URL_HERE` with the url you copied from step 6 and put your own data.

    curl --location --request POST INSERT_URL_HERE \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d '{"firstName": "John", "lastName": "Doe", "email": "john.doe@example.com"}'

You can send in whatever structure you want. The script will automatically create header columns to suit the data structure sent in. The script will create a timestamp column to keep track of when data was created.
