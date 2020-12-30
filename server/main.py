from flask import Flask, abort, jsonify, request, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
from pytz import timezone
import stripe
import os
import datetime
import pytz
import Levenshtein
import smtplib, ssl, re
""" from mail import mail, deliverymail """



# ######################################################
# # "pip install -r requirements.txt" for install requirements<3
## "pip install pytz", inte inlaggt i requirements.txt ännu 
# # localhost:5000 /route
#########################################
###DETTA ÄR FILEN DU KÖR!!!!!!!!###########
# ######################################################

app = Flask(__name__, static_folder='../client', static_url_path='/')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = "bhl83484$nojksndf@"
jwt = JWTManager(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

@app.errorhandler(Exception)
def page_not_found(error):
    return app.send_static_file("client.html")

@app.route("/")
def client():
    return app.send_static_file("client.html")

@app.route("/webbshop", methods = ['GET'])
def webbshopview():
    return app.send_static_file("client.html")

@app.route("/omoss", methods = ['GET'])
def omossview():
    return app.send_static_file("client.html")
 
@app.route("/foreningar", methods = ['GET'])
def bulkview():
    return app.send_static_file("client.html")

@app.route("/nyheter", methods = ['GET'])
def newsview():
    return app.send_static_file("client.html")

@app.route("/hem", methods = ['GET'])
def homeview():
    return app.send_static_file("client.html")

@app.route("/lager", methods = ['GET'])
def stockview():
    return app.send_static_file("client.html")

@app.route("/cart", methods = ['GET'])
def cartview():
    return app.send_static_file("client.html")

@app.route("/admin")
def admin():
    return app.send_static_file("admin/admin.html")

@app.route("/orderHistory")
def adminOrders():
    return app.send_static_file("client.html")




#################################
###Admin login är admin, admin####
##############################



####Stripe####
stripe.api_key = 'sk_test_Ljpp5ZDbadhFyjGlQLcUZIjU00A8JmBnEW'


@app.route('/create-payment-intent', methods=['POST'])
def create_payment():
    data = request.get_json(force=True)
    price = 0
    for i in data:
        if Product.query.filter_by(productID=int(i["id"])).first_or_404().inStock < i["quantity"]:
            abort(404,'Product not in stock')
    for i in data:
        price = price + ProductType.query.filter_by(typeID=int(i["id"])).first_or_404().price * i["quantity"]
        email = i["email"]
        setattr(Product.query.filter_by(productID=int(i["id"])).first_or_404(), 'inStock', Product.query.filter_by(productID=int(i["id"])).first_or_404().inStock - i["quantity"]),
        db.session.commit()
    intent = stripe.PaymentIntent.create(
        amount=int(str(price)+"00"),
        currency='sek',
        description='Ditt LiU Store köp',
        receipt_email=email,
    )

    try:
        return jsonify({'publishableKey': "pk_test_h6STxVuAARqR5Co1hj9spBek00nbShVX2P", 'clientSecret': intent.client_secret})
    except Exception as e:
        return jsonify(error=str(e)), 403


class Product(db.Model):
    __tablename__='Product'
    productID = db.Column(db.Integer, primary_key = True)
    inStock = db.Column(db.Integer, default=40)
    color = db.Column(db.Integer, ForeignKey('Color.colorID'), nullable=True)
    size = db.Column(db.Integer, ForeignKey('Size.sizeID'), nullable=True)
    productType = db.Column(db.Integer, ForeignKey('ProductType.typeID'), nullable=True)

    def __repr__(self):
        return '<Product {}: {} {} {} {}>'.format(self.productID, self.inStock, self.color, self.size, self.productType)

    def serialize(self):
        return dict(productID=self.productID, inStock=self.inStock, size=self.size, productType=self.productType, color=self.color)

class Color(db.Model): 
    __tablename__='Color'
    colorID = db.Column(db.Integer, primary_key = True)
    hexcode = db.Column(db.String, unique=True, nullable=False)
    name = db.Column(db.String, nullable=False)

    def __repr__(self):
        return '<Color {}: {} {}'.format(self.colorID, self.hexcode, self.name)

    def serialize(self):
        return dict(colorID=self.colorID, hexcode=self.hexcode, name=self.name)

class Category(db.Model):
        __tablename__='Category'
        categoryID = db.Column(db.Integer, primary_key = True)
        categoryName  = db.Column(db.String, nullable=False)

        def __repr__(self):
            return '<Category {}: {}'.format(self.categoryID, self.categoryName)
  
        def serialize(self):
            return dict(categoryID=self.categoryID, categoryName=self.categoryName)

class Size(db.Model):
        __tablename__='Size'
        sizeID = db.Column(db.Integer, primary_key = True)
        sizeName  = db.Column(db.String, unique= True, nullable=True)

        def __repr__(self):
            return '<Size {}: {}'.format(self.sizeID, self.sizeName)
  
        def serialize(self):
            return dict(sizeID=self.sizeID, sizeName=self.sizeName)


ptcolors = db.Table('ptcolors',
    db.Column('color_id', db.Integer, db.ForeignKey('Color.colorID'), primary_key=True),
    db.Column('producttype_id', db.Integer, db.ForeignKey('ProductType.typeID'), primary_key=True)
)
ptsizes = db.Table('ptsizes',
    db.Column('size_id', db.Integer, db.ForeignKey('Size.sizeID'), primary_key=True),
    db.Column('producttype_id', db.Integer, db.ForeignKey('ProductType.typeID'), primary_key=True)
)
ptcategories = db.Table('ptcategories',
    db.Column('category_id', db.Integer, db.ForeignKey('Category.categoryID'), primary_key=True),
    db.Column('producttype_id', db.Integer, db.ForeignKey('ProductType.typeID'), primary_key=True)
)
class ProductType(db.Model):
    __tablename__='ProductType'
    typeID = db.Column(db.Integer, primary_key=True)
    description =  db.Column(db.String, nullable = True)
    name = db.Column(db.String, nullable = True, unique=True)
    price = db.Column(db.Integer, nullable = False)
    buyableOnline = db.Column(db.Boolean, default = False)
    color = db.relationship('Color', secondary=ptcolors, lazy='subquery', backref=db.backref('producttypes', lazy=True))
    size = db.relationship('Size', secondary=ptsizes, lazy='subquery', backref=db.backref('producttypes', lazy=True))
    category = db.relationship('Category', secondary=ptcategories, lazy='subquery', backref=db.backref('producttypes', lazy=True))
    picture = db.relationship('Picture', backref='producttype', lazy=True)
    def __repr__(self):
        return '<ProductType {}: {} {} {} {} {} {} {} {}'.format(self.typeID, self.description, self.name, self.price, self.buyableOnline, self.color, self.size, self.category, self.picture)

    def serialize(self):
        return dict(typeID=self.typeID, description=self.description, name=self.name, price=self.price, canOrder=self.buyableOnline, color=self.color, size=self.size, category=self.category, picture=self.picture)
class Picture(db.Model):
        __tablename__='Picture'
        picturePath = db.Column(db.String, unique=False, nullable=True)
        pictureColor = db.Column(db.Integer, ForeignKey('Color.colorID'), primary_key=True, nullable=True)
        productType = db.Column(db.Integer, ForeignKey('ProductType.typeID'), primary_key=True, nullable=True)


        def __repr__(self):
            return '<Picture {} {} {}'.format(self.picturePath, self.productType, self.pictureColor)
  
        def serialize(self):
            return dict(picturePath=self.picturePath, pictureColor=self.pictureColor, productType=self.productType)

class OrderHistory(db.Model):
    __tablename__='OrderHistory'
    ID = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String, nullable= False)
    name = db.Column(db.String, nullable=False)     #Vi borde kunna hämta fullständigt namn från det stripe returnerar? 
    email = db.Column(db.String, nullable=False)    #Hämta från input i "checkout" sidan
    phone = db.Column(db.String, nullable=False)    #Hämta från input i "checkout" sidan
    city = db.Column(db.String, nullable=False)     #Hämta från input i "checkout" sidan
    address = db.Column(db.String, nullable=False)  #Hämta från input i "checkout" sidan
    ZIPcode = db.Column(db.Integer, nullable=False) #Hämta från input i "checkout" sidan
    apartmentnumber = db.Column(db.Integer, nullable=False)
    product = db.Column(db.String, nullable=False)
    shipped = db.Column(db.Boolean, default=False)

    # products = db.relationship('Product', backreg='OrderHistory', nullable=True, lazy=True)

    def __repr__(self):
            return '<Order {} {} {} {} {} {} {} {} {} {} {}'.format(self.ID, self.date, self.name, self.email, self.phone, self.city, self.address, self.ZIPcode, self.apartmentnumber, self.product, self.shipped)
    
    def serialize(self):
            return dict(product = self.product, ID=self.ID, date=self.date, name=self.name, email=self.email, phone=self.phone, city=self.city, address=self.address, ZIPcode=self.ZIPcode, apartmentnumber=self.apartmentnumber, shipped=self.shipped)


