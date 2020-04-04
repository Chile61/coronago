# Corona GO

## Removed ionic icons from angular.json import to reduce bundle
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


# development build 
ionic cordova prepare [android/ios]

ionic cordova prepare [android/ios] --prod


# rebuild resources/splash, icons

