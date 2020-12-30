from flask import Flask,abort, jsonify, request, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
from main import db, Color, Product, ProductType, Picture, Size, Category, News, Omoss, Coworker, Admin, OpeningHours, OrderHistory
import requests
import json


# ####################################################################
## Kör denna fil (python ResetDB.py i terminalen) varje             ##
## gång ändringar görs i databasens tables!                         ##
## ** Main.py måste köras för att denna ska kunna anropa requests** ##
######################################################################


db.drop_all() #droppar alla tables
db.create_all() #skapar alla på nytt

####### Färgkoder #######
# Grå : #808080         #
# Grön : #008000        #
# Blå : #0000FF         #
# Vit : #FFFFFF         #
# Marinblå : #000080   #
# Svart : #000000       #
# Gul : #FFFF00         #
# Mörkgrå : #A9A9A9     #
# Ljusgrå : #D3D3D3     #
#########################

####HOODIE FÖR TESTNING!!!################
Hoodie = requests.post('http://localhost:5000/admin/webshop', json = {   "name": "Hoodie",
	                                                                        "description": "Varm och skön hoodie för alla årstider och tillställningar!",
	                                                                        "price": 350,
                                                                            "categories": ["Produkter", "Kläder", "Tröjor"],
                                                                            "colors": ["#808080", "#008000", "#0000FF"],
                                                                            "colornames": ["Grå", "Grön", "Blå"],
                                                                            "pictures": ["products/Hoodie_DarkGrey.jpg", "products/Hoodie_BottleGreen.jpg", "products/Hoodie_NavyBlue.jpg"],
                                                                            "sizes": ["S", "M", "L"],
                                                                            "canOrder": True
                                                                        } )
############################################### Products ###############################################
Product1  = requests.post('http://localhost:5000/admin/webshop', json = {   "name": "Vattenflaska",
	                                                                        "description": "Fyll med vatten och låt dra i en halvtimme. Drick direkt från flaskan för en mild till kraftig effekt. Byt alltid ut vattnet minst en gång om dagen.",
	                                                                        "price": 100,
                                                                            "categories": ["Produkter", "Accessoarer", "Vattenflaskor"],
                                                                            "colors": ["#FFFFFF"],
                                                                            "colornames": ["Crystal Clear"],
                                                                            "pictures": ["products/vattenflaska.png"],
                                                                            "sizes": ["NA"],
                                                                            "canOrder": True
                                                                        } )

Product2  = requests.post('http://localhost:5000/admin/webshop', json = {   "name": "Zip-Hoodie",
	                                                                        "description": "Tröja i 100% Bomull",
	                                                                        "price": 299,
                                                                            "categories": ["Produkter", "Kläder", "Tröjor"],
                                                                            "colors": ["#D3D3D3", "#000080"],
                                                                            "colornames": ["Ljusgrå", "Marinblå"],
                                                                            "pictures": ["products/ZipHoodie_LightGrey.jpg", "products/ZipHoodie_NavyBlue.jpg"],
                                                                            "sizes": ["XS", "S", "M", "L", "XL"],
                                                                            "canOrder": False
                                                                        } )

Product3  = requests.post('http://localhost:5000/admin/webshop', json = {   "name": "Väska",
	                                                                        "description": "Snygg väska?",
	                                                                        "price": 350,
                                                                            "categories": ["Produkter", "Accessoarer", "Väskor"],
                                                                            "colors": ["#000000"],
                                                                            "colornames": ["Svart"],
                                                                            "pictures": ["products/Ryggsäck.jpg"],
                                                                            "sizes": ["NA"],
                                                                            "canOrder": True
                                                                        } )


Product4  = requests.post('http://localhost:5000/admin/webshop', json = {   "name": "Axelväska",
	                                                                        "description": "Det är en enkel och funktionell daglig axelväska",
	                                                                        "price": 495,
                                                                            "categories": ["Produkter", "Accessoarer", "Väskor"],
                                                                            "colors": ["#000000"],
                                                                            "colornames": ["Svart"],
                                                                            "pictures": ["products/Axelväska.jpg"],
                                                                            "sizes": ["NA"],
                                                                            "canOrder": True
                                                                        } )