#--------------------------------------------------------------------------------------------------------------------------------

#class Omoss
class Omoss(db.Model):
    __tablename__='Omoss'
    omossID = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String, nullable=False)
    english = db.Column(db.String, nullable=False)
    picture = db.Column(db.String, nullable=False)

    def serialize(self) :
        return dict(text=self.text, english=self.english, picture=self.picture)

class Admin(db.Model):
    __tablename__='admin'
    adminID = db.Column(db.Integer, primary_key = True)       
    username = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf8')
        return "password set"

    def serialize(self):
        return dict(id=self.adminID, username=self.username)

    def serializeandtoken(self):
        return dict(token=jwt._create_access_token(self.adminID), admin=self.serialize())

class Coworker(db.Model):
    __tablename__='Coworker'
    coworkerID = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String, nullable=False)
    header = db.Column(db.String, nullable=False)
    picture = db.Column(db.String, nullable=False)

    def serialize(self) :
        return dict(coworkerID=self.coworkerID, text=self.text, picture=self.picture, header =self.header)


#Class news
class News(db.Model):
    __tablename__='News'
    newsID = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String, nullable=False)
    header = db.Column(db.String, nullable=False)
    date = db.Column(db.String, nullable = False)
    picture = db.Column(db.String, nullable=False)

    def serialize(self):
        return dict(text=self.text, date=self.date, picture=self.picture, header =self.header, newsID=self.newsID)

