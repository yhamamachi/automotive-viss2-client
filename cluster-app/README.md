# cluster-app

## Preview image

![](cluster.gif)

## How to run cluster app

```
npm install
npm start
```
Then, please access via web browser.

## How to deploy cluster app

```
npm install
npm run build
```
All necessary files are stored in to "build" directory.

Ex.) Launch server by python3
```
cd <path/to/build>
python3 -m http.server <PortNum>
```


## How to check license of dependencies package

```
npm install
npm run license
```
Please see package-license.csv

### Show unique license list

```
tail -n +2 package-license.csv| cut -d',' -f2 | sort | uniq
```

### Free components list using in this repository

- public/img/Fuel.svg
  - Public Domain(Get from wikimedia https://commons.wikimedia.org/wiki/File:Fuel.svg)
- public/sound/beep.mp3(converted from ogg file)
  - CC0(Public Domain) (Get from opengameart.org https://opengameart.org/content/beep-sound)