Product5  = requests.post('http://localhost:5000/admin/webshop', json = {   "name": "Märke - Ryd",
	                                                                        "description": "Både Ryd, berga och skäggetorp är områden som är mest oroliga i linköping.",
	                                                                        "price": 10,
                                                                            "categories": ["Produkter", "Accessoarer", "Märken"],
                                                                            "colors": ["#0000FF"],
                                                                            "colornames": ["Blå"],
                                                                            "pictures": ["products/Märke_Ryd.jpg"],
                                                                            "sizes": ["NA"],
                                                                            "canOrder": True
                                                                        } )

Product6  = requests.post('http://localhost:5000/admin/webshop', json = {   "name": "Märke - Flamman",
	                                                                        "description": "Korrefest? ¯\_(ツ)_/¯ ",
	                                                                        "price": 25,
                                                                            "categories": ["Produkter", "Accessoarer", "Märken"],
                                                                            "colors": ["#0000FF"],
                                                                            "colornames": ["Blå"],
                                                                            "pictures": ["products/Märke_Flamman.jpg"],
                                                                            "sizes": ["NA"],
                                                                            "canOrder": True
                                                                        } )

Product7  = requests.post('http://localhost:5000/admin/webshop', json = {   "name": "Märke - Colonia",
	                                                                        "description": "Min hyresvärd ByggVesta håller på att bygga nya bostäder i mitt område Colonia i Linköping vilket har resulterat i många störningar för oss boende.",
	                                                                        "price": 6,
                                                                            "categories": ["Produkter", "Accessoarer", "Märken"],
                                                                            "colors": ["#0000FF"],
                                                                            "colornames": ["Blå"],
                                                                            "pictures": ["products/Märke_Colonia.jpg"],
                                                                            "sizes": ["NA"],
                                                                            "canOrder": True
                                                                        } )

Product8  = requests.post('http://localhost:5000/admin/webshop', json = {   "name": "Märke - Lambohov",
	                                                                        "description": "Snyggt märke, köp!.",
	                                                                        "price": 12,
                                                                            "categories": ["Produkter", "Accessoarer", "Märken"],
                                                                            "colors": ["#0000FF"],
                                                                            "colornames": ["Blå"],
                                                                            "pictures": ["products/Märke_Lambohov.jpg"],
                                                                            "sizes": ["NA"],
                                                                            "canOrder": True
                                                                        } )

Product9  = requests.post('http://localhost:5000/admin/webshop', json = {   "name": "Märke - LiUStore",
	                                                                        "description": "Min hyresvärd ByggVesta håller på att bygga nya bostäder i mitt område Colonia i Linköping vilket har resulterat i många störningar för oss boende.",
	                                                                        "price": 6,
                                                                            "categories": ["Produkter", "Accessoarer", "Märken"],
                                                                            "colors": ["#000000"],
                                                                            "colornames": ["Svart"],
                                                                            "pictures": ["products/Märke_LiUStore.jpg"],
                                                                            "sizes": ["NA"],
                                                                            "canOrder": True
                                                                        } )

Product10  = requests.post('http://localhost:5000/admin/webshop', json = {   "name": "Märke - Jodel",
	                                                                        "description": "Märke i läder, köp den",
	                                                                        "price": 1,
                                                                            "categories": ["Produkter", "Accessoarer", "Märken"],
                                                                            "colors": ["#FFFF00"],
                                                                            "colornames": ["Gul"],
                                                                            "pictures": ["products/Märke_LATex_Jodel.jpg"],
                                                                            "sizes": ["NA"],
                                                                            "canOrder": True
                                                                        } )

Product11  = requests.post('http://localhost:5000/admin/webshop', json = {   "name": "Märke - Valla",
	                                                                        "description": "Helt Maxat märke",
	                                                                        "price": 34999,
                                                                            "categories": ["Produkter", "Accessoarer", "Märken"],
                                                                            "colors": ["#0000FF"],
                                                                            "colornames": ["Blå"],
                                                                            "pictures": ["products/Märke_Valla.jpg"],
                                                                            "sizes": ["NA"],
                                                                            "canOrder": True
                                                                        } )