class OpeningHours(db.Model):
    __tablename__='Openinghours'
    ID = db.Column(db.Integer, primary_key = True)
    day = db.Column(db.String, nullable=False)
    time =  db.Column(db.String, nullable=False)

    def serialize(self) :
        return dict(day =self.day, time=self.time, ID =self.ID)

class Reference(db.Model):
    __tablename__='Reference'
    referenceID = db.Column(db.Integer, primary_key = True)
    picture = db.Column(db.String, nullable=False)

    def serialize(self):
        return dict(picture=self.picture, referenceID=self.referenceID)

#-----------------------------------------------------------------

#------------------- Test Route OrderHistory ---------------------

@app.route("/order", methods =['GET', 'POST'])
def order():
    if request.method == 'GET':
        list =[]
        for x in OrderHistory.query.all():
            list.append(x.serialize())
        return jsonify(list)
    elif request.method == 'POST':
        newOrder = OrderHistory(name = request.get_json()['name'],
        date = datetime.datetime.now(),
        email = request.get_json()['email'],
        phone = request.get_json()['phone'],
        city = request.get_json()['city'],
        address = request.get_json()['address'],
        ZIPcode = request.get_json()['ZIPcode'],
        apartmentnumber = request.get_json()['apartmentnumber'],
        product = request.get_json()['product'])
        #newOrder = OrderHistory(name=name, email=email, phone=phone, city=city, address=address, 
        #                         ZIPcode=ZIPcode, apartmentnumber=apartmentnumber, product=product)
        db.session.add(newOrder)
        db.session.commit()
        return ("Order med ID " + str(newOrder.ID) + " lades till.")
    
@app.route("/order/<int:ID>", methods =['PUT', 'DELETE', 'GET'])
def specificorder(ID):
    if request.method == 'DELETE':
        order = OrderHistory.query.filter_by(ID=ID).first_or_404()
        db.session.delete(order)
        db.session.commit()
        return ("Togs bort")
    if request.method == 'PUT':
        order = OrderHistory.query.filter_by(ID=ID).first_or_404()
        setattr(order, 'name',request.get_json()['name'])
        setattr(order, 'email', request.get_json()['email'])
        setattr(order, 'phone', request.get_json()['phone'])
        setattr(order, 'city',request.get_json()['city'])
        setattr(order, 'address', request.get_json()['address'])
        setattr(order, 'ZIPcode', request.get_json()['ZIPcode'])
        setattr(order, 'apartmentnumber', request.get_json()['apartmentnumber'])
        setattr(order, 'product', request.get_json()['product'])
        db.session.commit()
        return ("Produkten har uppdaterats")
    if request.method == 'GET':
        order = OrderHistory.query.filter_by(ID=ID).first_or_404()
        return jsonify(order.serialize())    
    
    
