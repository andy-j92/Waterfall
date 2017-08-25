import textrazor

textrazor.api_key = "42bf05bc7e7ca4f934bc0cff25d7564371730333854db6abe107b578"

client = textrazor.TextRazor(extractors=["entities", "topics"])
response = client.analyze("Andy Jang Student Developer Applying for graduate position.Developer Experience.Unity game development.Made a simple game called react using C# in Unity3D in my spare time and published it in google play store. Working on another game using C# that is 70percent done. Summer internship at Olympic Software nov 2016 to feb 2016.Implemented front-end features on internal website using html/css and linked functionalities using C# with Razor.Worked on a solo project to create a bot that processed certain tasks based on the user input. Bot was made with microsoft bot framwork and LUIS. Implemented features on internal web applications using angularJS. Summar intership at YQ App, Nov 2015 to Feb 2016.In charge of creating new styles for one of the webpages in html/css.Fixed bugs related to styling. Learnt basics of JavaScript and used it to make an automated css styling PHP page.Created click dummy webpage using React which was going to replace the current webpage.Learnt bash commands to navigate through Linux system and use Github and BitBucket.University Studies.In 3rd year, created a website using html,css and javascript and build a game using C# in Unity3D. In 2nd year, most of the assignments and projects were done using java. In 1st year, learnt basics of C.Continued to work in Olympic Software during univerity but only been in for a few times.Asked if I wanted to continue working with Olympic as a graduate and I answered yes but havent signed a contract yet.")

for entity in response.entities():
    if(len(entity.freebase_types) == 0):
        print entity.id
    else:
        print entity.id, entity.freebase_types