Product12  = requests.post('http://localhost:5000/admin/webshop', json = {  "name": "Träningsbyxor",
	                                                                        "description": "Sköna träningsbyxor i bomull",
	                                                                        "price": 399,
                                                                            "categories": ["Produkter", "Kläder", "Byxor"],
                                                                            "colors": ["#A9A9A9", "#D3D3D3"],
                                                                            "colornames": ["Mörkgrå", "Ljusgrå"],
                                                                            "pictures": ["products/Sweatpants_DarkGrey.jpg", "products/Sweatpants_LightGrey.jpg"],
                                                                            "sizes": ["S", "M", "L"],
                                                                            "canOrder": True
                                                                        } )
                                                                        
Product13  = requests.post('http://localhost:5000/admin/webshop', json = {  "name": "T-Shirt",
	                                                                        "description": "Liu T-shirt i bomull",
	                                                                        "price": 199,
                                                                            "categories": ["Produkter", "Kläder", "T-shirt"],
                                                                            "colors": ["#000000","#008000", "#000080"],
                                                                            "colornames": ["Svart", "Grön", "Marinblå"],
                                                                            "pictures": ["products/T-Shirt_Black.jpg", "products/T-Shirt_BottleGreen.jpg", "products/T-Shirt_NavyBlue.jpg"],
                                                                            "sizes": ["S", "M", "L"],
                                                                            "canOrder": True
                                                                        } )                                                                        
#------------------------------------------------------------------------------------------------------#



#########################################@jwt_requir##### Pictures #############################################

#------------------------------------------------------------------------------------------------------#




################################################## News ################################################

News1 = requests.post('http://localhost:5000/admin/news', json = {  'header': 'Så kan doktorerna lättare få arbete',
                                                                    'text': 'För att öka anställningsbarheten kan både enskilda individer, lärosäten och arbetsgivare göra viktiga insatser (se rekommendationerna i slutet av artikeln). Eloïse Germain-Alamartine hävdar också att entreprenöriella universitet kan spela en betydelsefull roll genom att samarbeta med företag och andra organisationer, arrangera jobbmässor och personliga kontakter. Om forskarutbildningen och behoven i näringslivet kan matchas bättre, kommer det också att gynna universiteten. - Universiteten förstärker sin socioekonomiska påverkan om den utbildar arbetskraft som företagen verkligen behöver. Det är en tydlig win win-situation som alla parter tjänar på, säger Eloïse Germain-Alamartine.',
                                                                    'picture': "resources/images/news-money.jpg", 
                                                                    'date': '2020-04-21'
                                                                 } )

News2 = requests.post('http://localhost:5000/admin/news', json = {  'header': 'Det går inte att ställa in våren',
                                                                    'text': 'I fyra decennier har Linköpings Studentsångare hälsat våren med mösspåtagning på Borggården i Linköping. I år blir Valborg digitalt firad, med studentsångare och talare som alla kan följa på distans. Prick 15.00 börjar det.',
                                                                    'picture': "resources/images/news-newspaper.jpg", 
                                                                    'date': '2020-04-21'
                                                                 } )

News3 = requests.post('http://localhost:5000/admin/news', json = {  'header': 'Beslutsfattande i skuggan av en kris',
                                                                    'text': 'I det svenska samhället finns en tradition av att alltid ha en färdig plan för hur olika situationer ska hanteras. På så sätt kan genomtänkta och väl förankrade beslut fattas. När krisen slår till med en sådan hastighet som nu riskerar det svenska förhållningssättet till beslutsfattande att ställas på ända. På gott och ont.',
                                                                    'picture': "resources/images/news-parliament.jpg", 
                                                                    'date': '2020-04-21'
                                                                 } )