@app.route("/admin/shipped/<int:ID>", methods =['PUT'])
def shippedorder(ID):
    if request.method == 'PUT':
        data = request.get_json()['shipped']
        order = OrderHistory.query.filter_by(ID=ID).first_or_404()
       
        setattr(order, 'shipped', data)
        db.session.commit()
        if data==0:
            #TODO: Fixa detta mail också???
            print(0)
        elif data==1:
            print(1)
            mail.deliverymail(order)
        return ("ordern är nu satt till 'Skickad'")


#------------------------- Routes ----------------------------------------

@app.route("/admin/webshop", methods = ['POST'])
#@jwt_required
def adminproductpost():
    if request.method == 'POST':
        data = request.get_json(force=True)
        # Add color(s) if doesn't exist
        current_colors = [c.name for c in Color.query.all()]
        for i, color in enumerate(data['colornames']):
            if color not in current_colors:
                #abort if not hexcode:
                if len(data['colors'][i]) != 7 or data['colors'][i][0] != '#':
                    abort(404)
                new_color = Color(hexcode=data['colors'][i], name=color)
                db.session.add(new_color)
        
        # add category/ies if doesn't exist
        current_categories = [c.categoryName for c in Category.query.all()]
        for i, category in enumerate(data['categories']):
            if category not in current_categories:
                new_category = Category(categoryName=category)
                db.session.add(new_category)

        # add size(s) if doesn't exist
        current_sizes = [s.sizeName for s in Size.query.all()]
        for i, size in enumerate(data['sizes']):
            if size not in current_sizes:
                new_size = Size(sizeName=size)
                db.session.add(new_size)

        # cannot add picture yet, as it needs producttype id as PK. Add producttype now instead
        # current_product_types = [pt[0] for pt in ProductType.query.all().values('typeID')]
        new_product_type = ProductType(name=data['name'], description=data['description'], price=data['price'], buyableOnline=data['canOrder'])
        for color in data['colors']:
            new_product_type.color.append(Color.query.filter_by(hexcode=color).first())
        for category in data['categories']:
            new_product_type.category.append(Category.query.filter_by(categoryName=category).first())
        for size in data['sizes']:
            new_product_type.size.append(Size.query.filter_by(sizeName=size).first())

        new_product_type_id = new_product_type.typeID

        for i, picture in enumerate(data['pictures']):
                new_picture = Picture(picturePath=picture, pictureColor=data['colors'][i], productType=new_product_type_id)
                db.session.add(new_picture)
                new_product_type.picture.append(new_picture)
            
        # Now that product_type has all attributes assigned, we add it to the database
        db.session.add(new_product_type)

        # All that's left is to create all the corresponding Products:
        list_of_products = []
        for size in data['sizes']:
            for color in data['colors']:
                newc = Color.query.filter_by(hexcode=color).first().colorID
                news = Size.query.filter_by(sizeName=size).first().sizeID
                new_product = Product(inStock=40, color=newc, size=news, productType=new_product_type_id)
                list_of_products.append(new_product)
                db.session.add(new_product)
        
        db.session.commit()
        return "success"

@app.route("/admin/webshop/<ptname>", methods = ['DELETE', 'PUT'])
def editpt(ptname):
    if ptname.isdigit():
        pt = ProductType.query.filter_by(typeID=ptname).first_or_404()
    elif isinstance(ptname, str):
        if '+' in ptname:
            ptname = ptname.replace('+', ' ')
        pt = ProductType.query.filter_by(name=ptname).first_or_404()
    if request.method == 'DELETE':
        ptid = pt.typeID
        pictures = Picture.query.filter_by(productType=ptid).all()
        p = Product.query.filter_by(productType=ptid).all()
        for picture in pictures:
            db.session.delete(picture)
        for product in p:
            db.session.delete(product)
        db.session.delete(pt)
        db.session.commit()
        return jsonify(success=True)

    elif request.method == 'PUT':
        # Currently: Can only change name, price, desc, canOrder
        data = request.get_json(force=True)
        datakeys = data.keys()
        unallowed = ['picture', 'color', 'size', 'category']
        descriptions = [str(string).replace('ProductType.', '') for string in ProductType.__table__.columns]
        for key in datakeys:
            if key in descriptions and key not in unallowed:
                setattr(pt, key, data[key]) 
        
        db.session.commit()
        return "success" 


