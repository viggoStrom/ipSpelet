#Bug Report

Detta spel har ett stort fel. Med JS kan man injecera IP-addresser direkt in i textrutorna som är synliga men även dem som är dolda. 
När man skickar in resultatet kollar servern på de dolda textrutorna och inte den synliga texten även i dem fallen där vissa rutor redan är bestämda. 
Därmed, ifall man sätter värdena i alla textrutorna till något som är korrekt ex:
IP = 1.0.0.1
Nätmask = 255.0.0.0
Gateway = 1.0.0.0
Nät ID = 1.0.0.0
Servern tycker det är rätt oavsett vad som ursprungligen stod i rutorna.

Vår bot har därmed flera toppositioner på leaderboarden.
