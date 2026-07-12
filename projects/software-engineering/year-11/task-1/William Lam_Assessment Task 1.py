#William Lam

import numpy as np #imports numpy

import time #imports time module

def get_username(username): #get username function
    print("Enter Username")
    username = str(input(">"))
    return username

def forward(forward):
    forward = False
    while forward != '':
        print("Press Enter to continue")
        forward = str(input('>'))
    forward = True
    return forward

def Q1(lives, streak): #question 1
    correct_answer = 30 #stores the correct answer
    while lives > 0:
        try:
            print("Question One")
            print("5 + 25")
            answer = int(input(">"))
            if answer != correct_answer:
                streak = 0 #resets answer streak
                lives = lives - 1
                print("Incorrect Answer! Streak Lost!")
                if lives == 1:
                    print("You have 1 life remaining.")
                else:
                    print("You have lost one life. You have", lives, "lives remaining.")
            else:
                print("Correct!")
                print("You have passed Question One.")
                streak = streak + 1 #adds one to streak
                return (lives, streak)
        except Exception as e:
            print("Invalid input! Try again. ",e)    #'e' is an 'exception' message
    if lives <= 0:
        print("Game Over.")
        return (lives, streak)
    
def Q2(lives, streak): #question 2
    correct_answer = 21102.73 #stores the correct answer
    while lives > 0:
        try:
            print("Question Two")
            print("241.45 x 87.4")
            answer = float(input(">"))
            if answer != correct_answer:
                streak = 0 #resets answer streak
                lives = lives - 1
                print("Incorrect Answer! Streak Lost!")
                if lives == 1:
                    print("You have 1 life remaining.")
                else:
                    print("You have lost one life. You have", lives, "lives remaining.")
            else:
                print("Correct!")
                print("You have passed Question Two.")
                streak = streak + 1 #adds one to streak
                return (lives, streak)
        except Exception as e:
            print("Invalid input! Try again. ",e)    #'e' is an 'exception' message
    if lives <= 0:
        print("Game Over.")
        return (lives, streak)
    
def Q3(lives, streak): #question 3
    correct_answer = 161.575 #stores the correct answer
    while lives > 0:
        try:
            print("Question Three")
            print("64 + 98 - 85/200")
            answer = float(input(">"))
            if answer != correct_answer:
                streak = 0 #resets answer streak
                lives = lives - 1
                print("Incorrect Answer! Streak Lost!")
                if lives == 1:
                    print("You have 1 life remaining.")
                else:
                    print("You have lost one life. You have", lives, "lives remaining.")
            else:
                print("Correct!")
                print("You have passed Question Three.")
                streak = streak + 1 #adds one to streak
                return (lives, streak)
        except Exception as e:
            print("Invalid input! Try again. ",e)    #'e' is an 'exception' message
    if lives <= 0:
        print("Game Over.")
        return (lives, streak)
    
def Q4(lives, streak): #question 4
    correct_answer = 1533.37 #stores the correct answer
    while lives > 0:
        try:
            print("Question Four")
            print("1000 - 82.5 + 615.87")
            answer = float(input(">"))
            if answer != correct_answer:
                streak = 0 #resets answer streak
                lives = lives - 1
                print("Incorrect Answer! Streak Lost!")
                if lives == 1:
                    print("You have 1 life remaining.")
                else:
                    print("You have lost one life. You have", lives, "lives remaining.")
            else:
                print("Correct!")
                print("You have passed Question Four.")
                streak = streak + 1 #adds one to streak
                return (lives, streak)
        except Exception as e:
            print("Invalid input! Try again. ",e)    #'e' is an 'exception' message
    if lives <= 0:
        print("Game Over.")
        return (lives, streak)
    
def Q5(lives, streak): #question 5
    correct_answer = 1123 #stores the correct answer
    while lives > 0:
        try:
            print("Question Five")
            print("10^3 + 123")
            answer = float(input(">"))
            if answer != correct_answer:
                streak = 0 #resets answer streak
                lives = lives - 1
                print("Incorrect Answer! Streak Lost!")
                if lives == 1:
                    print("You have 1 life remaining.")
                else:
                    print("You have lost one life. You have", lives, "lives remaining.")
            else:
                print("Correct!")
                print("You have passed Question Five.")
                streak = streak + 1 #adds one to streak
                return (lives, streak)
        except Exception as e:
            print("Invalid input! Try again. ",e)    #'e' is an 'exception' message
    if lives <= 0:
        print("Game Over.")
        return (lives, streak)
    
def Q6(lives, streak): #question 6
    correct_answer = 1234321 #stores the correct answer
    while lives > 0:
        try:
            print("Question Six")
            print("1111 x 1111")
            answer = float(input(">"))
            if answer != correct_answer:
                streak = 0 #resets answer streak
                lives = lives - 1
                print("Incorrect Answer! Streak Lost!")
                if lives == 1:
                    print("You have 1 life remaining.")
                else:
                    print("You have lost one life. You have", lives, "lives remaining.")
            else:
                print("Correct!")
                print("You have passed Question Six.")
                streak = streak + 1 #adds one to streak
                return (lives, streak)
        except Exception as e:
            print("Invalid input! Try again. ",e)    #'e' is an 'exception' message
    if lives <= 0:
        print("Game Over.")
        return (lives, streak)
    