@app.route("/admin/webshop/all", methods = ['DELETE'])
#@jwt_required
def deleteall():
    if request.method == 'DELETE':
        ProductType.query.delete()
        Product.query.delete()
        Picture.query.delete()
        Size.query.delete()
        Color.query.delete()
        Category.query.delete()

        db.session.commit()
        db.engine.execute("DELETE FROM ptcolors;")
        db.engine.execute("DELETE FROM ptsizes;")
        db.engine.execute("DELETE FROM ptcategories;")
        db.session.commit()
        
        return "success"
        
####Takes: 'header' : String, 'text': String, 'picture': STRING
####Returns: String
@app.route("/admin/news", methods = ['POST'])
#@jwt_required
def adminnews():
 if request.method == 'POST':
    news = News(header = request.get_json()['header'],
    text = request.get_json()['text'],
    picture = request.get_json()['picture'],
    date = request.get_json()['date'])
    db.session.add(news)
    db.session.commit()
    return (news.header + " lades till bland nyheter.")

####Route takes: newsID
####Takes: 'header, 'text', 'picture'
####returns String (of info)
@app.route("/admin/news/<int:newsID>", methods = ['PUT', 'DELETE'])
#@jwt_required
def adminnewsarticle(newsID):
  if request.method =='PUT':
        data = request.get_json(force=True)
        word_list = ['header', 'text', 'picture']
        news = News.query.filter_by(newsID = newsID).first_or_404()
        for c in word_list:
            if data and c in data:
                setattr(news, c, data[c])
            local_object = db.session.merge(news)
            db.session.add(local_object)
            db.session.commit()

        return (news.header + " har uppdaterats.")

  elif request.method == 'DELETE' :
        news = News.query.filter_by(newsID = newsID).first_or_404()

        local_object = db.session.merge(news)
        db.session.delete(local_object)
        db.session.commit()
        return (news.header + " har tagits bort.")

#    For FUNCTION (POST (/admin/signin)
#    Allows user to login as Admin
#    @pINparam {(username, password), String:username; String: password; 
#    @return {success or 404}
#    @instance
@app.route ('/admin/signin', methods= ['POST'])
def signin(): 
    if request.method == 'POST':
        data = request.get_json(force=True)
        username = data['username']
        password = data['password']
        admin = Admin.query.filter_by(username = username).first_or_404(description = 'Felaktigt användarnamn')        
        isValid = bcrypt.check_password_hash(admin.password, password)
        if isValid:
            #access_token = create_access_token(admin.adminID)
            #temp = {"token": access_token, "Admin": {"username": admin.username}}
            return jsonify(admin.serializeandtoken()), 200
        else:
            return (404)

#Used for testing. Only accessible via postman
@app.route('/admin/sign-up', methods=['POST'])
def signup():
    if request.method == 'POST':
        data = request.get_json()
        admin = Admin(username=data["username"])
        admin.set_password(data["password"])
        db.session.add(admin)
        db.session.commit()
        return "200"

###return list of dict: {product ID: int, 'size': String, 'color': String, 'productType': String} Returns astetic names of last three params.
@app.route("/admin/lager" , methods= ['GET'])
#@jwt_required
def lager():
     if request.method =='GET' :
        list = []
        for p in Product.query.all() :
            s = Size.query.filter_by(sizeID = p.size).first_or_404()
            c = Color.query.filter_by(colorID = p.color).first_or_404()
            pt = ProductType.query.filter_by(typeID = p.productType).first_or_404()

            dict = {"ID":p.productID, "inStock": p.inStock, "size": s.sizeName, "color" : c.name,
             "productType": pt.name }  
            list.append(dict)
     return jsonify(sorted(list, key = lambda i: (i['productType'], i['color']),reverse=True))
     
## Route in param: productID: int
#TAKES 'number in stock' : INTEGER
#RETURNS STRING (info)
@app.route("/admin/lager/<int:productID>" , methods= ['PUT'])
#@jwt_required
def lagerspec(productID):

    if request.method == 'PUT' :
        pro = Product.query.filter_by(productID = productID).first_or_404()
        setattr(pro, 'inStock', request.get_json()['inStock'])
        db.session.commit()

        """
        Om inte funkar, ta bort db.session.commit() och ta det här istället

        local_object = db.session.merge(pro)
        db.session.add(local_object)
        db.session.commit()
        """

    return (str(pro.inStock) + " st finns i det uppdaterade lagersaldot")

