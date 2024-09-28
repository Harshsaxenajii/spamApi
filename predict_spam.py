# predict.py

import sys
import joblib

# Load the saved model
model = joblib.load('spam_classifier_model.pkl')

# Get the message from the command line arguments
message = sys.argv[1]

# Predict the label ('ham' or 'spam')
prediction = model.predict([message])

# Determine the label
label = 'spam' if prediction[0] == 1 else 'ham'
# Output the label directly
print(label)
