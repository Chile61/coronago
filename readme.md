# Corona GO App (BETA)

![Screenshot](https://coronago369135004.files.wordpress.com/2020/04/screenshot-2020-04-14-at-21.05.02.png)

Corona GO Pandemie-Stopper-App: Der Umgang mit sozialen Kontakten und die Fehleinschätzung des Risikos der exponentiellen Verbreitung der Infektionen machen die Darstellung der Personen-Kontakte für jeden Einzelnen notwendig. Zählen und addieren der Personen-Kontakte über Bluetooth – ganz automatisch “in der Hosentasche“.  

**Die Kernfunktionalität der App**

1.  Darstellung einer Kontakt-Kennzahl auf dem Smartphone (unsichtbares Netzwerk der Kontakte meiner Kontakte und wiederum deren Kontakte u.s.w.) - alle Personen, mit denen ich direkt oder indirekt Kontakt hatte, die mich möglicherweise infiziert haben könnten.
2.  Zähl-Regeln: Zeit, Distanz, Abkühlung: Man muss eine bestimmte Zeit mit einer Person zusammen sein, damit die beiden Personen-Kontakte zusammengezählt werden. Wenn man diese Person einen längeren Zeitraum anschließend nicht mehr trifft, geht der Zählstand wieder um den gleichen Wert herunter.

**WICHTIG: Diese App ersetzt keinen Arzt und kann keine Infektionswahrscheinlichkeiten ermitteln. Sie dient lediglich dazu, um sich selbst einen Überblick über die Größe der eigenen direkten und indirekten Personen-Kontakte zu verschaffen.**  

Damit die App auch im Hintergrund zählen kann, brauchen wir die Berechtigungen für Standort und Bluetooth. Solltest du diese Berechtigungen beim ersten Starten nicht erteilt haben, kannst du diese in deinen Einstellungen im Nachhinein freigeben. Schließe und öffne die App bitte in diesem Fall erneut.  

Die App benutzt Bluetooth Technologie für die Zählungen. Die GPS Berechtigung ist zwar für die Zählung nicht wesentlich, wird aber benötigt, damit die App auch im Hintergrund weiter zählen kann.

# Development setup
1. Install ionic framework `npm install -g @ionic/cli`
2. Run `npm install`
3. Run `ionic cordova platform add android` or `ionic cordova platform add ios`
4. Revert generated Android icons in repository
5. Run `ionic cordova build android` or `ionic cordova build ios`
6. Connect your device, check Android `adb devices`, USB debugging must be enabled; check iOS device in Xcode 
6. Run `ionic cordova run android` or open `patforms/ios/Corona GO.xcworkspace` and run iOS via Xcode


# Advanced
### Removed ionic icons from angular.json import to reduce bundle
```
"architect": {
            "build": {
...
assets: [


{
    "glob": "**/*.svg",
    "input": "node_modules/ionicons/dist/ionicons/svg",
    "output": "./svg"
}
```


### development build 
ionic cordova prepare [android/ios]<br>
ionic cordova prepare [android/ios] --prod


### rebuild resources/splash, icons

ionic cordova resources --splash --no-build
[Android icons sind eingecheckt sollten reverted werden, um das App Icon wiederherzustellen] 


### iOS release build

- XCode, General: make sure that the following option is unchecked: 
    - "Device Orientation: upside down" is unchecked
    - Deployment Info: Uncheck "iPad"
- XCode, Signing & Capabilities: make sure that the following Background Modes are enabled 
    - Uses Bluetooth LE accessories
    - Acts as a Bluetooth LE accessory