## Takes: 'text': String
### returns: String (info)
@app.route ('/admin/omoss', methods= ['PUT', 'POST' ])
#@jwt_required
def adminomoss():
        if request.method == 'PUT':
                omo = Omoss.query.all()
                omoss = omo[0]
                setattr(omoss, 'text', request.get_json()['text'])
                setattr(omoss, 'english', request.get_json()['english'])
                db.session.commit()
                return ("Det är uppdaterat :)")
        elif request.method =='POST':
            omoss = Omoss(text = request.get_json()['text'],
            english = request.get_json()['english'],
            picture = request.get_json()['picture'])
            db.session.add(omoss)
            db.session.commit()
            return ("Om oss-info lades till")        
        """
        Om inte funkar, ta bort db.session.commit() och ta det här istället

        local_object = db.session.merge(pro)
        db.session.add(local_object)
        db.session.commit()
        """



##### takes: 'header': String, 'text': String, 'picture': String
####Returns: String (info)
@app.route("/admin/coworkers", methods = ['POST'])
#@jwt_required
def admincoworkers():
 if request.method == 'POST':
        picture = request.get_json()['picture']
        coworker = Coworker(header = request.get_json()['header'],
        text = request.get_json()['text'],
        picture =  picture)
        if picture == "" :
            setattr(coworker, 'picture', "resources/images/placeholder.png")
        db.session.add(coworker)
        db.session.commit()
        return (coworker.header + " lades till bland medarbetare.")

####Route takes: coworkerID: Integer
#### PUT Takes: {'header': String, 'text': String, 'picture': String
#### Both Return String (info)
@app.route("/admin/coworkers/<int:coworkerID>", methods = [ 'PUT', 'DELETE'])
#@jwt_required
def admincoworker(coworkerID):
 if request.method =='PUT':
        coworker = Coworker.query.filter_by(coworkerID = coworkerID).first_or_404()
        setattr(coworker, 'header', request.get_json()['header'])
        setattr(coworker, 'text', request.get_json()['text'])
        img = request.get_json()['picture']
        if img != "" :
            setattr(coworker, 'picture', img)
        db.session.commit()
        return (coworker.header + " har uppdaterats.")

 elif request.method == 'DELETE':
        coworker = Coworker.query.filter_by(coworkerID = coworkerID).first_or_404()
        db.session.delete(coworker)
        db.session.commit()
        return (coworker.header + " har tagits bort, tack for din tid <3")

@app.route ("/admin/oppettider", methods =['POST'])
#@jwt_required
def adminhours():
    if request.method == 'POST':
        hour = OpeningHours(day = request.get_json()['day'],
        time = request.get_json()['time'])
        db.session.add(hour)
        db.session.commit()
        return (hour.day + " lades till i öppettiderna.")

@app.route ("/admin/oppettider/<int:ID>", methods =['PUT', 'POST', 'DELETE'])
#@jwt_required
def adminhour(ID):
    times = OpeningHours.query.filter_by(ID = ID).first_or_404()
    if request.method == 'PUT':
        # times = OpeningHours.query.filter_by(ID = ID).first_or_404()
        setattr(times, 'day', request.get_json()['day'])
        setattr(times, 'time', request.get_json()['time'])


    elif request.method == 'DELETE' : 
        db.session. delete(times)
    db.session.commit()
    return("deleted")

#RETURNS LIST OF DICT {'ID': pt.typeID, 'name': pt.name, 'price': pt.price, 'canOrder': pt.buyableOnline, 
#'image': listofproducttypes[0].picture[0].picturePath, 'categories': categories, 'color': colors, 'size': sizes}
@app.route("/products", methods = ['GET'])
def webbshop():
 if request.method == 'GET':
        listofproducttypes = ProductType.query.all() #returns list of dicts
        allproducts = []
        
        for pt in listofproducttypes:
            categories = [c.serialize() for c in pt.category]
            colors = [x.serialize() for x in pt.color]
            sizes = [y.serialize() for y in pt.size]
            allproducts.append({'ID': pt.typeID, 'name': pt.name, 'price': pt.price, 'canOrder': pt.buyableOnline, 
                                'image': pt.picture[0].picturePath, 'categories': categories, 'color': colors, 'size': sizes})

        return jsonify(allproducts)

