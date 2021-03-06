# You can try the app here:
[World of Warcraft Arena Stat Parser](https://arena-stat-parser.netlify.app/#/team-comps)


## Arena data visualization tool for WoW Burning Crusade classic
Ever wondered "what's our winrate against team comp X over the last Y play sessions?", "what percentage of rogues I faced over the last season were human?" and 
"is it just me, or does our performance really suffer on Blade's Edge arena?". This app makes answering these and many other questions a breeze.


## How to use
There are two ways to get data into the app:
- Application parses logs generated by [nova instance tracker](https://www.curseforge.com/wow/addons/nova-instance-tracker) add-on.
NIT log file ("NovaInstanceTracker.lua") can be found in {your_wow_folder}\\_classic\_\WTF\Account\{account_number}\SavedVariables.
If you plan on using app regularly, I'd recommend creating a shortcut for this folder.
- Alternatively, you can export backup file created in Arena stat parser itself. E.g - your
teammates can parse their own nova logs, then create backup file, and share it with you so
you can get data from matches where you DC'ed.

In order to upload either type of file, drag it to the bottom-left side of the screen, and drop it on expandable "Parse Log" area:

![img](https://i.imgur.com/qMcQSBW.png)

A gear icon below, opens storage management modal, where you can create backup, delete specific play sessions or clear all locally stored data at once.

Application has no back-end, or database. All data is stored locally in browser's local storage.
Which means that in order to use app on a second device you'll need to make a backup file and upload it on the second device.



### Match list
![Match List](https://i.imgur.com/b8tOuY1.png)

### Team composition stats
![Team composition stats](https://i.imgur.com/Z11sswv.png)

### Detailed matchup breakdown
![Detailed matchup breakdown](https://i.imgur.com/w0Lr7rd.png)

### Class stats
![Class stats](https://i.imgur.com/qLycKng.png)

### Rating change
![Rating Change](https://i.imgur.com/RHQYlqs.png)

### Local storage management
![LS management](https://i.imgur.com/FcN8zm2.png)