News4 = requests.post('http://localhost:5000/admin/news', json = {  'header': 'Kaffe, katter och lökchips',
                                                                    'text': 'Är det nödvändigt att skaffa sig katt för att göra hemtentor? – Nja, men den som ingen har kan ta en promenad, leta upp campuskatten och gosa en stund, säger Amanda Brämerson som för tillfället skriver på en hemtenta i specialpedagogik. Hon läser till gymnasielärare i svenska och religionshistoria på åttonde terminen, har hunnit med rätt många hemtentor och har ett lager av trivsamma och vettiga tips att komma med. Hemtentan ska vara något att se fram emot, menar du. Hur gör man det? – Genom att skämma bort sig under tiden man skriver. Inte tänka att belöningen ska komma när man är klar, det är tentandet i sig som ska vara mysigt.',
                                                                    'picture': "resources/images/news-retail.jpg", 
                                                                    'date': '2020-04-21'
                                                                 } )

News5 = requests.post('http://localhost:5000/admin/news', json = {  'header': 'LiU-student bakom flera Nobelklänningar',
                                                                    'text': 'Larisa Ibrahim är skräddare och mönsterkonstruktör, och har bland annat sytt utbildningsministerns Nobelklänningar tre gånger. Samtidigt läser hon till yrkeslärare vid Linköpings universitet.',
                                                                    'picture': "resources/images/news-newspaper.jpg", 
                                                                    'date': '2020-04-21'
                                                                 } )                                               

#------------------------------------------------------------------------------------------------------#



################################################## Omoss ################################################
omoss = requests.post('http://localhost:5000/admin/omoss', json = {  'english': 'LiU Store is a student association that was founded in September of 2008 and is run by students that strives to spread and strengthen the community of Linköping University. The association’s core business is to retail different kinds of merchandise using the university’s trademark. By getting involved in LiU Store students have the opportunity to be a part of a tight-knit group of students, with backgrounds from various types of studies. As an active member in the association you can enjoy dinner parties, activity nights and possibly form long-lasting friendships with your fellow members. LiU Store also offer students a great opportunity to put their theoretical knowledge to the test in a fun and engaging environment. When Kårallen open its gates to host the largest kravaller, LiU Store hosts events where students can buy a kravall-ticket together with selected products from the store. Information about these kinds of events as well as upcoming news about the association is continuously posted on this website! Are you interested in buying any of our products? Feel free to come by the store, which is located in Kårallen at Campus Valla in Linköping. We’re open every weekday from 11.00 to 14.00.  Welcome in!',
                                                                    'text': 'LiU Store är en studentförening som startades i september 2008 och drivs ideellt av studenter som brinner för att sprida och stärka gemenskapen på Linköpings universitet. Föreningen har som kärnverksamhet att bedriva försäljning av diverse profilprodukter underuniversitetets varumärke. Genom att engagera sig i LiU Store under sin studietid ges chansen att ingå i en fantastisk gemenskap med studenter från flera olika program där föreningens aktiva medlemmar går på sittningar, har aktivitetskvällar och skapar vänskapsband för livet. Utöver detta skapar föreningen en utmärkt möjlighet för studenter att praktisera sina teoretiska kunskaper i verkligheten. I samband med de största kravallerna anordnar LiU Store event där förköpsbiljetter kan köpas tillsammans med utvalda produkter. Mer information om dessa aktiviteter och övriga nyheter som rör föreningen publiceras löpande på hemsidan! Är du intresserad av att köpa några av våra produkter? Kom förbi butiken som ligger i Kårallen på Campus Valla i Linköping, där våra öppettider är vardagar mellan 11.00 och 14.00. Välkommen!',
                                                                    'picture': "resources/images/omoss-img.jpg",
                                                                 } )   
#------------------------------------------------------------------------------------------------------#


################################################## Coworkes ############################################
omoss = requests.post('http://localhost:5000/admin/coworkers', json = {  'header': 'Projektledare 1 - Julia Tao',
                                                                    'text': 'Julia har huvudansvar för den interna och externa informationen i föreningen. Henne kan du kontakta om du vill ingå ett föreningssamarbete, vill beställa varor till någon annan stad eller om du har frågor angående våra kampanjer och öppettider. Kan nås direkt via: <a href="mailto:projektledare1@liustore.se?">projektledare1@liustore.se</a>',
                                                                    'picture': "resources/images/Julia-Tao.jpeg",
                                                                 } )