@app.route("/products/search/<myString>", methods = ['GET'])
def webbshopsearch(myString):
 if request.method == 'GET':
        myString = myString.lower()
        if myString == 'allt':
            myString = 'kläder accessoarer märken'
        listofproducts= []
        all = ProductType.query.all()
        for word in myString.split():
            if word == 'marinblå':
                word = 'mörkblå'
            if word == 'flaska' or word == 'butelj' or word == 'bottle':
                word = 'vattenflaskaaa'
            if word == 'rygga' or word == 'bag' or word == 'backpack':
                word = 'väska'
            if word == 'flame' or word == 'flammish':
                word = 'flamman'
            if word == 'lambo':
                word = 'labohov'    

            for x in all:
                diff = Levenshtein.ratio(x.name.lower(), word.lower())
                if diff>0.53:
                    print(word , x.name, diff, 'la till! namn')
                    listofproducts.append(x)
                for words in x.description.split():
                    diff=Levenshtein.ratio(words.lower(),word.lower())
                    if diff >0.80:
                        print(word ,words, diff,'la till! beskrivnging')
                        listofproducts.append(x)
                        break
                for i in x.category:
                    diff = Levenshtein.ratio(i.categoryName.lower(), word.lower())                
                    if  diff > 0.53  :
                        print(word ,i.categoryName, diff,'la till kategori!')
                        listofproducts.append(x)
                        break

                for i in x.color:
                    diff = Levenshtein.ratio(i.name.lower(), word.lower())
                    if diff > 0.70 :
                        print(word ,i.name, diff,'la till färg!')
                        listofproducts.append(x)
                        break
        noDoubles = []
        allproducts = []
        for pt in listofproducts:
            k = 0
            for x in noDoubles:
                if pt.typeID == x:
                    k = 1
            if k!=1:
                noDoubles.append(pt.typeID)
                categories = [c.serialize() for c in pt.category]
                colors = [x.serialize() for x in pt.color]
                sizes = [y.serialize() for y in pt.size]
                allproducts.append({'ID': pt.typeID, 'name': pt.name, 'price': pt.price, 'canOrder': pt.buyableOnline, 
                                    'image': pt.picture[0].picturePath, 'categories': categories, 'color': colors, 'size': sizes})

        return jsonify(allproducts)


#RETURNS dict, {name: str, price: int, canOrder: bool, instock: {string:int}, colors: [Color], pictures: [str] sizes: [str],}
@app.route("/products/<int:producttype_id>", methods = ['GET'])
def product(producttype_id):
    if request.method == 'GET':
        product = dict()
        product['id'] = producttype_id
        product['sizes'] = []
        product['instock'] = dict()
        producttype = ProductType.query.filter_by(typeID=producttype_id).first_or_404() # throw error?
        product['description'] = producttype.description
        products = list(Product.query.filter_by(productType=producttype_id).all())
        pictures = list(producttype.picture)
        colors = list(producttype.color)
        sizes = list(producttype.size)
        # add colors and pictures in same order, all sizes, and a dict with instock ints
        for i in range(len(colors)):
            color = colors[i]
            product.setdefault('colors', []).append(color.serialize())
            for p in pictures:
                if p.pictureColor==color.hexcode:
                    product.setdefault('pictures', []).append(p.picturePath)
                    break

        for o in range(len(sizes)):
            size = sizes[o]
            product.setdefault('sizes', []).append(size.serialize())
        
        # add the rest of the data
        product['name'] = producttype.name
        product['price'] = producttype.price
        product['canOrder'] = producttype.buyableOnline
        return jsonify(product)

@app.route("/products/<int:producttype_id>/<int:color_id>_<int:size_id>", methods = ['GET'])
def getStockProduct(producttype_id, color_id, size_id):
    product = Product.query.filter_by(productType=producttype_id, size=size_id, color=color_id).first_or_404()
    color = Color.query.filter_by(colorID=color_id).first_or_404()
    size = Size.query.filter_by(sizeID=size_id).first_or_404()
    pt = ProductType.query.filter_by(typeID=producttype_id).first_or_404()
    price = pt.price
    name = pt.name
    picture = Picture.query.filter_by(pictureColor=color.hexcode, productType=producttype_id).first_or_404().picturePath
    return jsonify({'name':name, 'product':product.serialize(), 'color':color.serialize(), 'size':size.serialize(), 'price':price, 'picture':picture})


#############################Bulk###########################################


@app.route("/user/bulk-shop", methods = ['GET'])
def bulk():
    if request.method == 'GET':
        list = []
        for x in Reference.query.all():
            list.append(x.serialize())
        return jsonify(list)

@app.route("/admin/bulk-shop", methods = ['POST'])
#@jwt_required
def adminbulk():
    if request.method == 'POST':
        reference = Reference(picture = request.get_json()['picture'])
        db.session.add(reference)
        db.session.commit()
        return "En ny omdömes-bild lades till bland omdömena."


