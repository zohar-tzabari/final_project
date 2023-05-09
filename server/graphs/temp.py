import matplotlib.pyplot as plt

# Define the sizes of the two sections of the pie chart
sizes = [14, 94-14]

# Define the labels for the two sections of the pie chart
labels = ['our tagged photos', 'Robfolow']

# Define the colors for the two sections of the pie chart
colors = ['lightblue', 'lightgreen']

# Create the pie chart
plt.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=90)

# Add a title to the pie chart
plt.title('Distribution of validation Labeled Photos')

# Display the pie chart
plt.show()