def Q7(lives, streak): #question 7
    correct_answer = -1818.887 #stores the correct answer
    while lives > 0:
        try:
            print("Question Seven")
            print("(10+3)^2 - 1987.887")
            answer = float(input(">"))
            if answer != correct_answer:
                streak = 0 #resets answer streak
                lives = lives - 1
                print("Incorrect Answer! Streak Lost!")
                if lives == 1:
                    print("You have 1 life remaining.")
                else:
                    print("You have lost one life. You have", lives, "lives remaining.")
            else:
                print("Correct!")
                print("You have passed Question Seven.")
                streak = streak + 1 #adds one to streak
                return (lives, streak)
        except Exception as e:
            print("Invalid input! Try again. ",e)    #'e' is an 'exception' message
    if lives <= 0:
        print("Game Over.")
        return (lives, streak)
    
    

def bossQ1(lives, streak, calculator):
    correct_answer = 7 #stores the correct answer
    while lives > 0:
        try:
            print("Question 1")
            print("2(1+3) - 7/(4+3) + (1+3) x 0")
            choice = ''
            while choice != 'A' or 'C':
                print('Input A to answer')
                print('Input C to use calculator')
                choice = input('>')
                choice = choice.upper()
                if choice == 'C' and calculator == True:
                    calculator = False
                    streak = streak + 1
                    print("You have passed using a CALCULATOR. Lucky!")
                    answer = correct_answer
                    return(lives, streak, calculator)
                elif choice == 'C' and calculator == False:
                    print("You do not have a calculator")
                    choice = ''
                elif choice == 'A':
                    print("Enter your answer")
                    answer = float(input(">"))
                    if answer != correct_answer:
                        streak = 0 #resets answer streak
                        lives = lives - 1
                        print("Incorrect Answer! Streak Lost!")
                        if lives == 1:
                            print("You have 1 life remaining.")
                        else:
                            print("You have lost one life. You have", lives, "lives remaining.")
                    else:
                        print("Correct!")
                        print("You have passed Question One.")
                        streak = streak + 1 #adds one to streak
                        return (lives, streak, calculator)
        except Exception as e:
            print("Invalid input! Try again. ",e)    #'e' is an 'exception' message
    if lives <= 0:
        print("Game Over.")
        return (lives, streak, calculator)
    
def bossQ2(lives, streak, calculator):
    correct_answer = 0 #stores the correct answer
    while lives > 0:
        try:
            print("Question 2")
            print("132 x 6673/3213 x 0 x 1092")
            choice = ''
            while choice != 'A' or 'C':
                print('Input A to answer')
                print('Input C to use calculator')
                choice = input('>')
                choice = choice.upper()
                if choice == 'C' and calculator == True:
                    calculator = False
                    streak = streak + 1
                    print("You have passed using a CALCULATOR. Lucky!")
                    answer = correct_answer
                    return(lives, streak, calculator)
                elif choice == 'C' and calculator == False:
                    print("You do not have a calculator")
                    choice = ''
                elif choice == 'A':
                    print("Enter your answer")
                    answer = float(input(">"))
                    if answer != correct_answer:
                        streak = 0 #resets answer streak
                        lives = lives - 1
                        print("Incorrect Answer! Streak Lost!")
                        if lives == 1:
                            print("You have 1 life remaining.")
                        else:
                            print("You have lost one life. You have", lives, "lives remaining.")
                    else:
                        print("Correct!")
                        print("You have passed Question Two.")
                        streak = streak + 1 #adds one to streak
                        return (lives, streak, calculator)
        except Exception as e:
            print("Invalid input! Try again. ",e)    #'e' is an 'exception' message
    if lives <= 0:
        print("Game Over.")
        return (lives, streak, calculator)
    
def bossQ3(lives, streak, calculator):
    correct_answer = 15750.5 #stores the correct answer
    while lives > 0:
        try:
            print("Question 3")
            print("1/2 + 15^3 x 56/12")
            choice = ''
            while choice != 'A' or 'C':
                print('Input A to answer')
                print('Input C to use calculator')
                choice = input('>')
                choice = choice.upper()
                if choice == 'C' and calculator == True:
                    calculator = False
                    streak = streak + 1
                    print("You have passed using a CALCULATOR. Lucky!")
                    answer = correct_answer
                    return(lives, streak, calculator)
                elif choice == 'C' and calculator == False:
                    print("You do not have a calculator")
                    choice = ''
                elif choice == 'A':
                    print("Enter your answer")
                    answer = float(input(">"))
                    if answer != correct_answer:
                        streak = 0 #resets answer streak
                        lives = lives - 1
                        print("Incorrect Answer! Streak Lost!")
                        if lives == 1:
                            print("You have 1 life remaining.")
                        else:
                            print("You have lost one life. You have", lives, "lives remaining.")
                    else:
                        print("Correct!")
                        print("You have passed Question Three.")
                        streak = streak + 1 #adds one to streak
                        return (lives, streak, calculator)
        except Exception as e:
            print("Invalid input! Try again. ",e)    #'e' is an 'exception' message
    if lives <= 0:
        print("Game Over.")
        return (lives, streak, calculator)
    