@app.route("/admin/bulk-shop/<int:referenceID>", methods = ['DELETE'])
#@jwt_required
def adminbulkreference(referenceID):
    if request.method == 'DELETE' :
        reference = Reference.query.filter_by(referenceID = referenceID).first_or_404()
        
        local_object = db.session.merge(reference)
        db.session.delete(local_object)
        db.session.commit()
        return "Omdöme med id " + str(referenceID) + " har tagits bort."



############################################################################




#RETURNS list of dict {'header' : String, 'text': String, 'picture' : String, 'date' : String}
@app.route("/user/news", methods = ['GET'])
def news():
 if request.method == 'GET':
        list =[]
        news = News.query.all()
        for x in reversed(News.query.all()):
            list.append(x.serialize())
        return jsonify(list)

#RETURNS List of dict dict in listindex 0 = Omoss, following [1:...] = Coworkers 
# omOSS {text:String, picture: String}
# coworkers {'header' : String, 'text': String, 'picture' : String}

@app.route ('/user/omoss', methods= ['GET'])
def useromoss():
  if request.method == 'GET':
      list = []
      omoss = Omoss.query.all()
      list.append(omoss[0].serialize())
      for x in Coworker.query.all():
        list.append(x.serialize())
      return jsonify(list)
#### Returns list of opening hours!
@app.route ("/user/oppettider", methods =['GET'])
def useropeninghours():
    if request.method == 'GET':
        list = []
        for x in OpeningHours.query.all():
            list.append(x.serialize())
    
        return jsonify(list)

@app.route ("/user/kontakt", methods = ['PUT'])
def maila():
    if request.method == 'PUT':
        name= request.get_json()['name']
        email =request.get_json()['email']
        message = request.get_json()['message']
        subject = request.get_json()['subject']
        mail(email,name,message,subject)
    return ("ditt meddelande är skickat och vi återkommer så snart vi kan")
 
@app.route ("/user/bulk-shop", methods = ['PUT'])
def maila2():
    if request.method == 'PUT':
        name = request.get_json()['name']
        email =request.get_json()['email']
        message = request.get_json()['message']
        subject = request.get_json()['subject']
        mail(email,name,message,subject)
    return ("ditt meddelande är skickat och vi återkommer så snart vi kan")



def mail(email, name, message, subject):

  port = 587  # For starttls
  smtp_server = "smtp.gmail.com"
  sender_email = "liustore.kundtjanst@gmail.com"
  receiver_email = "liustore.kundtjanst@gmail.com"
  password = "TDDD83TDDD83"
  mess =str("Subject:"+name + ", "+ email +", " +subject +
  "\n \n"  +
  message)
  context = ssl.create_default_context()
  with smtplib.SMTP(smtp_server, port) as server:
      server.ehlo()  # Can be omitted
      server.starttls(context=context)
      server.ehlo()  # Can be omitted
      server.login(sender_email, password)
      server.sendmail(sender_email, receiver_email, mess.encode("utf8"))
  return ("hejeh")

# mail("email", "name", "message", "subject")

def deliverymail(order):
  
  port = 587  # For starttls
  smtp_server = "smtp.gmail.com"
  sender_email = "liustore.kundtjanst@gmail.com"
  password = "TDDD83TDDD83"
  receiver_email = order.email
  product = order.product.split(',')
  subject = 'Din order från LiU Store är skickad!'
  message = str('Hej '+ order.name +'!\n\nDin order av följande produkter:\n\n')
  for i in range(int(len(product)/6)):
    message += str("Produkt: "+product[i*6+1] + "\nFärg: "+product[i*6+2]+", Storlek: "+product[i*6+3]+"\nPris/st: " +product[i*6+4]+"kr, antal: " + re.sub("\D", "", product[i*6+5]) +"\n")
 
  message += "\när nu behandlad och har skickats till dig från vårt lager! Adressen du angivit är:\n"
  message += order.address + "\n" + str(order.ZIPcode) + " " + order.city + "\n"

  message += "\nBästa hälsningar,\nLiU Store" 

  sendmessage = str("Subject:"+subject+"\n\n" + message)
  context  =ssl.create_default_context()
  with smtplib.SMTP(smtp_server, port) as server:
    server.ehlo()  # Can be omitted
    server.starttls(context=context)
    server.ehlo()  # Can be omitted
    server.login(sender_email, password)
    server.sendmail(sender_email, receiver_email, sendmessage.encode("utf8")) 

if __name__ == "__main__":
    app.run(debug=True)