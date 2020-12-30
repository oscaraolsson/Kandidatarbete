
from flask_sqlalchemy import SQLAlchemy
from main import db, Color, Product, ProductType, Picture, Size, Category, News, Omoss, Coworker, Admin, OpeningHours

db.drop_all() # Drop all tables and data
db.create_all() # Create all tables

colors = ["red", "blue", "yellow"]
hexes = ["#FF0000", "#0695FF", "#FEFF06"]

for i in range(3):
    color = Color(colorID = i, hexcode = hexes[i], name=colors[i])
    db.session.add(color)


categories = ["clothes", "hoodies", "accessories"]

for i in range(3):
    category = Category(categoryID = i, categoryName= categories[i])
    db.session.add(category)

sizes = ["XS", "S", "M", "L", "XL"]

for i, sizename in enumerate(sizes):
    size = Size(sizeID = i, sizeName = sizename)
    db.session.add(size)

db.session.commit()

#print(Color.query.all())
#print(Category.query.all())

productType = ProductType(typeID=0, description="hejhej", name="Hoodie", price=99, buyableOnline=True)
for i in range(3):
    colorin = Color.query.filter_by(colorID=int(i)).first_or_404()
    print(colorin)
    productType.color.append(colorin)
    if i != 2: 
        c = Category.query.filter_by(categoryID=int(i)).first_or_404()
        print(c)
        productType.category.append(c)

for i in range(5):
    productType.size.append(Size.query.filter_by(sizeID=i).first_or_404())

db.session.add(productType)

for i in range(3):
    pic = Picture(picturePath="fawegfawe"+str(i), pictureColor=i, productType=i)
    db.session.add(pic)

db.session.commit()

producttypes = ProductType.query.all()
print(producttypes)

# Create products
for i, pt in enumerate(producttypes):
    for o, color in enumerate(pt.color):
        for p, size in enumerate(pt.size):
            #print("P ÄR", p)
            product = Product(inStock=10, color=o, size=p, productType=i)
            db.session.add(product)

# NEWS
news = News(text = "Brand i LIU stores lokaler natten till trosdag, en utbytestudent står talad för mordbrand", 
header = "LIU-store utsatt för mordbrand", 
picture = "resources/images/asso.png", 
date = "2020-04.03")
news1 = News(text = "Kassa stulen av I:are, behövde pengar att vaska för" , 
header = "Kassastöld", picture = "resources/images/asso.png", 
date = "2020-04.03")
db.session.add(news)
db.session.add(news1)
#---------------------

#Omoss
omoss = Omoss(text = "LiU Store är en studentförening som startades i september 2008 och drivs ideellt av studenter som brinner för att sprida och stärka gemenskapen på Linköpings universitet. Föreningen har som kärnverksamhet att bedriva försäljning av diverse profilprodukter underuniversitetets varumärke. Genom att engagera sig i LiU Store under sin studietid ges chansen att ingå i en fantastisk gemenskap med studenter från flera olika program där föreningens aktiva medlemmar går på sittningar, har aktivitetskvällar och skapar vänskapsband för livet. Utöver detta skapar föreningen en utmärkt möjlighet för studenter att praktisera sina teoretiska kunskaper i verkligheten. I samband med de största kravallerna anordnar LiU Store event där förköpsbiljetter kan köpas tillsammans med utvalda produkter. Mer information om dessa aktiviteter och övriga nyheter som rör föreningen publiceras löpande på hemsidan! Är du intresserad av att köpa några av våra produkter? Kom förbi butiken som ligger i Kårallen på Campus Valla i Linköping, där våra öppettider är vardagar mellan 11.00 och 14.00. Välkommen!" 
, picture = "omoss-img.jpg",
english = "LiU Store is a student association that was founded in September of 2008 and is run by students that strives to spread and strengthen the community of Linköping University. The association’s core business is to retail different kinds of merchandise using the university’s trademark. By getting involved in LiU Store students have the opportunity to be a part of a tight-knit group of students, with backgrounds from various types of studies. As an active member in the association you can enjoy dinner parties, activity nights and possibly form long-lasting friendships with your fellow members. LiU Store also offer students a great opportunity to put their theoretical knowledge to the test in a fun and engaging environment. When Kårallen open its gates to host the largest kravaller, LiU Store hosts events where students can buy a kravall-ticket together with selected products from the store. Information about these kinds of events as well as upcoming news about the association is continuously posted on this website! Are you interested in buying any of our products? Feel free to come by the store, which is located in Kårallen at Campus Valla in Linköping. We’re open every weekday from 11.00 to 14.00. Welcome in!"
)
db.session.add(omoss)
# ----------------------

#medarbetare 
cow = Coworker( header = "Stina Jonson, chef", picture = "http://localhost:5000/resources/images/asso.png", text = "Boss på den här jävla butiken")
cow1 = Coworker(header = "Bosse Butiksansvar", picture = "http://localhost:5000/resources/images/asso.png", text = "det är jag som har hand om butiken!")
cow2 = Coworker(header = "Erik ekonomi", picture ="http://localhost:5000/resources/images/asso.png", text = "budgetkingen.")
db.session.add(cow)
db.session.add(cow1)
db.session.add(cow2)
print (cow.header)
#print(Product.query.all())

####ADMIN
admin= Admin(username = "admin", password = "$2b$12$SaZSL21e1h8JpOcHdHbqU.HQIEjUr7QqdtLd5af2HbNPphbN7Yh8O")
db.session.add(admin)

open = OpeningHours(day="Måndag-Fredag", time = "11-14")
open1 = OpeningHours(day="Monday-Friday", time = "11-14")
open2 = OpeningHours(day="1 maj", time = "Stängt")
db.session.add(open)
db.session.add(open1)
db.session.add(open2)



db.session.commit()


# TODO: Skapa mer strukturerad testdata, ett bättre datagenereringsprogram
# /products (grid-view): En bild, Pris, Beskrivning, Namn, Om finns i lager, Om går att beställa online (eventuellt "standardstorlekens" lagersaldo (för "add to cart"-knapp i grid-view))
# /product/id (enskild vy): Samma som ovan + alla bilder, alla färger, alla storlekar, varje enskild version av produktens lagersaldo
# om går att beställa online eller ej
# Efteråt: fixa http-requests