omoss = requests.post('http://localhost:5000/admin/coworkers', json = {  'header': 'Projektledare 2 - Maria Öberg',
                                                                    'text': 'Maria har huvudansvaret för LiU Stores sortiment. Vid frågor angående produkter och föreningsbeställningar är hon rätt person att vända sig till. Kan nås direkt via: <a href="mailto:projektledare2@liustore.se?">projektledare2@liustore.se</a>',
                                                                    'picture': "resources/images/Maria-Oberg.jpeg",
                                                                 } )     
omoss = requests.post('http://localhost:5000/admin/coworkers', json = {  'header': 'Ekonomiansvarig - Olivia Magnusson',
                                                                    'text': 'Ekonomiansvariga är personerna som alltid har full koll på föreningens ekonomi. Tillsammans pushar Olivia och Victoria oss att nå upp till den satta försäljningsbudgeten och ser till att vår bokföring är fläckfri. Vid ekonomiska frågor som rör fakturor från LiU Store eller dylikt kan du kontakta Olivia eller Victoria. Kan nås direkt via: <a href="mailto:ekonomi@liustore.se?">ekonomi@liustore.se</a>',
                                                                    'picture': "resources/images/Olivia-Magnusson.jpg",
                                                                 } )                                                
omoss = requests.post('http://localhost:5000/admin/coworkers', json = {  'header': 'Marknadsansvarig - Tobias Wang',
                                                                    'text': 'Tobias är den person ser till att LiU Stores varumärke syns på campus. Han har även ansvar för campusvandringar under Nolle-p och förköpsförsäljningar. Vid frågor om marknadsföringssamarbeten, sponsring och allt annat som rör marknadsföring är Tobias rätt person att kontakta. Kan nås direkt via: <a href="mailto:marknad@liustore.se?">marknad@liustore.se</a>',
                                                                    'picture': "resources/images/Tobias-Wang.jpeg",
                                                                 } )                                                            
omoss = requests.post('http://localhost:5000/admin/coworkers', json = {  'header': 'Vice produktansvarig - Erik Malmros',
                                                                    'text': 'Erik bär tillsammans med Maria ansvaret för LiU Stores sortiment.',
                                                                    'picture': "resources/images/Erik-Malmros.jpeg",
                                                                 } )                                                                                                                                                                                                                                                                                                                                
#------------------------------------------------------------------------------------------------------#

################################################## References ############################################

Reference1 = requests.post('http://localhost:5000/admin/bulk-shop', json = {  'picture': "resources/images/reference1.jpg"} )

Reference2 = requests.post('http://localhost:5000/admin/bulk-shop', json = {  'picture': "resources/images/reference2.jpg"} )

                                                                 
#------------------------------------------------------------------------------------------------------#

################################################## OpeningHours ################################################

Öppet1 = requests.post('http://localhost:5000/admin/oppettider', json = {'day': 'Måndag - fredag', 
                                                                        'time' : '10 - 14'} )

Öppet6 = requests.post('http://localhost:5000/admin/oppettider', json = {'day': 'Lördag - söndag', 
                                                                        'time' : 'STÄNGT'} )


Öppet7 = requests.post('http://localhost:5000/admin/oppettider', json = {'day': 'pga Corona', 
                                                                        'time' : 'STÄNGT'} )

#------------------------------------------------------------------------------------------------------#                                                                      

################################################## Admin #########################################

Admin1 = requests.post('http://localhost:5000/admin/sign-up', json = {'username': 'admin', 
                                                                        'password' : 'admin'} )

#-------------------------------------------------------------------------------------------------------#



################################################## OrderHistory #########################################


OrderHistory1 = requests.post('http://localhost:5000/order', json = {   'name': 'Olivia', 
                                                                        'email': 'Olivia@liu.se', 
                                                                        'phone': '0739521969',
                                                                        'city': 'Linköping',
                                                                        'address': 'Parkgatan 2a',
                                                                        'ZIPcode': '78452',
                                                                        'apartmentnumber': '1303',
                                                                        'product': '1,tröja,röd,m,250,1,'
                                                                    } )

Ordrar = requests.get('http://localhost:5000/order')
print(Ordrar.text)

#-------------------------------------------------------------------------------------------------------#
