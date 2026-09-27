nameofRepo = "Daelan-s-Downloadable-Items"
ownerName = "Daelan"
ownerAge = 11

def welcome_message():
    print(f"Welcome to {nameofRepo}! 🎉")
    print(f"Created by {ownerName}, Age {ownerAge} 💎\n")

def ask_user_name():
    user_name = input("What should I call you? ")
    return user_name

def check_age():
    age_input = input("\nHow old are you? ")
    age = int(age_input)  # Turn text into a NUMBER! 🧮
    
    if age < ownerAge:
        return f"You're {age} — younger than me! 🌱"
    elif age == ownerAge:
        return f"You're {age} too! Same age as me! 🎉"
    else:
        return f"You're {age} — a bit older! Keep learning! 💪"

# Run everything!
welcome_message()
user = ask_user_name()
print(f"\nHi {user}! Great to see you! 😊")
print(check_age())