#main



begin = 0
username = ''
username_confirmed = 'N'
lives = 5
streak = 0

print("Welcome to Math Quest!")
print("Answer a series of questions to save the land from the treacherous Math Inquisitor!")
print("Good luck brave soul...")
print()
while begin != '': #waits until the user presses enter to begin
    print("Press ENTER to start")
    begin = str(input(">"))
    if begin != '':
        print()
        print("Waiting...")
        print()

print()
print("Loading...") #Loading screen
print()

#creates sequential file called statistics, will store the scores
f = open("statistics.txt", "a")
f.close()
print("Showing previous scores. If nil, there are no previous scores. Statistics will only be recorded if the entire run is finished.")
f = open("statistics.txt", "r")
for x in f:
    print(x)
f.close()
print()

while username_confirmed != 'Y': #Asks user to input a username, repeats until the user confirms
    username = get_username(username) #gets username from the user
    print("Confirm username as: ", username, "? (Y/N)")
    username_confirmed = input('>').upper()

print()
print("Username is confirmed as ", username)
print()

questions_finished = False 

continueon = forward(forward)

print("Time begins now!")
start = time.time() #starts timer

while lives > 0 and questions_finished == False: #runs the normal questions

    lives, streak = Q1(lives, streak)
    print()
    print("Stats!")
    print("Your current answer streak is", streak)
    print("Lives remaining:", lives)
    print()

    lives, streak = Q2(lives, streak)
    print()
    print("Stats!")
    print("Your current answer streak is", streak)
    print("Lives remaining:", lives)
    print()

    lives, streak = Q3(lives, streak)
    print()
    print("Stats!")
    print("Your current answer streak is", streak)
    print("Lives remaining:", lives)
    print()

    lives, streak = Q4(lives, streak)
    print()
    print("Stats!")
    print("Your current answer streak is", streak)
    print("Lives remaining:", lives)
    print()

    lives, streak = Q5(lives, streak)
    print()
    print("Stats!")
    print("Your current answer streak is", streak)
    print("Lives remaining:", lives)
    print()

    lives, streak = Q6(lives, streak)
    print()
    print("Stats!")
    print("Your current answer streak is", streak)
    print("Lives remaining:", lives)
    print()

    lives, streak = Q7(lives, streak)
    print()
    print("Stats!")
    print("Your current answer streak is", streak)
    print("Lives remaining:", lives)
    print()

    questions_finished = True
if lives <= 0:
    exit()

if streak >= 2: #if user gets 2 correct in a row they get an extra heart
        lives = lives + 1
        print("Since you have a streak of 2, you got an extra life!")
        print("You now have", lives, "lives")
if streak >= 5:
        calculator = True
        print("Since you have a streak of 5, you have received a CALCULATOR. Use it in the bossfight to immediately answer any question!")
else:
    calculator = False

print()
print("***Loading BOSS FIGHT***")
print("________________________")
print('Here lies the Math Inquisitor, the final boss. Beware of his deadly questions..')
print()

questions_finished = False

while lives > 0 and questions_finished == False: #runs the boss fight questions

    
    lives, streak, calculator = bossQ1(lives, streak, calculator)
    print()
    print("Stats!")
    print("Your current answer streak is", streak)
    print("Lives remaining:", lives)
    print()
    continueon = forward(forward)

    lives, streak, calculator = bossQ2(lives, streak, calculator)
    print()
    print()
    print("Stats!")
    print("Your current answer streak is", streak)
    print("Lives remaining:", lives)
    print()
    continueon = forward(forward)

    lives, streak, calculator = bossQ3(lives, streak, calculator)
    print()
    print()
    print("Stats!")
    print("Your current answer streak is", streak)
    print("Lives remaining:", lives)
    print()

    questions_finished = True
if lives <= 0:
    exit()

end = time.time() #stops timer

print('You have defeated the Math Inquisitor! You lie the King  of the land.')
endtime = ((end-start)/60) #calculates the end time in minutes
print("Your time was " + format(endtime, ",.2f") + " minutes.")
print("Your statistics have been recorded")
print()
print("GAME COMPLETED")


statisticsArray = [username, streak, lives, end] #array which stores all the necessary statistics
f = open("statistics.txt", "a") #opens / creates the text file
f.write(str(statisticsArray)) #writes the statistics to the text file
f.close()
f = open("statistics.txt", "a")
f.write("\n")
f.close()