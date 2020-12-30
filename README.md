# TDDD83 Kandidatprojekt

Välkommen till grupp 1:s gitlab-sida!

**Länkar till verktyg som gruppen använder**
*  En mer specifik git-guide som beskriver arbetsflödet i detalj: https://docs.google.com/document/d/1MOWy0lWZ3rQfq8ReEJDprdIB_OWixqxXH13scJWkypc/edit?usp=sharing
*  Trello: https://trello.com/grupp1kandidatarbetetddd83
*  Overleaf: https://www.overleaf.com/6217845458bjfqddxkvbhd
*  Mindmap förslag/idéer inför utvecklingen: https://app.creately.com/diagram/DXyZ3zpvEj7/view

**Vi använder Trello för uppgifter som gäller kandidatarbetet (rapportskrivning, dokument, etc), och GitLabs interna "issues"-hantering för utvecklingsprojektet**

**För att se/redigera/fördela uppgifter inom utvecklingsprojektet, tryck på "Issues"-knappen i menyn till vänster**

# Metodik för versionshantering (förslag)

**Feature branching**
* Master-branch existerar som en branch där det alltid finns en fungerande version på. Man mergar bara till denna branch efter varje iteration av projektet.
* Development branch existerar som en branch som man alltid utgår ifrån, det är i Development branch den senast fungerande versionen finns.
* När en feature(issue) börjar arbetas på, brancha från development-branchen till en personlig branch för den feature du ska arbeta med. Brancha från en så ny version av development som möjligt.
* Testa din feature när du är klar, antingen mha **Jenkins** eller manuell testing (bestäm inom gruppen)
* Om det behövs/känns som att det behövs, be kodgranskare att kolla koden innan du mergar med development branch
* Om koden inte fungerar med nuvarande development branch (t.ex om en annan gruppmedlem pushat sina ändringar innan och de skiljer sig från master branchen du branchade ifrån): fixa så att din branch fungerar med den nya development-versionen och testa + merga igen.

* För att metodiken som beskrivs ovan ska fungera krävs att alla mergar med master regelbundet, helst flera gånger under en "kod-session". På detta sätt minimeras risken för att er version skiljer sig för mycket från development för att fungera som den ska.
* **MERGA ALLTSÅ ALDRIG MED MASTER!**

![](dev_info/featurebranching.jpg)


# Git-kommandon


*  git branch -a - visa alla branches (lokala) 
*  git fetch --all - visa alla branches på remote repos (gitlab-servern)
*  git checkout -b "branchnamn" - byt till ny branch med namn "branchnamn". DÖP BRANCHEN TILL DEN ISSUE-NUMMER NI ARBETAR PÅ (t.ex Erik13 om Erik jobbar på issue nr 13). Skapar man en branch på det här sättet blir det en **lokal** branch, om man vill att den ska hamna i online-reposet använder man git push origin "branchnamn".
*  (man kan skapa nya branches direkt i GitLab också)
*  git checkout "existerande branch" - byt till en existerande branch (t.ex för att byta till master: "existerande branch" = origin/master)
*  origin är ett sätt att skriva att skriva att man vill åt remote-reposet (gitlab i vårt fall)
*  för att deleta en remote branch, skriv git push "remotenamn" --delete "branchnamn" (där "remote-namn" är origin, eller hela namnet på reposet om man känner för det: git@gitlab.liu.se:erilu186/tddd83-kandidatprojekt.git)
*  för att deleta en local branch, git branch -d "branchnamn"
*  git pull
*  git commit -m "meddelande"
*  git push 


**ARBETSMETODIK & FILSTRUKTUR**

# Filstruktur
* Varje view motsvarar en subfolder i klientmappen, med motsvarande css, html o js-fil
* Se client.html för exempel på hur dessa filer inkluderas i startsidan
