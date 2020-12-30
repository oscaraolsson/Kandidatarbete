import smtplib, ssl, re


def mail(email, name, message, subject):

  port = 587  # For starttls
  smtp_server = "smtp.gmail.com"
  sender_email = "liustore.kundtjanst@gmail.com"
  receiver_email = email
  password = "TDDD83TDDD83"
  mess =str("Subject:"+name + ", "+ email +", " +subject +
  "\n \n"  +
  message)
  print(mess)
  context = ssl.create_default_context()
  with smtplib.SMTP(smtp_server, port) as server:
      server.ehlo()  # Can be omitted
      server.starttls(context=context)
      server.ehlo()  # Can be omitted
      server.login(sender_email, password)
      server.sendmail(sender_email, receiver_email, mess.encode("utf8"))


# mail("email", "name", "message", "subject")

def deliverymail(order):
  
  port = 587  # For starttls
  smtp_server = "smtp.gmail.com"
  sender_email = "liustore.kundtjanst@gmail.com"
  password = "TDDD83TDDD83"
  receiver_email = order.email
  product = order.product.split(',')
  print(product)
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